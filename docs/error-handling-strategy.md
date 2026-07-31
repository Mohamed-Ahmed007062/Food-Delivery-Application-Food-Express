# Error Handling Strategy

This document defines the unified error handling architecture for the Food Delivery Web Application. Our goal is to ensure predictable API responses, simplify debugging, and provide excellent developer and user experiences.

## 1. Custom Error Classes

We use a custom exception hierarchy extending a base `AppError` class. This allows us to throw strongly-typed errors throughout the application logic.

```text
AppError (base)
├── BadRequestError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── ValidationError (422)
├── TooManyRequestsError (429)
└── InternalServerError (500)
```

### Properties of `AppError`
- **`statusCode`**: The HTTP status code (e.g., 404, 500).
- **`message`**: A human-readable description of the error.
- **`isOperational`**: Boolean flag. `true` for expected errors (e.g., validation failure, not found), `false` for unexpected programming bugs (e.g., unhandled promise rejection).
- **`errors`**: Optional array containing detailed validation issues.

---

## 2. Error Handling Middleware

A centralized global error handling middleware acts as the **last** layer in the Express request pipeline.

- **Catch-All**: Intercepts all `next(error)` calls and thrown exceptions.
- **Classification**: Distinguishes between `isOperational` errors and programming bugs.
- **Environment Awareness**:
  - **Development**: Returns the full error object, message, and stack trace.
  - **Production**: Returns specific messages for operational errors, but masks programming bugs behind a generic "Something went wrong" message to prevent information leakage.

---

## 3. Error Handling Patterns

### Controller & Service Level
- **Service Layer**: Business logic should strictly throw custom `AppError` instances when constraints are violated.
- **Controller Layer**: Utilizes an `asyncHandler` wrapper to automatically catch asynchronous exceptions and forward them to the global error middleware, completely eliminating repetitive `try-catch` blocks.

### Third-Party & Infrastructure Error Mapping
Errors originating from external libraries or infrastructure are mapped to standard `AppError` subclasses:
- **Mongoose Errors**: 
  - `CastError` (invalid ID) → `BadRequestError`
  - `ValidationError` → `ValidationError (422)`
  - Duplicate key error (`11000`) → `ConflictError (409)`
- **JWT Errors**: `TokenExpiredError`, `JsonWebTokenError` → `UnauthorizedError (401)`
- **Multer Errors**: File too large, wrong mime type → `BadRequestError (400)`
- **Stripe Errors**: Card declined, rate limit → mapped appropriately (e.g., `PaymentRequiredError` or `BadRequestError`).

---

## 4. Frontend Error Handling

The frontend application (React) consumes backend errors in a standardized manner.

- **Axios Interceptors**: A global interceptor handles generic API errors, formatting them for UI consumption.
- **TanStack Query**: Error callbacks (`onError`) are utilized within mutations and queries to handle state transitions.
- **Error Boundaries**: React Error Boundaries catch component-level rendering errors, displaying a fallback UI instead of crashing the app.
- **Toast Notifications**: Operational errors (like validation or conflicts) are surfaced to the user via toast notifications (shadcn/ui toast).
- **Auth Flow Recovery**: Interceptors catch `401 Unauthorized` responses and automatically redirect the user to the login page.
- **Resilience**: Implementation of retry logic (via TanStack Query) for transient failures (e.g., `503 Service Unavailable`).

---

## 5. Error Response Format

To ensure the frontend can reliably parse errors, the API guarantees a consistent JSON payload structure for all non-2xx responses.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "stack": "Error: ... (Included in development environment only)"
}
```

---

## 6. The `asyncHandler` Utility

To maintain clean and readable controller code, we utilize an `asyncHandler` utility. This higher-order function wraps async controller methods and ensures any rejected promises are forwarded to Express's `next` function.

**Pattern Concept:**
```typescript
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
export const createRestaurant = asyncHandler(async (req, res) => {
  const data = await restaurantService.create(req.body);
  res.status(201).json({ success: true, data });
});
```
This pattern enforces consistency and removes boilerplate error handling across the routing layer.
