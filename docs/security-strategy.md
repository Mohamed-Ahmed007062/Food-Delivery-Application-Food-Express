# Security Strategy

This document outlines the comprehensive security strategy and implementation details for the Food Delivery Web Application.

## Authentication Security

- **Password Hashing:** Passwords are hashed using `bcrypt` with a work factor of 12 salt rounds before being stored in the database.
- **Access Token:** JSON Web Tokens (JWT) are used for authentication. Access tokens are short-lived, with an expiration time of 15 minutes.
- **Refresh Token:** Long-lived refresh tokens (valid for 7 days) are used to obtain new access tokens. They are stored as HTTP-only, `Secure` (in production), and `SameSite=Strict` cookies.
- **Token Rotation:** A new refresh token is issued every time the `/auth/refresh-token` endpoint is called. The old token is invalidated.
- **Token Revocation:** Refresh tokens are stored in the database. Upon logout or token revocation events, the refresh token is removed from the database and the cookie is cleared.

## HTTP Security Headers

We utilize the `helmet` middleware to enforce secure HTTP headers:

- **Content-Security-Policy (CSP):** Mitigates XSS and data injection attacks by restricting the sources of executable scripts.
- **X-Content-Type-Options:** Set to `nosniff` to prevent MIME-sniffing.
- **X-Frame-Options:** Set to `DENY` to prevent clickjacking attacks by disabling iframes.
- **X-XSS-Protection:** Enables the cross-site scripting filter built into most recent web browsers.
- **Strict-Transport-Security (HSTS):** Enforces secure (HTTP over SSL/TLS) connections to the server.
- **Referrer-Policy:** Controls how much referrer information is included with requests.

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is strictly configured to ensure only trusted origins can interact with the API.

- **Whitelisted Origins:** Only the specific frontend URLs are allowed.
- **Credentials:** Enabled (`credentials: true`) to allow the transmission of HTTP-only cookies (refresh tokens).
- **Allowed Methods:** Restricted to standard RESTful methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Allowed Headers:** `Content-Type`, `Authorization`.

## Rate Limiting

To protect the application from brute-force attacks, DDoS attacks, and abuse, rate limiting is applied globally and on specific sensitive endpoints.

| Endpoint Group | Limit | Window | Purpose |
|---|---|---|---|
| Auth (login/register) | 5 requests | 15 minutes | Brute force protection |
| Password reset | 3 requests | 1 hour | Abuse prevention |
| General API | 100 requests | 15 minutes | DoS protection |
| File upload | 10 requests | 1 minute | Resource protection |

## Input Validation & Sanitization

- **Schema Validation:** All incoming requests (params, query, body) are strictly validated using `Zod` schemas. Invalid requests are rejected with a `400 Bad Request` before reaching controllers.
- **NoSQL Injection Prevention:** `express-mongo-sanitize` is used to remove keys containing `$` or `.` from request payloads to prevent NoSQL injection.
- **XSS Sanitization:** User-generated content, especially fields like reviews and descriptions, are sanitized to prevent stored Cross-Site Scripting (XSS).
- **File Upload Validation:** Validated for MIME type, file size, and image dimensions.

## Data Protection

- **Payload Minimization:** Sensitive fields (e.g., `password`, `refreshToken`, `__v`) are meticulously excluded from API responses.
- **Mongoose Configuration:** Sensitive fields like passwords are set to `select: false` in Mongoose schemas to prevent accidental exposure during generic queries.
- **Secret Management:** All secrets (database URIs, API keys, JWT secrets) are loaded via environment variables.
- **Source Control:** `.env` files and environment-specific configs are strictly ignored in `.gitignore`.

## Payment Security (Stripe)

- **Webhook Verification:** Incoming Stripe webhooks are verified using `stripe.webhooks.constructEvent` with the endpoint secret to ensure authenticity.
- **No Card Data Stored:** The server does not handle or store raw Credit Card numbers. PCI compliance is achieved by offloading handling to Stripe Elements on the frontend.
- **Idempotency:** Idempotency keys are used for all state-changing payment requests to safely retry requests without accidental duplicate charges.

## File Upload Security

- **Cloudinary Validation:** Rely on Cloudinary's built-in format and signature validations.
- **Constraints:** Max file size is capped at 5MB per upload.
- **Allowed Types:** Strictly enforced allowlist: `image/jpeg`, `image/png`, `image/webp`.
- **Server-Side Checking:** Pre-flight validation on the Node.js server before proxying the upload to Cloudinary.

## Security Checklist

- [ ] bcrypt configured with minimum 12 salt rounds
- [ ] JWT access token expiry set to 15m
- [ ] Refresh token configured as HTTP-only, Secure, SameSite=Strict cookie
- [ ] Token rotation implemented on refresh
- [ ] Helmet middleware configured with all recommended headers
- [ ] CORS configured with specific frontend origin and credentials enabled
- [ ] Rate limiters implemented for general API, auth, password reset, and uploads
- [ ] Zod validation applied to all API endpoints
- [ ] mongo-sanitize applied globally
- [ ] Sensitive Mongoose fields set to `select: false`
- [ ] Stripe webhooks strictly verified
- [ ] File uploads restricted to 5MB and specific image types
- [ ] `.env` file added to `.gitignore`
