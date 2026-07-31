# User Stories

This document outlines the user stories for the Food Delivery Web Application, organized by epic. 
Format: `As a [role], I want to [action], so that [benefit].`

**Priority Key:**
- 🔴 **Must Have** (Critical for MVP)
- 🟡 **Should Have** (Important, but can be scheduled for early post-MVP)
- 🟢 **Nice to Have** (Enhancements for future releases)

---

## Epic 1: Authentication & Authorization

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-AUTH-001 | 🔴 | As a new user, I want to register an account using my email and password, so that I can use the platform. | - [ ] Form requires name, email, password.<br>- [ ] Zod validation on inputs.<br>- [ ] Password hashed with bcrypt.<br>- [ ] Returns JWT on success. |
| US-AUTH-002 | 🔴 | As a user, I want to log in using my credentials, so that I can access my account. | - [ ] Validates email/password.<br>- [ ] Sets HTTP-only cookie with refresh token.<br>- [ ] Returns access token. |
| US-AUTH-003 | 🔴 | As a logged-in user, I want to securely log out, so that my account is safe on shared devices. | - [ ] Clears cookies.<br>- [ ] Invalidates refresh token in DB. |
| US-AUTH-004 | 🔴 | As a system, I want to assign roles (Customer, Owner, Admin) to users, so that access control is enforced. | - [ ] RBAC middleware protects routes.<br>- [ ] UI hides unauthorized elements based on role. |
| US-AUTH-005 | 🔴 | As a new user, I want to verify my email address via an OTP/link, so that my account is secured. | - [ ] Nodemailer sends email on signup.<br>- [ ] Verification endpoint activates account. |
| US-AUTH-006 | 🟡 | As a user who forgot their password, I want to request a password reset link, so that I can regain access. | - [ ] Sends reset token via email.<br>- [ ] Token expires in 15 minutes. |
| US-AUTH-007 | 🟡 | As a user with a reset token, I want to set a new password, so that I can log in again. | - [ ] Validates token.<br>- [ ] Updates password hash. |
| US-AUTH-008 | 🔴 | As a user, I want my session to refresh automatically, so that I don't get logged out while browsing. | - [ ] Axios interceptor catches 401s.<br>- [ ] Calls `/refresh` endpoint and retries request. |

---

## Epic 2: Restaurant Discovery

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-DISC-001 | 🔴 | As a customer, I want to view a list of available restaurants, so that I can choose where to order from. | - [ ] Paginated list of restaurants.<br>- [ ] Displays logo, name, rating, delivery time. |
| US-DISC-002 | 🔴 | As a customer, I want to search for restaurants by name, so that I can find a specific place quickly. | - [ ] Search bar with debounce.<br>- [ ] Backend text search integration. |
| US-DISC-003 | 🔴 | As a customer, I want to filter restaurants by cuisine and rating, so that I can narrow down my options. | - [ ] Checkbox filters for cuisines.<br>- [ ] Rating slider/buttons.<br>- [ ] URL query params updated. |
| US-DISC-004 | 🔴 | As a customer, I want to view a restaurant's details, so that I can see their operating hours and reviews. | - [ ] Dedicated restaurant page.<br>- [ ] Displays banner, info, and menu. |
| US-DISC-005 | 🟡 | As a customer, I want to see the average rating and reviews of a restaurant, so that I can trust their quality. | - [ ] Aggregated star rating.<br>- [ ] List of text reviews with dates. |
| US-DISC-006 | 🟡 | As a customer, I want to submit a rating and review after my order, so that I can share my experience. | - [ ] Review form unlocks after order completion.<br>- [ ] Updates restaurant's average rating. |
| US-DISC-007 | 🟢 | As a customer, I want to see "Featured" or "Promoted" restaurants on the home page, so that I can discover popular places. | - [ ] Carousel of featured restaurants.<br>- [ ] Admin-controlled flag in DB. |

---

