# REST API Design Document

This document outlines the detailed REST API architecture, conventions, and schemas for the Food Delivery Web Application. The API follows RESTful principles and serves mobile applications, web frontends, and third-party integrations.

## 1. API Architecture & Conventions

### Base URL
All API requests must be prefixed with the API version path.
**Development:** `http://localhost:5000/api/v1`
**Production:** `https://api.fooddeliveryapp.com/api/v1`

### Standard Response Format
All successful responses will adhere to a consistent structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // Optional, for list endpoints
}
```

### Standard Error Format
All errors will follow this structure:
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ],
  "stack": "..." // Development environment only
}
```

### API Versioning Strategy
- **Prefix:** `/api/v1/`
- **Approach:** URL path versioning (e.g., `/v1/`, `/v2/`). This ensures backward compatibility while allowing breaking changes in future versions without affecting current clients.
- **Deprecation Policy:** Deprecated endpoints will be announced 6 months prior to removal and include a `Sunset` header indicating the deprecation date.

### Pagination Design
All list endpoints utilize offset-based pagination.
- **Parameters:** `page` (default: 1), `limit` (default: 10, max: 100)
- **Response Structure:**
```json
"pagination": {
  "page": 1,
  "limit": 10,
  "total": 145,
  "pages": 15,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### Filtering & Sorting Design
- **Filter Operators:** 
  - Exact match: `?status=delivered`
  - Range: `?price[gte]=10&price[lte]=50`
  - Regex search (text): `?search=pizza`
  - In array: `?cuisine[in]=italian,mexican`
- **Sorting:** 
  - Format: `sort=field` (ascending), `sort=-field` (descending)
  - Multiple fields: `sort=-createdAt,name` (sort by creation date descending, then name ascending)
- **Field Selection:** `fields=name,price,rating` (only return specified fields to reduce payload)

---

## 2. Detailed Request/Response Schemas (Critical Endpoints)

### 2.1. POST `/auth/register` (Customer Registration)
Registers a new customer.
- **Auth Requirements:** Public
- **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "phone": "+1234567890",
  "role": "customer" // Optional, default is customer
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "customer",
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "def50200..."
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors (e.g., weak password, invalid email).
- `409 Conflict`: Email or phone already exists.

---

### 2.2. POST `/auth/login`
Authenticates a user and issues tokens.
- **Auth Requirements:** Public
- **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "email": "john.doe@example.com",
      "role": "customer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "def50200..."
    }
  }
}
```
*Note: Refresh token is also set as an HTTP-only cookie.*

**Error Responses:**
- `401 Unauthorized`: Invalid credentials.
- `403 Forbidden`: Account deactivated or banned.

---

### 2.3. POST `/auth/refresh-token`
Generates a new access token using a valid refresh token.
- **Auth Requirements:** Requires valid Refresh Token (via HTTP-only cookie or body)
- **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "refreshToken": "def50200..." // Optional if using cookies
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Refresh token missing, invalid, or expired.
- `403 Forbidden`: Refresh token revoked.

---

