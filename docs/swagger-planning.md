# Swagger / OpenAPI Implementation Plan

This document outlines the strategy for documenting the REST API using Swagger (OpenAPI 3.0.3) for the Food Delivery Web Application.

## 1. Setup & Configuration

### Dependencies
```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

### Base Configuration (`src/config/swagger.ts`)
```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Food Delivery API',
      version: '1.0.0',
      description: 'API documentation for the Food Delivery Web Application',
      contact: {
        name: 'API Support',
        email: 'support@fooddelivery.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.fooddeliveryapp.com/api/v1',
        description: 'Production server',
      },
    ],
    // Security scheme will be merged here
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/docs/*.ts'], // Paths to files with JSDoc
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true, // Keep token on page reload
    }
  }));
};
```

## 2. Security Schemes
We use JWT Bearer authentication. This needs to be defined globally.

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```
Global application of security (optional, can be applied per route):
```yaml
security:
  - BearerAuth: []
```

## 3. Tag Definitions
Group endpoints by logical features.

```yaml
tags:
  - name: Auth
    description: Authentication, Registration, and Tokens
  - name: Users
    description: User Profile and Address Management
  - name: Restaurants
    description: Restaurant browsing and management
  - name: Meals
    description: Meal and menu management
  - name: Orders
    description: Order processing, checkout, and tracking
  - name: Payments
    description: Stripe payment intents and webhooks
  - name: Cart
    description: User shopping cart management
  - name: Coupons
    description: Discount code validation and management
  - name: Reviews
    description: Restaurant and meal ratings
  - name: Admin
    description: Platform analytics and management
```

## 4. Reusable Schema Components

To prevent duplication, we define models in `src/docs/schemas.ts` or as JSDoc above the Mongoose models.

**Expected Schemas:**
- **Users:** `User`, `UserResponse`, `RegisterInput`, `LoginInput`, `Address`
- **Restaurants:** `Restaurant`, `RestaurantResponse`, `RestaurantInput`, `RestaurantAnalytics`
- **Meals:** `Meal`, `MealInput`, `NutritionInfo`, `Category`
- **Orders:** `Order`, `OrderInput`, `OrderItem`, `OrderStatusUpdate`
- **Cart:** `Cart`, `CartItem`, `CartInput`
- **Misc:** `Review`, `Coupon`, `Notification`
- **Generics:** `Pagination`, `SuccessResponse`, `ErrorResponse`, `ValidationError`

Example Generic Error Schema:
```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
          example: "Invalid input data"
        errors:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string
```

## 5. Example Swagger Annotations (JSDoc)

We use JSDoc comments directly in the route files (`src/routes/auth.routes.ts`, etc.).

### Example 1: User Registration
```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserResponse'
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

### Example 2: Get Restaurants (with queries)
```typescript
/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get a paginated list of restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Comma-separated cuisine types
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RestaurantResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
```

## 6. Best Practices & Standards
1. **Always Use $ref:** Avoid inline schemas for request bodies or standard responses. Always reference components.
2. **Include Examples:** Every schema property should have an `example` defined so the Swagger UI generates realistic default bodies.
3. **Keep Routes Clean:** Group related annotations at the top of controller functions or above route definitions.
4. **Enforce Auth Scopes:** Always tag endpoints that require JWT with `security: - BearerAuth: []`.
5. **Describe Constraints:** Note string lengths, regex patterns, or enums inside the schemas (e.g., `enum: [pending, preparing, ready, delivered]`).
