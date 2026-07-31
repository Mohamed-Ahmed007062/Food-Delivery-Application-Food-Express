# Architecture Decision Records (ADR)

> This document captures all significant architecture and technology decisions for the Food Delivery Web Application. Each record follows a lightweight ADR format: **Context → Decision → Rationale → Consequences**.

---

## ADR-001: MERN Stack with TypeScript

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Tech Stack |

**Context**: We need a full-stack framework for a production food delivery platform supporting real-time features, payments, and role-based access.

**Decision**: Use MongoDB + Express.js + React 19 + Node.js (MERN) with TypeScript in strict mode on both client and server.

**Rationale**:
- JavaScript/TypeScript across the entire stack reduces context switching.
- MongoDB's document model maps naturally to restaurant menus, orders, and user profiles.
- React 19 provides the latest concurrent features and performance improvements.
- TypeScript strict mode catches type errors at compile time, reducing runtime bugs.

**Consequences**:
- ✅ Single language across full stack.
- ✅ Strong type safety with strict mode.
- ⚠️ Team must be proficient in TypeScript.
- ⚠️ MongoDB requires careful schema design (no enforced relations).

---

## ADR-002: Clean Architecture with Feature-Based Folders

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Architecture |

**Context**: The application has 12+ feature modules (auth, restaurants, meals, orders, cart, etc.). We need a scalable structure that separates concerns.

**Decision**: Apply Clean Architecture principles with a feature-based folder structure. Each feature module colocates its controller, service, model, validation, routes, and types.

**Rationale**:
- Clean Architecture enforces inward dependency flow — domain logic stays framework-agnostic.
- Feature-based folders reduce cognitive load vs. layer-based (`/controllers/`, `/models/`) where related files are scattered.
- Extracting a feature into a microservice becomes a folder-level operation.

**Consequences**:
- ✅ High cohesion within features.
- ✅ Easy to navigate, add, or remove features.
- ⚠️ Shared code must go in explicit `shared/` directories to avoid cross-feature imports.

---

## ADR-003: TanStack Query for Server State

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Frontend State |

**Context**: The app is primarily data-driven (CRUD on restaurants, meals, orders). We need to manage server state (API data) efficiently with caching, background refetching, and optimistic updates.

**Decision**: Use TanStack Query (React Query v5) for all server state. Reserve React Context or Zustand for minimal client-only state (theme, sidebar toggle).

**Rationale**:
- Redux is overkill — 90%+ of state originates from the server.
- TanStack Query provides built-in caching, deduplication, background sync, retry logic, pagination, and infinite scroll support.
- Reduces boilerplate vs. Redux Toolkit Query or SWR.

**Consequences**:
- ✅ Automatic cache invalidation and background refetching.
- ✅ Built-in loading/error states — no manual management.
- ✅ Smaller bundle vs. Redux.
- ⚠️ Complex client-only state (rare) may need a separate solution.

---

## ADR-004: Zod for Cross-Stack Validation

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Validation |

**Context**: Every feature requires input validation on both frontend (forms) and backend (API). Duplicating validation logic creates drift.

**Decision**: Use Zod as the single validation library on both client and server. Frontend integrates via `@hookform/resolvers/zod`; backend uses a `validate(schema)` Express middleware.

**Rationale**:
- Zod schemas produce TypeScript types via `z.infer<>`, eliminating manual type duplication.
- Same validation language on both sides ensures consistent rules.
- Lightweight (12KB gzipped) compared to Yup or Joi.

**Consequences**:
- ✅ Type-safe validation with zero drift.
- ✅ Composable schemas (`.partial()`, `.pick()`, `.extend()`).
- ⚠️ Schemas are mirrored, not shared via monorepo (simpler setup, slight duplication).

---

## ADR-005: shadcn/ui over Material UI or Ant Design

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | UI Components |

**Context**: We need a component library that provides accessible, customizable UI primitives without heavy bundle overhead.

**Decision**: Use shadcn/ui with Tailwind CSS. Components are copied into the project (not installed as a dependency).

**Rationale**:
- Full ownership — components live in `src/components/ui/`, fully editable.
- No version lock-in or breaking updates from an external library.
- Built on Radix UI primitives = WCAG 2.1 accessible by default.
- Tailwind-native = consistent with our styling approach.
- Material UI adds ~100KB+ to the bundle and requires heavy theme overrides.

**Consequences**:
- ✅ Zero bundle overhead from a component library.
- ✅ Full customization control.
- ⚠️ Must maintain copied components manually (no auto-updates).
- ⚠️ Fewer pre-built complex components than MUI (data tables, date pickers may need additional work).

---

## ADR-006: JWT Access Token + HTTP-Only Refresh Cookie

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Authentication |

