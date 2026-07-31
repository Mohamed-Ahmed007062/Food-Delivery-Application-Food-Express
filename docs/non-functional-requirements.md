# Non-Functional Requirements (NFR)

**Project Name:** Food Delivery Web Application
**Version:** 1.0.0

This document outlines the non-functional requirements that dictate the system's operational capabilities, performance, and constraints.

**Legend:**
- **Priority**: Must Have, Should Have, Nice to Have

---

## 1. Performance

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-001** | The initial page load time for the frontend application must be under 3 seconds on a standard 4G connection. | Performance | Must Have |
| **NFR-002** | Backend REST API endpoints must respond within 500 milliseconds under normal load conditions. | Performance | Must Have |
| **NFR-003** | Real-time WebSocket messages must have a latency of less than 200 milliseconds. | Performance | Must Have |
| **NFR-004** | All images uploaded to the platform must be automatically compressed and optimized before delivery (via Cloudinary). | Performance | Must Have |
| **NFR-005** | The frontend must implement lazy loading for images and route-level code splitting to minimize bundle sizes. | Performance | Must Have |
| **NFR-006** | Large datasets (e.g., orders, restaurant lists, users) must utilize pagination or infinite scrolling to prevent client-side performance degradation. | Performance | Must Have |

## 2. Security

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-007** | All user passwords must be securely hashed using `bcrypt` with an appropriate salt round before storage in the database. | Security | Must Have |
| **NFR-008** | Authentication must utilize JSON Web Tokens (JWT) combined with secure, HTTP-only refresh tokens to mitigate XSS attacks. | Security | Must Have |
| **NFR-009** | All external HTTP traffic must be encrypted using HTTPS/TLS 1.2 or higher. | Security | Must Have |
| **NFR-010** | The backend API must validate and sanitize all incoming client data using a robust validation library (e.g., Zod) to prevent SQLi/NoSQLi and XSS. | Security | Must Have |
| **NFR-011** | The backend must implement Cross-Origin Resource Sharing (CORS) policies restricting access only to authorized frontend domains. | Security | Must Have |
| **NFR-012** | The Express application must use the `helmet` middleware to set secure HTTP headers. | Security | Must Have |
| **NFR-013** | Critical endpoints (e.g., authentication, password reset) must implement rate limiting to prevent brute-force attacks. | Security | Must Have |
| **NFR-014** | Webhooks received from Stripe must have their cryptographic signatures verified to ensure authenticity before processing. | Security | Must Have |

## 3. Scalability

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-015** | The backend API must be designed as a stateless application to support horizontal scaling across multiple instances. | Scalability | Must Have |
| **NFR-016** | The MongoDB database must implement proper indexing on frequently queried fields (e.g., restaurant name, category, user email) to maintain read performance at scale. | Scalability | Must Have |
| **NFR-017** | Static assets (JS, CSS, initial HTML) must be served via a globally distributed Content Delivery Network (CDN) provided by Vercel. | Scalability | Must Have |
| **NFR-018** | The WebSocket server implementation must be capable of integrating with a Redis adapter for pub/sub if scaling across multiple Node.js processes becomes necessary. | Scalability | Should Have |

## 4. Reliability

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-019** | The production system must target an uptime of 99.9%, excluding scheduled maintenance windows. | Reliability | Must Have |
| **NFR-020** | The frontend application must implement graceful error boundaries to prevent the entire UI from crashing if a single component fails. | Reliability | Must Have |
| **NFR-021** | The backend API must utilize global error handling middleware to ensure consistent JSON error responses and prevent server crashes from unhandled exceptions. | Reliability | Must Have |
| **NFR-022** | Database backups must be automated and performed daily via MongoDB Atlas features. | Reliability | Must Have |
| **NFR-023** | Network requests to external services (e.g., Stripe, Cloudinary) must implement retry mechanisms with exponential backoff for transient failures. | Reliability | Should Have |

## 5. Usability

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-024** | The web application interface must be fully responsive and functional across devices with screen widths ranging from 320px to 1920px+. | Usability | Must Have |
| **NFR-025** | The application must adhere to WCAG 2.1 AA compliance standards for accessibility (color contrast, ARIA labels, keyboard navigation). | Usability | Should Have |
| **NFR-026** | The UI must provide a consistent design language utilizing shadcn/ui components and Tailwind CSS utility classes. | Usability | Must Have |
| **NFR-027** | The application must support a Dark Mode toggle that persists across user sessions via local storage. | Usability | Should Have |
| **NFR-028** | Destructive actions (e.g., deleting a restaurant, cancelling an order) must require explicit user confirmation. | Usability | Must Have |

## 6. Maintainability

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-029** | The codebase must adhere to Clean Architecture and SOLID principles to ensure separation of concerns. | Maintainability | Must Have |
| **NFR-030** | Both frontend and backend codebases must be written in TypeScript with `strict` mode enabled. | Maintainability | Must Have |
| **NFR-031** | Code formatting and linting must be enforced universally using ESLint and Prettier, integrated into Git pre-commit hooks (e.g., Husky). | Maintainability | Must Have |
| **NFR-032** | The backend repository must utilize a feature-based folder structure (e.g., organizing by modules like `/users`, `/orders`) rather than role-based (e.g., `/controllers`, `/models`). | Maintainability | Must Have |
| **NFR-033** | The backend REST API must be fully documented using Swagger / OpenAPI specifications, accessible via a `/api-docs` endpoint. | Maintainability | Must Have |
| **NFR-034** | Meaningful and consistent commit messages (e.g., Conventional Commits) must be used throughout the development lifecycle. | Maintainability | Should Have |

## 7. Compatibility

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-035** | The frontend application must function correctly on the latest two major versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. | Compatibility | Must Have |
| **NFR-036** | The application must function correctly on both iOS (Safari) and Android (Chrome) modern mobile browsers. | Compatibility | Must Have |

## 8. Deployment

| ID | Description | Category | Priority |
|:---|:---|:---|:---|
| **NFR-037** | The project must support CI/CD pipelines to automatically build, test, and deploy code upon merges to the main branch. | Deployment | Must Have |
| **NFR-038** | Application configuration must be managed through environment variables (`.env` files) to allow seamless promotion across environments (Development, Staging, Production). | Deployment | Must Have |
| **NFR-039** | Deployment processes to Vercel and Render must target zero-downtime to minimize disruption for active users. | Deployment | Should Have |
| **NFR-040** | Database migrations and seed scripts must be provided to easily initialize or update the database schema across environments. | Deployment | Must Have |