## Epic 3: Menu Browsing

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-MENU-001 | 🔴 | As a customer, I want to view a restaurant's menu grouped by categories, so that I can easily find appetizers, mains, etc. | - [ ] Menu items grouped by Category model.<br>- [ ] Sticky category navigation sidebar. |
| US-MENU-002 | 🔴 | As a customer, I want to view details of a specific meal, so that I know the ingredients and price. | - [ ] Modal/Page showing description, price, allergens. |
| US-MENU-003 | 🔴 | As a customer, I want to see high-quality images of the meals, so that I know what to expect. | - [ ] Images served via Cloudinary.<br>- [ ] Lazy loading implemented. |
| US-MENU-004 | 🟡 | As a customer, I want to see the "Popular" meals highlighted, so that I can quickly order best-sellers. | - [ ] Badge on top 3 most ordered items. |
| US-MENU-005 | 🟡 | As a restaurant owner, I want to toggle meal availability, so that customers cannot order out-of-stock items. | - [ ] Switch in owner dashboard.<br>- [ ] Item greys out on customer menu. |
| US-MENU-006 | 🔴 | As a restaurant owner, I want to add, edit, or delete menu items, so that my menu is always up to date. | - [ ] CRUD forms with image upload.<br>- [ ] Zod validation for price/description. |

---

## Epic 4: Customer Profile

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-PROF-001 | 🔴 | As a customer, I want to view and edit my basic profile info, so that my contact details are current. | - [ ] Form for name, phone number.<br>- [ ] Updates persist to DB. |
| US-PROF-002 | 🔴 | As a customer, I want to change my password securely from my profile, so that I can maintain account security. | - [ ] Requires current password.<br>- [ ] Validates new password strength. |
| US-PROF-003 | 🔴 | As a customer, I want to add multiple delivery addresses, so that I can easily order to home or work. | - [ ] Geolocation or text address entry.<br>- [ ] Label tags (Home, Work, Other). |
| US-PROF-004 | 🔴 | As a customer, I want to edit or delete saved addresses, so that my list is organized. | - [ ] Edit modal.<br>- [ ] Soft delete or hard delete from DB. |
| US-PROF-005 | 🟡 | As a customer, I want to mark restaurants as "Favorites", so that I can quickly access them later. | - [ ] Heart icon toggle on restaurant card.<br>- [ ] Appends to User's favorites array. |
| US-PROF-006 | 🟡 | As a customer, I want a dedicated "Favorites" tab, so that I can see all my preferred spots in one place. | - [ ] Page rendering array of favorite restaurants.<br>- [ ] Empty state UI if none saved. |

---

## Epic 5: Cart & Checkout

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-CART-001 | 🔴 | As a customer, I want to add meals to my cart, so that I can prepare an order. | - [ ] Cart state managed globally (Zustand/Context).<br>- [ ] Floating cart widget shows total items. |
| US-CART-002 | 🔴 | As a customer, I want to update quantities or remove items in my cart, so that I can finalize my choices. | - [ ] +/- buttons update state.<br>- [ ] Trash icon removes item. |
| US-CART-003 | 🔴 | As a customer, I want to see a breakdown of costs (subtotal, tax, delivery fee), so that there are no surprises. | - [ ] Calculations update dynamically.<br>- [ ] Clear UI breakdown before payment. |
| US-CART-004 | 🟡 | As a customer, I want to apply a promo code/coupon, so that I can get a discount. | - [ ] Input field validates coupon against DB.<br>- [ ] Recalculates total based on % or flat discount. |
| US-CART-005 | 🔴 | As a customer, I want to pay securely using my credit card via Stripe, so that my payment is protected. | - [ ] Stripe Elements integration.<br>- [ ] Backend creates PaymentIntent.<br>- [ ] Webhook listens for success. |
| US-CART-006 | 🔴 | As a customer, I want the option to pay via Cash on Delivery (COD), so that I don't have to use a card. | - [ ] Radio button selection for COD.<br>- [ ] Bypasses Stripe flow, creates order immediately. |
| US-CART-007 | 🔴 | As a customer, I want to select a saved address during checkout, so that I don't have to retype it. | - [ ] Dropdown/list of user's addresses.<br>- [ ] Validation ensures an address is selected. |
| US-CART-008 | 🔴 | As a customer, I want to see an order confirmation page with my order ID, so that I know it was successful. | - [ ] Clear success message.<br>- [ ] Button to "Track Order". |

---

## Epic 6: Order Management

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-ORD-001 | 🔴 | As a customer, I want to view my order history, so that I can see past meals and receipts. | - [ ] Paginated list of past orders.<br>- [ ] Status badges (Delivered, Cancelled). |
| US-ORD-002 | 🟡 | As a customer, I want to click "Reorder" on a past order, so that I can quickly duplicate a favorite meal. | - [ ] Button adds identical items to cart.<br>- [ ] Prompts if prices have changed. |
| US-ORD-003 | 🔴 | As a restaurant owner, I want to view incoming orders in a dashboard, so that I can start preparing them. | - [ ] List of orders with "Pending" status.<br>- [ ] Auto-refreshing list. |
| US-ORD-004 | 🔴 | As a restaurant owner, I want to Accept or Reject new orders, so that I can manage kitchen capacity. | - [ ] Action buttons update Order status.<br>- [ ] Reject requires a short reason. |
| US-ORD-005 | 🔴 | As a restaurant owner, I want to update order statuses (Preparing, Ready, Out for Delivery), so that the customer is informed. | - [ ] Dropdown or Kanban board for order states.<br>- [ ] Updates DB timestamp. |
| US-ORD-006 | 🟡 | As a customer, I want to cancel my order within a grace period, so that I can fix mistakes. | - [ ] Cancel button visible only when status is "Pending".<br>- [ ] Triggers Stripe refund if card was used. |