### 2.4. GET `/restaurants`
Retrieves a paginated list of active restaurants with advanced filtering and sorting.
- **Auth Requirements:** Public
- **Query Parameters:**
  - `page` (number): Default `1`
  - `limit` (number): Default `10`
  - `sort` (string): e.g., `-rating`, `deliveryTime`
  - `search` (string): Text search on name/description
  - `cuisine` (string): Comma-separated list (e.g., `italian,burger`)
  - `rating[gte]` (number): Minimum rating
  - `minOrder[lte]` (number): Maximum minimum order value
  - `isActive` (boolean): Default `true`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Restaurants retrieved successfully",
  "data": [
    {
      "id": "60d0fe4f5311236168a109cb",
      "name": "Pizza Palace",
      "slug": "pizza-palace",
      "coverImage": "https://res.cloudinary.com/.../pizza.jpg",
      "cuisines": ["Italian", "Pizza"],
      "rating": 4.5,
      "deliveryTime": "30-45 min",
      "minOrder": 15.00
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2.5. POST `/orders`
Creates a new order.
- **Auth Requirements:** Bearer JWT, Role: `customer`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "restaurantId": "60d0fe4f5311236168a109cb",
  "items": [
    {
      "mealId": "60d0fe4f5311236168a109cc",
      "quantity": 2,
      "customizations": ["No onions", "Extra cheese"]
    }
  ],
  "deliveryAddressId": "60d0fe4f5311236168a109cd",
  "paymentMethod": "card",
  "couponCode": "WELCOME20", // Optional
  "notes": "Leave at the door"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD-12345678",
    "status": "pending",
    "totalAmount": 45.50,
    "discount": 5.00,
    "paymentIntentClientSecret": "pi_123_secret_456" // Included if paymentMethod is card
  }
}
```
*Note: Emits `order_created` socket event to the restaurant owner.*

**Error Responses:**
- `400 Bad Request`: Minimum order not met, invalid items, inactive restaurant.
- `404 Not Found`: Address or meal not found.
- `422 Unprocessable Entity`: Out of stock item.

---

### 2.6. PATCH `/orders/:id/status`
Updates the status of an order.
- **Auth Requirements:** Bearer JWT, Roles: `restaurant_owner`, `admin`, `driver` (if applicable)

**Request Body:**
```json
{
  "status": "preparing" 
  // Valid transitions: pending -> accepted/rejected -> preparing -> ready -> out_for_delivery -> delivered
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated to preparing",
  "data": {
    "orderId": "ORD-12345678",
    "status": "preparing",
    "updatedAt": "2024-03-20T10:05:00Z"
  }
}
```
*Note: Emits socket event `order_status_update` to the customer.*

**Error Responses:**
- `400 Bad Request`: Invalid state transition (e.g., jumping from `pending` to `delivered`).
- `403 Forbidden`: Restaurant owner attempting to update an order not belonging to their restaurant.

---

### 2.7. POST `/payments/create-intent`
Generates a Stripe PaymentIntent for an order.
- **Auth Requirements:** Bearer JWT, Role: `customer`

**Request Body:**
```json
{
  "orderId": "ORD-12345678"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment intent created",
  "data": {
    "clientSecret": "pi_3MtwBwLkdIwHu7ix28a3tq0O_secret_xyz123",
    "amount": 4550, // in cents
    "currency": "usd"
  }
}
```

---

### 2.8. POST `/coupons/validate`
Validates a coupon code against a specific order/cart payload.
- **Auth Requirements:** Bearer JWT, Role: `customer`

**Request Body:**
```json
{
  "code": "WELCOME20",
  "restaurantId": "60d0fe4f5311236168a109cb",
  "cartTotal": 50.00
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "discountAmount": 10.00,
    "finalTotal": 40.00,
    "coupon": {
      "code": "WELCOME20",
      "type": "percentage",
      "value": 20
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Minimum spend not met, coupon expired, coupon usage limit reached, coupon not valid for this restaurant.

---

## 3. API Summary Tables (Remaining Endpoints)

### Users Group (13 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/users/me` | Get current user profile | Any |
| PATCH | `/users/me` | Update profile info | Any |
| PATCH | `/users/me/password` | Change password | Any |
| GET | `/users/addresses` | Get user addresses | Any |
| POST | `/users/addresses` | Add new address | Any |
| PATCH | `/users/addresses/:id` | Update address | Any |
| DELETE | `/users/addresses/:id` | Remove address | Any |
| GET | `/users/favorites` | Get favorite restaurants | Customer |
| POST | `/users/favorites/:restaurantId` | Add favorite | Customer |
| DELETE | `/users/favorites/:restaurantId` | Remove favorite | Customer |
| GET | `/users` | List all users (admin) | Admin |
| GET | `/users/:id` | Get user details | Admin |
| PATCH | `/users/:id/status` | Ban/activate user | Admin |

### Restaurants Group (9 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/restaurants/:slug` | Get single restaurant | Public |
| POST | `/restaurants` | Create restaurant | Admin, Owner |
| PATCH | `/restaurants/:id` | Update restaurant info | Admin, Owner |
| DELETE | `/restaurants/:id` | Soft delete restaurant | Admin |
| GET | `/restaurants/my-restaurant` | Get owner's restaurant | Owner |
| PATCH | `/restaurants/my-restaurant/status` | Open/close restaurant | Owner |
| GET | `/restaurants/:id/analytics` | Restaurant basic stats | Owner, Admin |
| POST | `/restaurants/:id/documents` | Upload business docs | Owner |
| PATCH | `/restaurants/:id/verify` | Verify restaurant | Admin |

### Categories Group (5 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/categories` | List global categories | Public |
| POST | `/categories` | Create global category | Admin |
| PATCH | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |
| GET | `/categories/restaurant/:id` | List restaurant categories| Public |

### Meals Group (7 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/meals/restaurant/:id` | Get meals for restaurant | Public |
| GET | `/meals/:id` | Get single meal detail | Public |
| POST | `/meals` | Create meal | Owner |
| PATCH | `/meals/:id` | Update meal | Owner |
| DELETE | `/meals/:id` | Delete meal | Owner |
| PATCH | `/meals/:id/stock` | Update meal stock/status | Owner |
| GET | `/meals/search` | Global meal search | Public |

### Orders Group (Remaining 5 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/orders/my-orders` | Get user's order history | Customer |
| GET | `/orders/:id` | Get order details | Cust, Owner, Admin |
| GET | `/orders/restaurant` | Get restaurant orders | Owner |
| GET | `/orders` | Get all orders | Admin |
| PATCH | `/orders/:id/cancel` | Cancel order | Customer, Admin |

### Reviews Group (4 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/reviews/restaurant/:id` | Get reviews for restaurant| Public |
| POST | `/reviews` | Add review (after delivery) | Customer |
| PATCH | `/reviews/:id/reply` | Owner replies to review | Owner |
| DELETE | `/reviews/:id` | Delete review | Admin |

### Cart Group (5 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/cart` | Get current cart | Customer |
| POST | `/cart/items` | Add item to cart | Customer |
| PATCH | `/cart/items/:itemId` | Update item quantity | Customer |
| DELETE | `/cart/items/:itemId` | Remove item | Customer |
| DELETE | `/cart` | Clear entire cart | Customer |

### Admin Dashboard (4 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/admin/stats/overview` | Platform wide KPIs | Admin |
| GET | `/admin/stats/revenue` | Revenue charts data | Admin |
| GET | `/admin/reports/users` | User growth report | Admin |
| GET | `/admin/reports/restaurants` | Rest. performance report | Admin |

### Notifications (3 endpoints)
| Method | Endpoint | Description | Auth (Role) |
|---|---|---|---|
| GET | `/notifications` | Get user notifications | Any |
| PATCH | `/notifications/:id/read` | Mark as read | Any |
| PATCH | `/notifications/read-all` | Mark all as read | Any |
