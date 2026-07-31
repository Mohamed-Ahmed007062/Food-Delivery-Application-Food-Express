# Validation Strategy

This document outlines the comprehensive validation strategy for the Food Delivery Web Application. The strategy ensures data integrity, security, and consistent user experience across both the backend (Node.js/Express) and frontend (React).

## 1. Backend Validation Layers

We employ a multi-layered validation approach on the backend to enforce strict data correctness and prevent invalid data from propagating through the system.

### 1.1 Request Validation (Zod)
The first line of defense is request validation using **Zod** at the middleware level, before requests reach controllers.

- **Scope**: Validation of `req.body`, `req.params`, and `req.query`.
- **Implementation**: Zod schemas are defined per feature (e.g., `registerSchema`, `loginSchema`).
- **Middleware**: A generic `validate(schema)` middleware is used. It parses the incoming request, strips unknown fields, and returns a structured `400 Bad Request` containing precise Zod error messages upon failure.
- **Schema Composition**: Leveraging Zod's flexibility, we define base schemas and extend them to create specific schemas (e.g., `createRestaurantSchema` and `updateRestaurantSchema` using `.partial()`).

### 1.2 Mongoose Validation
Mongoose serves as the second safety net, enforcing validation at the database schema level.

- **Built-in Validators**: Utilizing required fields, enum constraints, min/max values for numbers, and string length limits.
- **Custom Validators**: Implementing specific regex patterns (e.g., email format, phone numbers) and conditional validation (e.g., price > 0, end date > start date).
- **Purpose**: Prevents invalid data from bypassing the API layer (e.g., through direct DB manipulation or background jobs).

### 1.3 Business Logic Validation
Domain-specific rules are validated in the **Service Layer** to maintain Clean Architecture.

- **State Transitions**: Validating order status flows (e.g., an order cannot transition from `delivered` back to `preparing`).
- **Domain Constraints**: 
  - Coupon validity checks (date ranges, usage limits, minimum order amounts).
  - Restaurant ownership verification for management actions.
  - Ensuring constraints like one review per order per user.

---

## 2. Frontend Validation Layers

The frontend validation mirrors the backend rules to provide immediate, real-time feedback to users without unnecessary API calls.

### 2.1 Form Validation (React Hook Form + Zod)
- **Shared Schemas**: Zod schemas are mirrored from backend TypeScript types to ensure absolute consistency.
- **UX Integration**: 
  - Real-time validation triggered `onBlur` and `onChange`.
  - Error messages are displayed inline beneath form fields.
- **Resolver**: Using `@hookform/resolvers/zod` to seamlessly integrate Zod schemas with React Hook Form.

### 2.2 API Response Validation
- **Optional but Recommended**: Validating incoming API responses against expected Zod schemas to catch silent backend changes and prevent runtime crashes in the UI.

---

## 3. Shared Validation Schemas

To ensure consistency, the following Zod schemas are defined. They dictate the exact structure and rules for incoming data.

### Auth
- **`registerSchema`**: `email` (email format), `password` (min 8 chars, strong), `firstName` (min 2 chars), `lastName` (min 2 chars), `role` (enum: Customer, RestaurantOwner).
- **`loginSchema`**: `email` (email format), `password` (string).
- **`forgotPasswordSchema`**: `email` (email format).
- **`resetPasswordSchema`**: `password` (min 8 chars), `token` (string).

### User
- **`updateProfileSchema`**: Partial of `registerSchema` excluding email and role.
- **`changePasswordSchema`**: `currentPassword` (string), `newPassword` (min 8 chars).
- **`addressSchema`**: `street` (string), `city` (string), `state` (string), `zipCode` (string), `coordinates` (optional object).

### Restaurant
- **`createRestaurantSchema`**: `name` (string), `description` (string), `address` (addressSchema), `cuisineType` (array of strings), `deliveryRadius` (number > 0).
- **`updateRestaurantSchema`**: Partial of `createRestaurantSchema`.

### Category & Meal
- **`createCategorySchema`**: `name` (string), `description` (optional string), `restaurantId` (mongoId).
- **`updateCategorySchema`**: Partial of `createCategorySchema`.
- **`createMealSchema`**: `name` (string), `description` (string), `price` (number > 0), `categoryId` (mongoId), `isAvailable` (boolean), `addons` (array of objects).
- **`updateMealSchema`**: Partial of `createMealSchema`.

### Order
- **`createOrderSchema`**: `restaurantId` (mongoId), `items` (array of { mealId, quantity, addons }), `deliveryAddressId` (mongoId), `paymentMethod` (enum), `couponCode` (optional string).
- **`cancelOrderSchema`**: `reason` (string).
- **`updateStatusSchema`**: `status` (enum: Pending, Confirmed, Preparing, OutForDelivery, Delivered, Cancelled).

### Review
- **`createReviewSchema`**: `orderId` (mongoId), `rating` (number 1-5), `comment` (optional string).
- **`updateReviewSchema`**: Partial of `createReviewSchema`.

### Coupon
- **`createCouponSchema`**: `code` (string uppercase), `discountType` (enum: percentage, fixed), `discountValue` (number > 0), `validFrom` (date), `validUntil` (date), `usageLimit` (number > 0).
- **`updateCouponSchema`**: Partial of `createCouponSchema`.
- **`validateCouponSchema`**: `code` (string), `cartTotal` (number > 0).

### Cart
- **`addItemSchema`**: `mealId` (mongoId), `quantity` (number > 0), `addons` (array).
- **`updateItemSchema`**: `quantity` (number >= 0).

### Query Parameters
- **`paginationSchema`**: `page` (number >= 1), `limit` (number >= 1, max 100).
- **`searchSchema`**: `q` (string).
- **`filterSchema`**: `cuisine` (string), `minRating` (number), `maxDeliveryTime` (number).

---

## 4. Error Message Strategy

A centralized error messaging strategy ensures all validation errors are user-friendly and actionable.

- **Consistent Format**: All validation errors follow the `{ field, message }` structure.
- **User-Friendly Messages**: Zod default errors like "String must contain at least 8 character(s)" are overridden with intuitive messages like "Password must be at least 8 characters long."
- **i18n-Ready**: Error strings use translation keys (e.g., `validation.auth.passwordMinLength`) allowing future localization support on the frontend.
