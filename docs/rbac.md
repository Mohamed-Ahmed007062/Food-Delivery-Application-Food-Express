# Role-Based Access Control (RBAC)

This document outlines the Role-Based Access Control (RBAC) implementation, detailing the different roles, their permissions, and how access is enforced.

## Roles

The system supports three distinct user roles:

| Role | Description | Can Self-Register |
|------|------------|-------------------|
| **Customer** | End user who browses restaurants, orders food, and leaves reviews. | Yes (default role) |
| **Restaurant Owner** | Manages their restaurant profile, menu categories, meals, and processes orders. | Yes (selects at registration) |
| **Admin** | Platform administrator who manages users, platform-wide analytics, and overall compliance. | No (created by another admin or seeded) |

---

## Permission Matrix

| Resource | Action | Customer | Owner | Admin |
|----------|--------|----------|-------|-------|
| Auth | Register | ✅ | ✅ | ❌ |
| Auth | Login | ✅ | ✅ | ✅ |
| Auth | Verify Email | ✅ | ✅ | ✅ |
| Profile | View Own | ✅ | ✅ | ✅ |
| Profile | Update Own | ✅ | ✅ | ✅ |
| Profile | Change Password | ✅ | ✅ | ✅ |
| Users | List All | ❌ | ❌ | ✅ |
| Users | Delete | ❌ | ❌ | ✅ |
| Users | Change Role | ❌ | ❌ | ✅ |
| Restaurants | View All | ✅ | ✅ | ✅ |
| Restaurants | Create | ❌ | ✅ | ❌ |
| Restaurants | Update Own | ❌ | ✅ | ❌ |
| Restaurants | Delete Own | ❌ | ✅ | ✅ |
| Restaurants | Approve | ❌ | ❌ | ✅ |
| Categories | View | ✅ | ✅ | ✅ |
| Categories | Create | ❌ | ✅ | ✅ |
| Categories | Update | ❌ | ✅ | ✅ |
| Categories | Delete | ❌ | ✅ | ✅ |
| Meals | View | ✅ | ✅ | ✅ |
| Meals | Create | ❌ | ✅ | ❌ |
| Meals | Update | ❌ | ✅ | ❌ |
| Meals | Delete | ❌ | ✅ | ✅ |
| Cart | Manage | ✅ | ❌ | ❌ |
| Orders | Place | ✅ | ❌ | ❌ |
| Orders | View Own | ✅ | ✅ | ✅ |
| Orders | Cancel Own | ✅ | ❌ | ✅ |
| Orders | Update Status | ❌ | ✅ | ✅ |
| Orders | View Restaurant Orders | ❌ | ✅ | ✅ |
| Reviews | Create | ✅ | ❌ | ❌ |
| Reviews | Update Own | ✅ | ❌ | ❌ |
| Reviews | Delete | ✅ (own) | ❌ | ✅ |
| Coupons | Validate | ✅ | ❌ | ❌ |
| Coupons | CRUD | ❌ | ❌ | ✅ |
| Uploads | Upload Image | ✅ | ✅ | ✅ |
| Dashboard | View Stats | ❌ | ✅ (own) | ✅ |
| Dashboard | View All Analytics | ❌ | ❌ | ✅ |
| Notifications | View Own | ✅ | ✅ | ✅ |
| Favorites | Manage | ✅ | ❌ | ❌ |
| Addresses | Manage | ✅ | ❌ | ❌ |

---

## Middleware Implementation Design

Role-based access is primarily enforced using the `authorize` middleware.

```typescript
// Example usage in routes
router.post('/meals', protect, authorize('owner'), createMeal);
router.get('/users', protect, authorize('admin'), getUsers);
```

- **Functionality:** The `authorize(...roles: UserRole[])` middleware takes an array of permitted roles.
- **Evaluation:** It checks if `req.user.role` (populated by the preceding `protect` middleware) exists within the `roles` array.
- **Rejection:** If the user's role is missing, it responds immediately with a `403 Forbidden` status.
- **Prerequisite:** It must always be used *after* the `protect` middleware.

---

## Resource Ownership Checks

Role-based access is often insufficient on its own. While an 'owner' can update meals, they must only be allowed to update *their own* meals. This is enforced via Resource Ownership Checks within the service or controller layer.

**Examples of Ownership Rules:**
- A Restaurant Owner can only update/delete meals belonging to their specific restaurant `_id`.
- A Customer can only cancel an order where `order.customer === req.user.id`.
- A User can only view or update their own profile and addresses.
- An Owner can only accept or reject orders routed to their specific restaurant.

**Design Pattern:**
```typescript
// Service-level ownership check
if (meal.restaurant.toString() !== req.user.restaurantId.toString()) {
  throw new ForbiddenError('You are not authorized to modify this resource');
}
```

---

## Admin Seeding

Because Admins cannot self-register, an initial mechanism is required to bootstrap the platform.

- **Seed Script:** The application includes a database seed script (`npm run seed:admin`) that provisions the initial super-admin account using credentials provided via environment variables.
- **Delegation:** Once the initial admin logs in, they can utilize the dashboard to promote existing users to the Admin role.
- **Restriction:** Admin registration is completely isolated from the public `/auth/register` API.

---

## Role Upgrade / Downgrade

- **Exclusivity:** Only Admins have the authority to alter a user's role (e.g., changing a Customer to an Owner, or promoting an Owner to an Admin).
- **Audit Logging:** Any change to user roles must be logged for security and auditing purposes.
- **Immediate Enforcement:** When a user's role is modified, their existing `refreshToken` is immediately invalidated in the database. This forces the user to log in again, generating a new access token that reflects their updated role payload.