---

## Epic 7: Real-Time Features

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-RT-001 | 🔴 | As a customer tracking an active order, I want to see live status updates, so that I don't have to refresh the page. | - [ ] Socket.IO room created for Order ID.<br>- [ ] UI updates instantly when owner changes status. |
| US-RT-002 | 🔴 | As a restaurant owner, I want to hear an audio alert and see a popup when a new order arrives, so that I don't miss it. | - [ ] Socket.IO emits "new_order" event.<br>- [ ] Browser notification / subtle ping sound. |
| US-RT-003 | 🟡 | As a customer, I want to receive push notifications/toast alerts about my order status while browsing other tabs, so that I stay informed. | - [ ] Service worker or standard web Notifications API.<br>- [ ] Requires user permission. |
| US-RT-004 | 🟢 | As an admin, I want to see a live ticker of orders happening across the platform, so that I can monitor volume. | - [ ] WebSocket feed on admin dashboard showing a feed of recent transactions. |

---

## Epic 8: Admin Dashboard

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-ADM-001 | 🔴 | As an admin, I want to view a list of all users and their roles, so that I can manage the community. | - [ ] Table with search, pagination, filtering. |
| US-ADM-002 | 🔴 | As an admin, I want to ban or suspend malicious users, so that the platform remains safe. | - [ ] Action button to change user `isActive` status.<br>- [ ] Suspended users cannot log in. |
| US-ADM-003 | 🔴 | As an admin, I want to manage restaurant accounts (approve/reject applications), so that quality is maintained. | - [ ] "Pending Approval" tab for new restaurants.<br>- [ ] Form to review submitted documents. |
| US-ADM-004 | 🔴 | As an admin, I want to manage global food categories, so that the UI remains consistent. | - [ ] CRUD operations for master categories (e.g., Pizza, Sushi).<br>- [ ] Categories appear in discovery filters. |
| US-ADM-005 | 🟡 | As an admin, I want to create platform-wide discount coupons, so that we can run marketing campaigns. | - [ ] Form specifying code, discount %, max uses, expiry date. |
| US-ADM-006 | 🔴 | As an admin, I want to view all platform orders to resolve disputes, so that customer support can function. | - [ ] Search by Order ID.<br>- [ ] Detailed view showing payment intent, items, status logs. |
| US-ADM-007 | 🟡 | As an admin, I want to view analytics charts (revenue, user growth), so that I understand business performance. | - [ ] Recharts/Chart.js integration.<br>- [ ] Line charts for last 30 days revenue/orders. |
| US-ADM-008 | 🟡 | As an admin, I want to generate CSV revenue reports, so that accounting can process payouts. | - [ ] Date range picker.<br>- [ ] Export to CSV button fetching formatted data. |

---

## Epic 9: UI/UX & System

| ID | Priority | User Story | Acceptance Criteria |
|---|---|---|---|
| US-SYS-001 | 🟡 | As a user, I want to toggle Dark Mode, so that the app is easy on my eyes at night. | - [ ] Tailwind dark mode integration via next-themes.<br>- [ ] Persists in localStorage. |
| US-SYS-002 | 🔴 | As a mobile user, I want the web app to be fully responsive, so that I can order from my phone seamlessly. | - [ ] Hamburger menus for small screens.<br>- [ ] Flex/Grid layouts adapt to mobile breakpoints. |
| US-SYS-003 | 🔴 | As a user, I want to see skeleton loaders instead of blank screens while data fetches, so that the app feels fast. | - [ ] shadcn/ui Skeleton components used during TanStack Query `isLoading` states. |
| US-SYS-004 | 🟡 | As a user with disabilities, I want the app to be accessible, so that I can navigate via keyboard and screen reader. | - [ ] Proper ARIA labels on buttons/inputs.<br>- [ ] Focus management on modals (Radix UI primitives). |
