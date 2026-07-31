# API Planning

## Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.fooddelivery.com/api/v1`

## Authentication
- **Method**: JWT in the `Authorization` header: `Bearer <token>`
- **Refresh Token**: Stored in a secure, HTTP-only cookie to prevent XSS.
- **Access Levels**:
  - **Public**: No token required (e.g., viewing restaurants, registering).
  - **Protected**: Valid token required (e.g., profile, placing orders).
  - **Role-Restricted**: Valid token AND specific role required (e.g., `Owner` for menu management, `Admin` for platform management).

## API Endpoints

### Auth Endpoints (`/auth`)

| Method | Path | Description | Auth Required | Roles | Request Body (Key Fields) | Response (Key Fields) | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/auth/register` | Register new user | No | Public | `name`, `email`, `password`, `role` | `token`, `user` | 201, 400 |
| POST | `/auth/login` | Authenticate user | No | Public | `email`, `password` | `token`, `user` | 200, 401 |
| POST | `/auth/logout` | Clear refresh token | Yes | All | - | `message` | 200 |
| POST | `/auth/refresh-token`| Get new access token| No | Public | (Cookie) | `token` | 200, 401 |
| POST | `/auth/verify-email/:token`| Verify user email | No | Public | - | `message` | 200, 400 |
| POST | `/auth/forgot-password`| Request reset link | No | Public | `email` | `message` | 200, 404 |
| POST | `/auth/reset-password/:token`| Reset password | No | Public | `password` | `message` | 200, 400 |
| GET  | `/auth/me` | Get current user info | Yes | All | - | `user` | 200, 401 |

### User Endpoints (`/users`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/users/profile` | Get user profile | Yes | All | - | `user` | 200 |
| PUT | `/users/profile` | Update profile | Yes | All | `name`, `phone`, `avatar` | `user` | 200, 400 |
| PATCH | `/users/change-password` | Update password | Yes | All | `currentPassword`, `newPassword` | `message` | 200, 400 |
| POST | `/users/addresses` | Add address | Yes | All | `title`, `street`, `city`... | `addresses` | 201 |
| PUT | `/users/addresses/:addressId`| Update address | Yes | All | `title`, `street`... | `addresses` | 200, 404 |
| DELETE| `/users/addresses/:addressId`| Delete address | Yes | All | - | `addresses` | 200, 404 |
| POST | `/users/favorites/restaurants/:restaurantId`| Add fav restaurant| Yes | All | - | `favorites` | 200 |
| DELETE| `/users/favorites/restaurants/:restaurantId`| Remove fav restaurant| Yes | All | - | `favorites` | 200 |
| POST | `/users/favorites/meals/:mealId`| Add fav meal | Yes | All | - | `favorites` | 200 |
| DELETE| `/users/favorites/meals/:mealId`| Remove fav meal | Yes | All | - | `favorites` | 200 |
| GET | `/users/favorites` | List all favorites | Yes | All | - | `restaurants`, `meals`| 200 |
| GET | `/users` | List all users | Yes | Admin | - | `users`, `pagination` | 200 |
| PATCH | `/users/:id/role` | Change user role | Yes | Admin | `role` | `user` | 200, 404 |
| DELETE| `/users/:id` | Delete user | Yes | Admin | - | `message` | 200, 404 |

### Restaurant Endpoints (`/restaurants`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/restaurants` | List all restaurants | No | Public | - | `restaurants`, `pagination`| 200 |
| GET | `/restaurants/featured`| Get featured | No | Public | - | `restaurants` | 200 |
| GET | `/restaurants/:id` | Get details | No | Public | - | `restaurant` | 200, 404 |
| GET | `/restaurants/:id/menu`| Get menu | No | Public | - | `categories`, `meals`| 200, 404 |
| POST | `/restaurants` | Create restaurant | Yes | Owner | `name`, `description`... | `restaurant` | 201, 400 |
| PUT | `/restaurants/:id` | Update restaurant | Yes | Owner | `name`, `openingHours`...| `restaurant` | 200, 403 |
| DELETE| `/restaurants/:id` | Delete restaurant | Yes | Owner/Admin| - | `message` | 200, 403 |
| PATCH | `/restaurants/:id/approve`| Approve listing | Yes | Admin | `isApproved` | `restaurant` | 200, 404 |
| GET | `/restaurants/:id/reviews`| Get reviews | No | Public | - | `reviews`, `pagination`| 200 |

### Category Endpoints (`/categories`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/categories` | List categories | No | Public | - | `categories` | 200 |
| GET | `/categories/:id` | Get category details| No | Public | - | `category` | 200, 404 |
| POST | `/categories` | Create category | Yes | Owner/Admin| `name`, `restaurant`... | `category` | 201, 400 |
| PUT | `/categories/:id` | Update category | Yes | Owner/Admin| `name`, `isActive`... | `category` | 200, 403 |
| DELETE| `/categories/:id` | Delete category | Yes | Owner/Admin| - | `message` | 200, 403 |

### Meal Endpoints (`/meals`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/meals` | List meals | No | Public | - | `meals`, `pagination` | 200 |
| GET | `/meals/popular` | Get popular meals | No | Public | - | `meals` | 200 |
| GET | `/meals/:id` | Get meal details | No | Public | - | `meal` | 200, 404 |
| POST | `/meals` | Create meal | Yes | Owner | `name`, `price`, `category`| `meal` | 201, 400 |
| PUT | `/meals/:id` | Update meal | Yes | Owner | `price`, `isAvailable`...| `meal` | 200, 403 |
| DELETE| `/meals/:id` | Delete meal | Yes | Owner/Admin| - | `message` | 200, 403 |
| GET | `/meals/search` | Search meals | No | Public | Query Params | `meals`, `pagination` | 200 |

