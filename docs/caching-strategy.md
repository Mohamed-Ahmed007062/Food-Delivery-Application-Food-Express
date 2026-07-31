# Caching Strategy

> This document defines the caching approach across all layers of the Food Delivery Web Application — from browser to CDN to API to database.

---

## 1. Frontend Caching (TanStack Query)

TanStack Query is the primary caching layer for all server state on the frontend.

### Cache Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| `staleTime` (default) | 5 minutes | Data is considered fresh for 5 min; no refetch on component remount |
| `gcTime` (garbage collection) | 30 minutes | Inactive cache entries are garbage-collected after 30 min |
| `refetchOnWindowFocus` | `true` | Ensures data freshness when user returns to the tab |
| `refetchOnReconnect` | `true` | Syncs data after network recovery |
| `retry` | `3` | Retries failed requests with exponential backoff |

### Per-Resource Cache Tuning

| Resource | `staleTime` | `gcTime` | Rationale |
|----------|-------------|----------|-----------|
| Restaurants list | 5 min | 30 min | Changes infrequently; safe to cache |
| Restaurant details | 5 min | 30 min | Mostly static (info, menu) |
| Meals list | 5 min | 30 min | Menu items don't change frequently |
| Categories | 10 min | 60 min | Very stable data |
| User profile | 10 min | 60 min | Rarely changes within a session |
| Cart | 0 (always stale) | 5 min | Must always reflect latest state |
| Active orders | 0 (always stale) | 5 min | Real-time data via Socket.IO |
| Order history | 5 min | 30 min | Historical data; stable once created |
| Notifications | 0 (always stale) | 10 min | Real-time delivery via Socket.IO |
| Dashboard stats | 2 min | 10 min | Near-real-time for admin/owner |
| Search results | 1 min | 5 min | Short-lived; query-dependent |

### Query Key Strategy

Consistent query keys enable targeted invalidation:

```
['restaurants']                          → all restaurants
['restaurants', { page, filters }]       → filtered/paginated list
['restaurants', restaurantId]            → single restaurant
['restaurants', restaurantId, 'menu']    → restaurant menu
['meals', 'popular']                     → popular meals
['cart']                                 → user cart
['orders']                               → user order history
['orders', orderId]                      → single order
['user', 'profile']                      → current user
['user', 'favorites']                    → user favorites
['notifications']                        → user notifications
['admin', 'dashboard', 'stats']          → admin stats
```

### Cache Invalidation Patterns

| Trigger | Invalidation | Method |
|---------|-------------|--------|
| Order placed | `['cart']`, `['orders']` | `queryClient.invalidateQueries` |
| Order status update (Socket.IO) | `['orders', orderId]` | `queryClient.setQueryData` (direct update) |
| Review submitted | `['restaurants', restaurantId]` | `invalidateQueries` |
| Profile updated | `['user', 'profile']` | `setQueryData` |
| Meal added to cart | `['cart']` | Optimistic update + `invalidateQueries` |
| Cart item removed | `['cart']` | Optimistic update + `invalidateQueries` |
| Favorite toggled | `['user', 'favorites']` | Optimistic update |
| Admin approves restaurant | `['restaurants']` | `invalidateQueries` |
| Coupon applied | `['cart']` | `invalidateQueries` |

### Optimistic Updates

Used for operations where instant UI feedback is critical:

- **Add to cart** — Item appears immediately; rolls back on API failure.
- **Remove from cart** — Item disappears immediately.
- **Toggle favorite** — Heart icon toggles immediately.
- **Mark notification read** — Badge count decrements immediately.

Pattern:
```
onMutate → snapshot current cache → apply optimistic change
onError  → rollback to snapshot
onSettled → invalidate query to sync with server
```

---

## 2. Real-Time Cache Updates (Socket.IO)

For data that changes via Socket.IO events, we update the TanStack Query cache directly instead of refetching:

| Socket Event | Cache Action |
|-------------|-------------|
| `order:statusUpdate` | `setQueryData(['orders', orderId], updatedOrder)` |
| `order:new` | `invalidateQueries(['orders'])` on restaurant dashboard |
| `notification:new` | Prepend to `['notifications']` cache |
| `order:cancelled` | `setQueryData(['orders', orderId], { status: 'cancelled' })` |

This avoids unnecessary API calls while keeping the UI synchronized.

---

## 3. HTTP Caching (Backend Response Headers)

### Static Assets (Vercel CDN)

| Asset Type | `Cache-Control` | Rationale |
|-----------|----------------|-----------|
| JS/CSS bundles (hashed) | `public, max-age=31536000, immutable` | Content-hashed filenames; safe to cache forever |
| Images (Cloudinary) | `public, max-age=2592000` | 30-day cache; Cloudinary handles versioning via URL |
| `index.html` | `no-cache` | Must always fetch latest to get correct bundle references |
| Fonts (Google Fonts) | `public, max-age=31536000` | Stable, versioned resources |

### API Responses