**Context**: We need stateless authentication that works across REST API and Socket.IO, with protection against XSS and CSRF.

**Decision**: Short-lived JWT access token (15 min) stored in client memory + long-lived refresh token (7 days) in an HTTP-only, Secure, SameSite=Strict cookie. Token rotation on every refresh.

**Rationale**:
- Access token in memory (not localStorage) → immune to XSS.
- Refresh token in HTTP-only cookie → inaccessible to JavaScript.
- SameSite=Strict → mitigates CSRF.
- Token rotation → limits the window if a refresh token is compromised.
- Stateless access tokens reduce DB lookups per request.

**Consequences**:
- ✅ Strong XSS and CSRF protection.
- ✅ Stateless verification for access tokens (fast).
- ⚠️ Token lost on page refresh (requires silent refresh on app load).
- ⚠️ Refresh token stored in DB (one DB query per refresh, acceptable).

---

## ADR-007: MongoDB Atlas over Self-Hosted MongoDB

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Database |

**Context**: We need a MongoDB deployment that is reliable, requires minimal ops, and scales from free tier to production.

**Decision**: Use MongoDB Atlas (managed cloud) for all environments.

**Rationale**:
- Free M0 tier for development — no cost during prototyping.
- Automated backups, monitoring, and scaling on paid tiers.
- Built-in Atlas Search for future full-text search enhancements.
- No infrastructure management overhead.

**Consequences**:
- ✅ Zero ops for database management.
- ✅ Seamless vertical scaling (M0 → M10 → M30).
- ⚠️ Vendor lock-in to MongoDB Atlas (mitigated by standard MongoDB wire protocol).
- ⚠️ Network latency if regions don't match backend host.

---

## ADR-008: Stripe for Payments (No Card Data on Server)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Payments |

**Context**: We need to accept online card payments securely without PCI compliance burden.

**Decision**: Use Stripe with PaymentIntents API + Stripe Elements on the frontend. Card data never touches our server. Webhook for payment confirmation.

**Rationale**:
- Stripe Elements handles card input → PCI compliance is Stripe's responsibility.
- PaymentIntents support 3D Secure and SCA (Strong Customer Authentication).
- Webhook-driven confirmation is reliable (survives network failures, browser closes).
- Server calculates amount — client cannot tamper with totals.

**Consequences**:
- ✅ PCI SAQ-A compliance (lowest burden).
- ✅ Supports refunds, disputes, and multiple currencies.
- ⚠️ Stripe fees (~2.9% + $0.30 per transaction).
- ⚠️ Webhook endpoint must verify signatures and be idempotent.

---

## ADR-009: Socket.IO over Native WebSockets

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Real-Time |

**Context**: We need real-time updates for order status, notifications, and restaurant dashboards.

**Decision**: Use Socket.IO v4 with rooms-based architecture.

**Rationale**:
- Socket.IO provides automatic reconnection, fallback to long-polling, and room abstraction.
- Rooms map naturally to our use cases: `user:{id}`, `restaurant:{id}`, `order:{id}`, `admin`.
- Built-in acknowledgments and error handling.
- TypeScript types available via `@socket.io/types`.

**Consequences**:
- ✅ Reliable connections with automatic reconnection and heartbeat.
- ✅ Room-based broadcasting is intuitive and efficient.
- ⚠️ Slightly larger bundle than native WebSocket.
- ⚠️ Multi-server scaling requires Redis adapter (deferred to post-MVP).

---

## ADR-010: Cloudinary for Image Management

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | File Storage |

**Context**: The app handles multiple image types (avatars, logos, covers, meals, categories). We need CDN-backed storage with on-the-fly transformations.

**Decision**: Use Cloudinary with server-side uploads via Multer. No direct client-to-Cloudinary uploads.

**Rationale**:
- Automatic format conversion (WebP), quality optimization, and responsive images.
- CDN delivery for fast global image loading.
- Server-side upload gives us validation control (type, size) before the image reaches Cloudinary.
- Organized folder structure on Cloudinary (`food-delivery/avatars/`, `meals/`, etc.).

**Consequences**:
- ✅ Optimized images out of the box.
- ✅ No file system management on our server.
- ⚠️ Cloudinary free tier has bandwidth/storage limits.
- ⚠️ Server-side upload adds latency vs. direct upload (acceptable trade-off for security).

---

## ADR-011: Vercel (Frontend) + Render (Backend) Deployment

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Deployment |

**Context**: We need hosting for a React SPA and an Express API + Socket.IO server.

**Decision**: Deploy frontend to Vercel and backend to Render.

