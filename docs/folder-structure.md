# Folder Structure

This document details the folder structures for both the Backend (`server/`) and Frontend (`client/`), adhering to a Feature-Based approach.

---

## 1. Backend Folder Structure (`server/`)

The backend follows a feature-driven, strictly typed Express/Mongoose setup.

```text
server/
├── src/
│   ├── config/              # Environment, database, and 3rd-party configs
│   │   ├── db.ts            # Mongoose connection
│   │   ├── env.ts           # Env variable validation (Zod)
│   │   ├── cloudinary.ts    # Cloudinary setup
│   │   └── stripe.ts        # Stripe instance
│   │
│   ├── features/            # Feature-based modules (Core Domain)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts  # HTTP Request/Response handling
│   │   │   ├── auth.service.ts     # Business logic
│   │   │   ├── auth.routes.ts      # Express Router definitions
│   │   │   ├── auth.validation.ts  # Zod schemas for auth
│   │   │   └── auth.types.ts       # TypeScript interfaces
│   │   ├── users/
│   │   │   ├── user.model.ts       # Mongoose Schema
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── ...
│   │   ├── restaurants/            # Restaurant management
│   │   ├── categories/             # Food categories
│   │   ├── meals/                  # Menu items
│   │   ├── orders/                 # Order lifecycle & cart checkout
│   │   ├── reviews/                # Ratings & Reviews
│   │   ├── coupons/                # Discount logic
│   │   ├── cart/                   # Cart management (if DB persisted)
│   │   ├── payments/               # Stripe webhooks & processing
│   │   ├── uploads/                # File upload handling
│   │   ├── notifications/          # Push/Email notifications
│   │   └── dashboard/              # Admin analytics & charts
│   │
│   ├── middleware/          # Global Express Middlewares
│   │   ├── auth.middleware.ts      # JWT verification & RBAC
│   │   ├── error.middleware.ts     # Global error handler
│   │   ├── validate.middleware.ts  # Zod schema validation
│   │   ├── upload.middleware.ts    # Multer config
│   │   └── rateLimiter.ts          # API rate limiting
│   │
│   ├── shared/              # Shared utilities across features
│   │   ├── utils/           # Helper functions (e.g., hash.ts, jwt.ts)
│   │   ├── types/           # Global TS types (e.g., Express.Request extension)
│   │   ├── constants/       # Enums, standard status codes
│   │   └── errors/          # Custom AppError classes
│   │
│   ├── socket/              # WebSockets (Socket.IO) Setup
│   │   ├── socket.ts        # Initialization
│   │   └── handlers/        # Event handlers (e.g., order.handler.ts)
│   │
│   ├── app.ts               # Express App initialization & middleware binding
│   └── server.ts            # Entry point (Server listen, DB connect)
│
├── tests/                   # Integration & Unit Tests
├── .env.example             # Template for environment variables
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies & scripts
└── .eslintrc.json           # Linting rules
```

---

## 2. Frontend Folder Structure (`client/`)

The frontend organizes React code into features to prevent the `components/` and `pages/` directories from becoming overloaded.

```text
client/
├── src/
│   ├── components/          # App-wide shared/reusable components
│   │   ├── ui/              # shadcn/ui base components (buttons, inputs)
│   │   ├── layout/          # Navbar, Footer, Sidebar, Page wrappers
│   │   └── common/          # Reusable logical components (e.g., EmptyState)
│   │
│   ├── features/            # Feature-based UI modules
│   │   ├── auth/
│   │   │   ├── components/  # e.g., LoginForm.tsx, RegisterForm.tsx
│   │   │   ├── hooks/       # e.g., useLogin.ts, useRegister.ts (React Query)
│   │   │   ├── services/    # e.g., auth.service.ts (Axios calls)
│   │   │   ├── types/       # e.g., AuthResponse, LoginCredentials
│   │   │   └── schemas/     # Zod validation schemas for forms
│   │   ├── restaurants/     # Browsing, listing, details
│   │   ├── meals/           # Meal cards, details modal
│   │   ├── cart/            # Cart drawer, checkout process
│   │   ├── orders/          # Order tracking, history
│   │   ├── profile/         # User addresses, settings
│   │   ├── dashboard/       # Restaurant Owner / Admin charts
│   │   └── admin/           # Platform management tables
│   │
│   ├── hooks/               # Global custom hooks (e.g., useTheme, useSocket)
│   ├── lib/                 # Utility libraries and initializers
│   │   ├── axios.ts         # Pre-configured Axios instance (interceptors)
│   │   ├── queryClient.ts   # TanStack Query configuration
│   │   └── utils.ts         # Generic helpers (e.g., classnames/tailwind merge)
│   │
│   ├── pages/               # Route endpoints mapping to feature components
│   │   ├── Home.tsx
│   │   ├── NotFound.tsx
│   │   └── ...
│   │
│   ├── providers/           # React Context Providers (Auth, Theme, Socket)
│   ├── types/               # Global generic types
│   ├── styles/              # Global CSS (index.css, tailwind base)
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # React DOM render entry
│   └── router.tsx           # React Router DOM configuration
│
├── public/                  # Static assets (images, icons, manifest)
├── index.html               # Entry HTML
├── vite.config.ts           # Vite bundler config
├── tailwind.config.ts       # Tailwind theme & plugin config
├── tsconfig.json            # TS compiler options
└── package.json             # Dependencies & scripts
```

---

## 3. Naming Conventions

Consistency is crucial for team velocity and maintainability.

### File Naming
- **Backend**: Use `kebab-case` and dot-separated suffixes based on the file's role.
  - Examples: `user.controller.ts`, `auth.middleware.ts`, `order.model.ts`
- **Frontend Components/Pages**: Use `PascalCase`.
  - Examples: `LoginForm.tsx`, `DashboardPage.tsx`
- **Frontend Utils/Hooks/Services**: Use `camelCase`.
  - Examples: `useAuth.ts`, `orderService.ts`, `formatDate.ts`

### Code Naming
- **Components**: `PascalCase` matching the file name (e.g., `const Button = ...`)
- **Hooks**: Must start with `use` and use `camelCase` (e.g., `useOrderQueue()`)
- **Types and Interfaces**: `PascalCase`. Optionally use `I` prefix for interfaces if team preference dictates, but standard modern TS leans towards no prefix (e.g., `User` over `IUser`, or `UserDTO`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE = 5242880`)
- **Variables & Functions**: `camelCase` (e.g., `calculateTotal`, `currentUser`)

### Routing Naming
- **API Endpoints**: Plural nouns, `kebab-case`. (e.g., `GET /api/v1/restaurants`, `POST /api/v1/users/:id/reset-password`)
- **Frontend Routes**: `kebab-case`. (e.g., `/restaurant-dashboard`, `/order-history`)