| Endpoint Pattern | `Cache-Control` | Rationale |
|-----------------|----------------|-----------|
| `GET /restaurants` | `private, max-age=300` | 5 min; data changes infrequently |
| `GET /restaurants/:id` | `private, max-age=300` | 5 min; restaurant details are stable |
| `GET /categories` | `private, max-age=600` | 10 min; categories rarely change |
| `GET /meals/popular` | `private, max-age=300` | 5 min; popular list refreshes periodically |
| `GET /cart` | `no-store` | Must always be fresh; user-specific |
| `GET /orders/:id` | `no-store` | Real-time status; user-specific |
| `GET /user/profile` | `no-store` | Sensitive; user-specific |
| `GET /notifications` | `no-store` | Real-time; user-specific |
| `POST/PUT/PATCH/DELETE` | `no-store` | Mutation responses are never cached |

### ETag Strategy

- Enabled for `GET /restaurants/:id` and `GET /meals/:id` via Express `etag` middleware.
- Server returns `304 Not Modified` when content hasn't changed, saving bandwidth.
- Not used for user-specific or real-time data.

---

## 4. Database Query Optimization

### MongoDB Indexes (Query Performance)

All frequently queried fields are indexed (defined in `database-planning.md`). Key indexes that act as a "cache" for query performance:

| Collection | Index | Query Pattern |
|-----------|-------|--------------|
| Restaurants | `{ slug: 1 }` unique | Slug-based lookups |
| Restaurants | `{ name: 'text', description: 'text' }` | Full-text search |
| Meals | `{ restaurant: 1, category: 1 }` compound | Menu browsing |
| Meals | `{ name: 'text', description: 'text' }` | Meal search |
| Orders | `{ customer: 1, createdAt: -1 }` compound | Order history |
| Orders | `{ restaurant: 1, status: 1 }` compound | Restaurant dashboard |
| Reviews | `{ restaurant: 1 }` | Restaurant reviews |
| Notifications | `{ user: 1, createdAt: -1 }` compound | User notifications |

### Computed Fields (Denormalization)

Some values are precomputed and stored to avoid expensive aggregations on every read:

| Field | Collection | Computation | Update Trigger |
|-------|-----------|-------------|---------------|
| `rating` | Restaurants | Average of all Reviews for this restaurant | Post-save hook on Reviews |
| `totalReviews` | Restaurants | Count of Reviews for this restaurant | Post-save/remove hook on Reviews |
| `usedCount` | Coupons | Increment on order placement | Order creation service |

This trades write-time cost for significantly faster reads on high-traffic pages (restaurant listing, details).

### Lean Queries

Use `.lean()` for read-only queries that don't need Mongoose document methods:
- Restaurant listings
- Meal searches
- Order history
- Review listings

`.lean()` returns plain JavaScript objects, skipping Mongoose hydration — **2-5x faster** for read-heavy operations.

---

## 5. Image Caching (Cloudinary CDN)

Cloudinary serves images through its global CDN with automatic caching:

| Feature | Configuration |
|---------|--------------|
| CDN caching | Automatic; Cloudinary handles edge caching globally |
| Browser caching | `Cache-Control: public, max-age=2592000` (30 days) |
| URL-based invalidation | New upload → new URL (publicId changes); old cache naturally expires |
| Format optimization | Auto-WebP delivery based on browser `Accept` header |
| Responsive images | `w_auto,dpr_auto` for device-appropriate resolution |
| Lazy loading | Frontend `loading="lazy"` on `<img>` tags below the fold |

---

## 6. Browser Storage

| Storage | Used For | TTL |
|---------|----------|-----|
| Memory (JS variable) | Access token | Until page refresh |
| HTTP-only cookie | Refresh token | 7 days (server-managed) |
| `localStorage` | Theme preference (`light`/`dark`) | Persistent |
| `localStorage` | Last selected delivery address ID | Persistent |
| `sessionStorage` | Not used | — |

> **Security rule**: No tokens, user data, or sensitive information in `localStorage` or `sessionStorage`.

---

## 7. Future Considerations

### Redis (Post-MVP)

If scaling requires it, Redis can be introduced for:

| Use Case | Benefit |
|----------|---------|
| API response caching | Sub-ms reads for hot endpoints (popular restaurants, trending meals) |
| Session store | Replace DB-based refresh token storage |
| Rate limiting | Distributed counters across multiple server instances |
| Socket.IO adapter | Multi-instance WebSocket support |
| Queue | Background job processing (email sending, image processing) |

> **Current decision**: Not needed for single-server Render deployment. Revisit when scaling beyond one backend instance.

---

## Cache Decision Matrix

| Layer | Tool | Scope | TTL | Invalidation |
|-------|------|-------|-----|-------------|
| Browser (API data) | TanStack Query | Per-user, in-memory | 0–10 min | Query invalidation, optimistic updates, Socket.IO |
| Browser (assets) | HTTP Cache | Global | Immutable / 30 days | Content hashing (Vite) |
| CDN (images) | Cloudinary CDN | Global | 30 days | URL change on re-upload |
| CDN (frontend) | Vercel Edge | Global | Immutable bundles | Redeployment |
| API (headers) | Express `Cache-Control` | Per-endpoint | 0–10 min | Time-based expiry, ETag |
| Database | MongoDB indexes + denormalization | Per-collection | N/A | Hooks, computed on write |
| Future | Redis | Shared, cross-instance | Configurable | TTL, explicit invalidation |
