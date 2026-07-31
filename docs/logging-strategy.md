# Logging Strategy

This document outlines the logging strategy for the Food Delivery Web Application. A robust logging architecture is critical for observability, debugging, and maintaining security standards across the platform.

## 1. Logging Library

We utilize **Winston** as the core structured logging library for the backend service. 

### Transport Configuration
- **Console Transport (Development)**: Logs are output to standard out using colorized, human-readable formatting to aid developers during local execution.
- **File Transport (Production)**: Standard application logs are written in a structured JSON format to rotating log files.
- **Error File Transport**: Critical errors are additionally separated into an exclusive `error.log` file to expedite incident resolution.

---

## 2. Log Levels

We adhere to a standard hierarchy of log levels, mapping specific types of application events to appropriate severity levels.

| Level | When to Use | Example Scenarios |
|-------|------------|-------------------|
| **error** | Unrecoverable failures, critical bugs | Database connection failed, unhandled exception, third-party API outage |
| **warn** | Recoverable issues, potential problems | Deprecated API usage, approaching rate limits, unusual login patterns |
| **info** | General business events and milestones | User registered, order placed, payment processed successfully |
| **http** | HTTP request/response tracking | Request method, URL, status code, response time logging |
| **debug** | Detailed diagnostic information | Variable state dumps, raw DB query results, cache hit/miss details |

---

## 3. HTTP Request Logging

We leverage **Morgan** middleware, deeply integrated with our Winston instance, to capture HTTP traffic metrics.

- **Log Format**: `method url statusCode responseTime ms - contentLength`
- **Request Tracing**: A unique Request ID (UUID) is generated via middleware and injected into the request context. This UUID is appended to all logs spawned during that specific request lifecycle.
- **Correlation ID**: Supported via headers (e.g., `x-correlation-id`) to allow end-to-end tracking of requests across any future microservices or external integrations.

---

## 4. What to Log

Actionable and contextual logging is essential. The following events must trigger log entries:

- **Authentication & Security Events**: Logins, logouts, password resets, role changes, and failed authentication attempts.
- **Critical Business Operations**: All CRUD operations on key domain entities (Restaurants, Meals, Coupons).
- **Financial Events**: Payment intent creation, webhook processing, stripe successes, and stripe failures.
- **System Transitions**: Order status changes (e.g., Pending -> Preparing).
- **Error Context**: Complete context for exceptions, including the `userId` (if authenticated), endpoint, and request body (sanitized).
- **Performance Metrics**: Unusually slow DB queries or extended API response times.

---

## 5. What NOT to Log

To comply with privacy laws (GDPR, CCPA) and security best practices, the following data must **never** be logged:

- Plaintext or hashed passwords.
- Full Credit Card numbers, CVVs, or expiration dates.
- Personal Identification Numbers (SSNs, Government IDs).
- Authentication Tokens (JWTs, Refresh Tokens).
- Highly sensitive PII beyond what is strictly necessary for debugging.

---

## 6. Log Sanitization

A sanitization utility runs automatically as a Winston format or middleware step before writing logs.

- **Redaction Mechanism**: Deeply inspects request bodies, headers, and outgoing responses.
- **Target Fields**: Keys such as `password`, `token`, `authorization`, `creditCard`, `cvv`, and `ssn` are actively replaced with `[REDACTED]`.

---

## 7. Production Considerations

Running logs in a production environment requires strict resource management and structural discipline.

- **Log Rotation**: Implemented via `winston-daily-rotate-file`. Logs are retained for a maximum of 14 days, with a strict file size cap of 20MB per log file to prevent disk exhaustion.
- **Structured JSON**: Production logs are exclusively output in JSON format, ensuring they are instantly ingestible by modern log aggregation platforms (e.g., Datadog, ELK stack, CloudWatch).
- **Alerting Integration**: The logging setup is architected to allow future integration with monitoring platforms, triggering automatic pager alerts for elevated rates of `error` level logs.
