# Functional Requirements (FR)

**Project Name:** Food Delivery Web Application
**Version:** 1.0.0

This document details the functional requirements for the application, organized by feature module.

**Legend:**
- **Priority**: Must Have, Should Have, Nice to Have
- **Actor**: Customer, Restaurant Owner, Admin, System

---

## 1. Authentication & Authorization

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-001** | Users must be able to register using an email address and password. | Must Have | Customer, Restaurant Owner |
| **FR-002** | The system shall send a verification email with a secure token upon registration. | Must Have | System |
| **FR-003** | Users must be able to log in using their email and password. | Must Have | All Users |
| **FR-004** | The system shall implement JWT for authentication, utilizing short-lived access tokens and long-lived refresh tokens securely stored in HTTP-only cookies. | Must Have | System |
| **FR-005** | Users must be able to log out securely, invalidating their current session. | Must Have | All Users |
| **FR-006** | Users must be able to request a password reset link via email if they forget their password. | Must Have | All Users |
| **FR-007** | Users must be able to reset their password using a valid, unexpired token. | Must Have | All Users |
| **FR-008** | The system shall enforce Role-Based Access Control (RBAC) ensuring users only access features permitted by their role (Customer, RestaurantOwner, Admin). | Must Have | System |

## 2. Restaurant Management

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-009** | Restaurant Owners must be able to create a restaurant profile (name, description, logo, banner, address, operating hours). | Must Have | Restaurant Owner |
| **FR-010** | Newly created restaurant profiles must be submitted for Admin approval before becoming visible to Customers. | Must Have | Restaurant Owner, Admin |
| **FR-011** | Restaurant Owners must be able to update their restaurant details at any time. | Must Have | Restaurant Owner |
| **FR-012** | Restaurant Owners must be able to toggle the operational status (Open/Closed/Busy) of their restaurant. | Must Have | Restaurant Owner |
| **FR-013** | Customers must be able to view a list of approved and active restaurants. | Must Have | Customer |
| **FR-014** | Customers must be able to view detailed information about a specific restaurant, including its menu, reviews, and operating hours. | Must Have | Customer |
| **FR-015** | The system shall calculate and display the average rating for a restaurant based on customer reviews. | Must Have | System |
| **FR-016** | The system shall support marking specific restaurants as "Featured" for prominent display. | Should Have | Admin |

## 3. Menu Management

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-017** | Restaurant Owners must be able to create, read, update, and delete (CRUD) menu categories (e.g., Starters, Mains, Desserts). | Must Have | Restaurant Owner |
| **FR-018** | Restaurant Owners must be able to add new meals to a category, including name, description, price, ingredients, and dietary tags. | Must Have | Restaurant Owner |
| **FR-019** | Restaurant Owners must be able to upload meal images, which shall be processed and stored via Cloudinary. | Must Have | Restaurant Owner |
| **FR-020** | Restaurant Owners must be able to edit existing meal details. | Must Have | Restaurant Owner |
| **FR-021** | Restaurant Owners must be able to toggle the availability (In Stock / Out of Stock) of specific meals. | Must Have | Restaurant Owner |
| **FR-022** | Restaurant Owners must be able to delete meals from their menu. | Must Have | Restaurant Owner |
| **FR-023** | The system shall track order frequency to automatically highlight "Popular Meals" for a restaurant. | Nice to Have | System |

## 4. Customer Features

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-024** | Customers must be able to view and edit their profile information (name, phone number, avatar). | Must Have | Customer |
| **FR-025** | Customers must be able to change their password from within their account settings. | Must Have | Customer |
| **FR-026** | Customers must be able to manage a list of delivery addresses (Home, Work, etc.). | Must Have | Customer |
| **FR-027** | Customers must be able to set a default delivery address. | Should Have | Customer |
| **FR-028** | Customers must be able to add and remove restaurants to a "Favorites" list. | Should Have | Customer |
| **FR-029** | Customers must be able to add and remove specific meals to a "Favorites" list. | Nice to Have | Customer |

## 5. Cart & Checkout

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-030** | Customers must be able to add meals from a specific restaurant to their cart. | Must Have | Customer |
| **FR-031** | The system shall clear the cart or prompt for confirmation if a Customer attempts to add items from a different restaurant. | Must Have | System, Customer |
| **FR-032** | Customers must be able to modify the quantity of items in their cart or remove them entirely. | Must Have | Customer |
| **FR-033** | Customers must be able to view a summary of their cart, including subtotal, taxes, delivery fee, and total. | Must Have | Customer |
| **FR-034** | The system shall calculate the delivery fee dynamically based on the distance or a flat rate per restaurant. | Must Have | System |
| **FR-035** | Customers must be able to apply a valid coupon code to their cart for a discount. | Should Have | Customer |
| **FR-036** | Customers must be able to select a delivery address during checkout. | Must Have | Customer |
| **FR-037** | Customers must be able to choose between available payment methods (Credit Card via Stripe, Cash on Delivery). | Must Have | Customer |
| **FR-038** | The system shall integrate securely with Stripe Checkout for processing credit card payments. | Must Have | System |
| **FR-039** | Upon successful checkout, the system shall create an order record and provide an order confirmation number. | Must Have | System |