### Order Endpoints (`/orders`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/orders` | Place new order | Yes | Customer | `restaurant`, `items`... | `order` | 201, 400 |
| GET | `/orders` | Get user orders | Yes | All | - | `orders`, `pagination` | 200 |
| GET | `/orders/:id` | Get order details | Yes | All | - | `order` | 200, 404 |
| PATCH | `/orders/:id/status` | Update status | Yes | Owner/Admin| `status` | `order` | 200, 400 |
| PATCH | `/orders/:id/cancel` | Cancel order | Yes | All | `cancelReason` | `order` | 200, 400 |
| POST | `/orders/:id/reorder` | Duplicate past order| Yes | Customer | - | `order` | 201, 400 |
| GET | `/orders/restaurant/:id`| Get restaurant orders| Yes | Owner | - | `orders`, `pagination` | 200, 403 |

### Review Endpoints (`/reviews`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/reviews` | Add a review | Yes | Customer | `restaurant`, `order`, `rating`, `comment` | `review` | 201, 400 |
| PUT | `/reviews/:id` | Update review | Yes | Customer | `rating`, `comment` | `review` | 200, 403 |
| DELETE| `/reviews/:id` | Delete review | Yes | Customer/Admin| - | `message` | 200, 403 |
| GET | `/reviews/restaurant/:id`| Get reviews for rest.| No | Public | - | `reviews`, `pagination` | 200 |

### Coupon Endpoints (`/coupons`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/coupons` | Create coupon | Yes | Admin | `code`, `discountValue`...| `coupon` | 201, 400 |
| GET | `/coupons` | List all coupons | Yes | Admin | - | `coupons`, `pagination` | 200 |
| GET | `/coupons/:id` | Get coupon details| Yes | Admin | - | `coupon` | 200, 404 |
| PUT | `/coupons/:id` | Update coupon | Yes | Admin | `isActive`, `endDate`...| `coupon` | 200, 404 |
| DELETE| `/coupons/:id` | Delete coupon | Yes | Admin | - | `message` | 200, 404 |
| POST | `/coupons/validate`| Validate coupon | Yes | Customer | `code`, `restaurant` | `couponDetails`| 200, 400 |

### Cart Endpoints (`/cart`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/cart` | Get cart contents | Yes | Customer | - | `cart` | 200 |
| POST | `/cart/items` | Add item | Yes | Customer | `mealId`, `quantity` | `cart` | 200 |
| PUT | `/cart/items/:itemId`| Update quantity | Yes | Customer | `quantity` | `cart` | 200 |
| DELETE| `/cart/items/:itemId`| Remove item | Yes | Customer | - | `cart` | 200 |
| DELETE| `/cart` | Clear cart | Yes | Customer | - | `message` | 200 |

### Payment Endpoints (`/payments`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/payments/create-intent`| Create Stripe intent| Yes | Customer | `orderId` | `clientSecret` | 200, 400 |
| POST | `/payments/webhook` | Stripe webhook | No | Public | (Stripe payload) | 200 | 200 |

### Upload Endpoints (`/uploads`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| POST | `/uploads/image` | Upload image | Yes | All | FormData (image) | `url`, `publicId` | 200, 400 |
| DELETE| `/uploads/image/:id`| Delete image | Yes | All | - | `message` | 200, 400 |

### Dashboard/Analytics Endpoints (`/admin/dashboard`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/admin/dashboard/stats` | High-level metrics | Yes | Admin/Owner| - | `stats` | 200 |
| GET | `/admin/dashboard/revenue`| Revenue charts | Yes | Admin/Owner| `period` | `chartData` | 200 |
| GET | `/admin/dashboard/orders` | Order trends | Yes | Admin/Owner| `period` | `chartData` | 200 |
| GET | `/admin/dashboard/users` | User acquisition | Yes | Admin | `period` | `chartData` | 200 |

### Notification Endpoints (`/notifications`)

| Method | Path | Description | Auth Required | Roles | Request Body | Response | Status Codes |
|---|---|---|---|---|---|---|---|
| GET | `/notifications` | Get notifications | Yes | All | - | `notifications`| 200 |
| PATCH | `/notifications/:id/read`| Mark as read | Yes | All | - | `notification` | 200 |
| PATCH | `/notifications/read-all`| Mark all as read | Yes | All | - | `message` | 200 |

## Standard Response Format

**Successful Response Wrapper:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "123",
    "name": "Sample Data"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Error Response Format

**Error Wrapper:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ],
  "stack": "Error: ... (Only in development environment)"
}
```

## Common Query Parameters

- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)
- `sort`: Field to sort by, use `-` for descending (e.g., `?sort=-price,name`)
- `search`: Full text search across indexable fields (e.g., `?search=pizza`)
- `fields`: Field selection/projection (e.g., `?fields=name,price,category`)

## Rate Limiting Plan

Implemented via `express-rate-limit`:
- **Auth endpoints (`/auth/*`)**: 5 requests per 15 minutes (protects against brute force)
- **General API (`/api/v1/*`)**: 100 requests per 15 minutes per IP
- **Upload (`/uploads/*`)**: 10 requests per minute

## WebSocket Events (Socket.IO)

Used for real-time updates and live synchronization.

### Client -> Server Events
- `joinRoom`: Client joins their specific room (e.g., user ID room, restaurant ID room)

### Server -> Client Events
- `order:new`: Notifies a restaurant owner of a new order
- `order:statusUpdate`: Notifies a customer that their order status changed (e.g., preparing -> ready)
- `order:cancelled`: Notifies relevant parties if an order is cancelled
- `notification:new`: Delivers real-time in-app notification (e.g., promotion, system alert)
- `restaurant:orderReceived`: Acknowledges receipt on the restaurant end
