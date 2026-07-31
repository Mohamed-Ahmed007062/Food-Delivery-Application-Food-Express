# User Flows

This document visualizes the critical user journeys through the Food Delivery Web Application.

## 1. Registration Flow
**Description:** The complete process for a new user to sign up, verify their email, and log in to the system.

```mermaid
flowchart TD
    A([Visit Homepage]) --> B[Click 'Sign Up']
    B --> C[Fill Registration Form]
    C --> D{Data Valid?}
    D -- No --> E[Display Validation Errors]
    E --> C
    D -- Yes --> F[Submit Form]
    F --> G[Create Account in Database]
    G --> H[Send Verification Email]
    H --> I([Show 'Check Email' Screen])
    I --> J[User Clicks Email Link]
    J --> K[Verify Account]
    K --> L[Redirect to Login]
    L --> M([Login with New Credentials])
```

## 2. Login Flow
**Description:** The process for an existing user to authenticate and access their respective dashboard based on their role.

```mermaid
flowchart TD
    A([Visit Login Page]) --> B[Enter Email & Password]
    B --> C{Credentials Valid?}
    C -- No --> D[Show 'Invalid Credentials' Error]
    D --> B
    C -- Yes --> E[Generate JWT & Refresh Tokens]
    E --> F{Check User Role}
    F -- Customer --> G([Redirect to Home/Marketplace])
    F -- Restaurant Owner --> H([Redirect to Owner Dashboard])
    F -- Admin --> I([Redirect to Admin Dashboard])
```

## 3. Password Reset Flow
**Description:** The sequence of steps a user takes to recover access to their account if they forget their password.

```mermaid
flowchart TD
    A([Click 'Forgot Password']) --> B[Enter Registered Email]
    B --> C{Email Exists?}
    C -- No --> D[Show 'Sent' Message for Security]
    C -- Yes --> E[Generate Reset Token]
    E --> F[Send Reset Email]
    F --> D
    D --> G[User Clicks Link in Email]
    G --> H[Enter New Password]
    H --> I{Passwords Match?}
    I -- No --> J[Show Error]
    J --> H
    I -- Yes --> K[Update Password in DB]
    K --> L([Redirect to Login])
```

## 4. Restaurant Discovery Flow
**Description:** How a customer finds a restaurant, browses the menu, and decides what to order.

```mermaid
flowchart TD
    A([Home Page]) --> B[View Featured / Popular]
    A --> C[Search or Select Category]
    C --> D[View Restaurant Listing]
    D --> E[Apply Filters (Rating, Cuisine)]
    E --> F[Select Restaurant]
    F --> G[View Restaurant Profile & Reviews]
    G --> H[Browse Menu Categories]
    H --> I[View Meal Details]
    I --> J([Select Meal for Order])
```

## 5. Ordering Flow
**Description:** The checkout process, including cart management, coupon application, and payment selection.

```mermaid
flowchart TD
    A([Add Meal to Cart]) --> B[View Cart Sidebar/Page]
    B --> C[Adjust Quantity / Remove Items]
    C --> D{Enter Coupon?}
    D -- Yes --> E[Validate Coupon]
    E -- Valid --> F[Apply Discount]
    E -- Invalid --> G[Show Error]
    G --> D
    D -- No --> H[Review Subtotal, Tax, Delivery Fee]
    F --> H
    H --> I[Proceed to Checkout]
    I --> J[Select Delivery Address]
    J --> K{Choose Payment Method}
    K -- Stripe (Card) --> L[Enter Card Details]
    L --> M{Payment Successful?}
    M -- No --> N[Show Payment Error]
    N --> L
    M -- Yes --> O[Place Order]
    K -- Cash on Delivery --> O
    O --> P([Show Order Confirmation])
```

## 6. Order Tracking Flow
**Description:** The post-purchase journey where the customer tracks their order in real-time.

```mermaid
flowchart TD
    A([Order Placed]) --> B[View Order Tracking Page]
    B --> C((Socket.IO Connection))
    C --> D{Order Status}
    D -- Pending --> E[Waiting for Restaurant]
    D -- Accepted --> F[Restaurant is Preparing]
    D -- Out for Delivery --> G[Driver is on the way]
    D -- Delivered --> H([Order Complete])
    D -- Cancelled --> I([Order Cancelled / Refunded])
    E --> C
    F --> C
    G --> C
    H --> J[Prompt for Rating & Review]
```

## 7. Restaurant Owner: Order Processing Flow
**Description:** How a restaurant owner receives, manages, and completes incoming orders.

```mermaid
flowchart TD
    A((Socket.IO Connection)) --> B([Receive New Order Notification])
    B --> C[View Order Details]
    C --> D{Accept or Reject?}
    D -- Reject --> E[Mark Cancelled & Refund]
    E --> F([Notify Customer])
    D -- Accept --> G[Update Status: Preparing]
    G --> H([Notify Customer])
    H --> I[Food is Ready]
    I --> J[Update Status: Out for Delivery]
    J --> K([Notify Customer])
    K --> L[Order Delivered]
    L --> M[Update Status: Delivered]
    M --> N([Complete Order & Update Revenue])
```

## 8. Admin: Restaurant Approval Flow
**Description:** The process an admin follows to onboard a new restaurant to the platform.

```mermaid
flowchart TD
    A([New Restaurant Submitted]) --> B[Admin Dashboard Notification]
    B --> C[Review Restaurant Documents & Details]
    C --> D{Decision}
    D -- Reject --> E[Mark as Rejected]
    E --> F[Send Rejection Email to Owner]
    D -- Request Changes --> G[Send Feedback Email]
    G --> A
    D -- Approve --> H[Mark as Active]
    H --> I[Send Welcome & Approval Email]
    I --> J([Restaurant is Live on Marketplace])
```