## 6. Order Management

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-040** | The system shall support a defined order lifecycle: Placed → Confirmed → Preparing → Ready → Delivering → Delivered / Cancelled. | Must Have | System |
| **FR-041** | Restaurant Owners must receive incoming orders in their dashboard. | Must Have | Restaurant Owner |
| **FR-042** | Restaurant Owners must be able to accept (Confirmed) or reject (Cancelled) incoming orders. | Must Have | Restaurant Owner |
| **FR-043** | Restaurant Owners must be able to update the order status as it progresses through the lifecycle (Preparing, Ready). | Must Have | Restaurant Owner |
| **FR-044** | Delivery status updates (Delivering, Delivered) must be manageable via the system. | Must Have | Restaurant Owner / Admin |
| **FR-045** | Customers must be able to view their active orders and current status. | Must Have | Customer |
| **FR-046** | Customers must be able to view their historical (past) orders. | Must Have | Customer |
| **FR-047** | Customers must be able to quickly reorder a past order with one click. | Should Have | Customer |
| **FR-048** | Customers must be able to cancel an order only if the status is "Placed" (before restaurant confirmation). | Should Have | Customer |
| **FR-049** | Customers must be able to rate and review a completed order (restaurant and food quality). | Must Have | Customer |

## 7. Real-Time Features

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-050** | The system shall use Socket.IO to push real-time order status updates to the Customer's client. | Must Have | System |
| **FR-051** | The system shall push new order notifications in real-time to the Restaurant Owner's dashboard. | Must Have | System |
| **FR-052** | Customers shall receive a real-time notification when a restaurant replies to their review. | Nice to Have | System |
| **FR-053** | The system shall handle temporary websocket disconnections and resync state upon reconnection. | Must Have | System |

## 8. Admin Dashboard

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-054** | Admins must be able to view a dashboard with high-level metrics (Total Users, Total Revenue, Active Orders). | Must Have | Admin |
| **FR-055** | Admins must be able to view, search, and manage all user accounts (suspend, delete, change roles). | Must Have | Admin |
| **FR-056** | Admins must be able to review, approve, suspend, or delete restaurant accounts. | Must Have | Admin |
| **FR-057** | Admins must be able to view and manage all orders placed on the platform. | Must Have | Admin |
| **FR-058** | Admins must be able to create, update, and delete global discount coupons. | Should Have | Admin |
| **FR-059** | Admins must be able to view and manage global food categories. | Should Have | Admin |
| **FR-060** | Admins must have access to detailed revenue reports and data visualization charts. | Must Have | Admin |
| **FR-061** | The admin dashboard tables must utilize server-side pagination, sorting, and filtering for performance. | Must Have | System |

## 9. Search & Discovery

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-062** | Customers must be able to search for restaurants and meals using a global search bar. | Must Have | Customer |
| **FR-063** | The system shall provide full-text search capabilities across restaurant names, descriptions, and meal names. | Must Have | System |
| **FR-064** | Customers must be able to filter search results by cuisine/category. | Must Have | Customer |
| **FR-065** | Customers must be able to filter search results by average rating (e.g., 4+ stars). | Should Have | Customer |
| **FR-066** | Customers must be able to filter meals by price range. | Should Have | Customer |
| **FR-067** | Customers must be able to sort search results by relevance, rating, or delivery time. | Should Have | Customer |
| **FR-068** | Search results and marketplace listings must implement pagination or infinite scrolling. | Must Have | System |

## 10. UI/UX Features

| ID | Description | Priority | Actor |
|:---|:---|:---|:---|
| **FR-069** | The application must feature a responsive design optimized for mobile, tablet, and desktop devices. | Must Have | System |
| **FR-070** | The user interface must support toggling between Light and Dark mode. | Should Have | All Users |
| **FR-071** | The application must display skeleton loading states while fetching data to improve perceived performance. | Must Have | System |
| **FR-072** | The application must utilize lazy loading for images and heavy UI components. | Must Have | System |
| **FR-073** | Form inputs must have real-time client-side validation providing immediate feedback (using Zod & React Hook Form). | Must Have | System |
| **FR-074** | The UI must display toast notifications for success, error, and informational messages. | Must Have | System |
| **FR-075** | The application must meet baseline accessibility standards (e.g., keyboard navigation, ARIA labels). | Must Have | System |
| **FR-076** | Navigation menus must clearly indicate the current active route. | Must Have | System |
| **FR-077** | Empty states (e.g., empty cart, no search results) must display helpful graphics and calls to action. | Should Have | System |
| **FR-078** | The system shall provide a unified, consistent design language utilizing shadcn/ui components. | Must Have | System |
| **FR-079** | Error pages (404 Not Found, 500 Server Error) must be custom designed and provide links back to safe areas. | Must Have | System |
| **FR-080** | Multi-step processes (like checkout) must clearly display a progress indicator. | Should Have | System |