**Rationale**:
- Vercel excels at static/SPA hosting with global CDN, automatic HTTPS, and preview deployments.
- Render supports persistent WebSocket connections (Socket.IO) and background workers.
- Both offer free tiers suitable for development and staging.
- Both support auto-deploy from Git.

**Consequences**:
- ✅ Zero-config frontend deployment with Vercel.
- ✅ WebSocket support on Render.
- ⚠️ Render free tier has cold starts (~30s spin-up after inactivity).
- ⚠️ CORS must be configured to allow Vercel origin.

---

## ADR-012: Winston + Morgan for Logging

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Observability |

**Context**: We need structured logging for debugging, auditing, and production monitoring.

**Decision**: Use Winston for application logging with Morgan for HTTP request logging. Sensitive fields are automatically redacted.

**Rationale**:
- Winston supports multiple transports (console, file, external services).
- Morgan integrates with Winston's stream for unified logging.
- JSON-structured logs in production enable log aggregation and searching.
- Pino is faster but Winston has a richer transport ecosystem.

**Consequences**:
- ✅ Structured, searchable logs in production.
- ✅ Automatic sensitive field redaction (passwords, tokens).
- ⚠️ Slightly slower than Pino (negligible for our scale).

---

## ADR-013: Server-Side Cart over Client-Side Only

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Data Architecture |

**Context**: The cart needs coupon validation, delivery fee calculation, and tax computation — all requiring server-side data.

**Decision**: Store cart in a server-side MongoDB collection (or embedded in the User document). Not purely client-side (localStorage).

**Rationale**:
- Server-side cart enables cross-device syncing (phone → desktop).
- Coupon validation and price calculations happen server-side — can't be faked.
- Cart persists across sessions (user doesn't lose items on browser close).
- Single-restaurant constraint is enforced server-side.

**Consequences**:
- ✅ Persistent, cross-device cart.
- ✅ Server-enforced business rules.
- ⚠️ Every cart operation requires an API call.
- ⚠️ Slight latency vs. localStorage (mitigated by TanStack Query optimistic updates).

---

## ADR-014: Single Restaurant per Order

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | Business Rule |

**Context**: Should a customer be able to order from multiple restaurants in a single checkout?

**Decision**: No. Each order is bound to a single restaurant, matching the model used by Talabat, Uber Eats, and Deliveroo.

**Rationale**:
- Simplifies delivery logistics (one pickup location per order).
- Simplifies order lifecycle (single restaurant manages status transitions).
- Simplifies fee calculation (one delivery fee, one restaurant's minimum order).
- Multi-restaurant checkout would require an orchestration layer and split payments.

**Consequences**:
- ✅ Simple, proven order model.
- ✅ Clear ownership (one restaurant per order for status management).
- ⚠️ Customer must place separate orders for different restaurants.

---

## ADR-015: Offset Pagination over Cursor Pagination

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Category** | API Design |

**Context**: Lists (restaurants, meals, orders, reviews) need pagination. Two approaches: offset-based (`?page=2&limit=10`) or cursor-based (`?after=abc123`).

**Decision**: Use offset-based pagination with `page` + `limit` parameters.

**Rationale**:
- Simpler to implement and understand.
- Users can jump to any page (page 1 → page 5) — cursor pagination only supports next/prev.
- Sufficient for our data volumes (thousands, not millions of records per query).
- Infinite scroll on frontend works fine with offset pagination + TanStack Query's `useInfiniteQuery`.

**Consequences**:
- ✅ Random page access (admin tables with page numbers).
- ✅ Standard, well-understood pattern.
- ⚠️ Inconsistencies possible if data changes between page requests (acceptable for our use case).
- ⚠️ Performance degrades at very high offsets (mitigated by indexing; our data scale won't hit this).

---

## Decision Summary

| ADR | Decision | Category |
|-----|----------|----------|
| 001 | MERN + TypeScript Strict | Tech Stack |
| 002 | Clean Architecture + Feature Folders | Architecture |
| 003 | TanStack Query for Server State | Frontend State |
| 004 | Zod Cross-Stack Validation | Validation |
| 005 | shadcn/ui + Tailwind CSS | UI Components |
| 006 | JWT in Memory + Refresh in Cookie | Authentication |
| 007 | MongoDB Atlas (Managed) | Database |
| 008 | Stripe PaymentIntents + Webhooks | Payments |
| 009 | Socket.IO with Rooms | Real-Time |
| 010 | Cloudinary Server-Side Upload | File Storage |
| 011 | Vercel + Render | Deployment |
| 012 | Winston + Morgan | Observability |
| 013 | Server-Side Cart | Data Architecture |
| 014 | Single Restaurant per Order | Business Rule |
| 015 | Offset Pagination | API Design |
