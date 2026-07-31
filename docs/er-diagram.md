# Entity-Relationship Diagram

This document presents the detailed Entity-Relationship (ER) model for the Food Delivery Web Application.

## Mermaid Diagram

```mermaid
erDiagram
    USERS {
        ObjectId id PK
        string name
        string email UK
        string password
        string phone
        string avatar
        enum role
        boolean isEmailVerified
        string verificationToken
        string resetPasswordToken
        date resetPasswordExpires
        string refreshToken
        date createdAt
        date updatedAt
        array addresses "Embedded: [{title, street, city, state, zipCode, isDefault}]"
        object favorites "Embedded: {restaurants ObjectId[], meals ObjectId[]}"
    }

    RESTAURANTS {
        ObjectId id PK
        ObjectId owner FK
        string name
        string slug UK
        string description
        array cuisine
        string address
        GeoJSON location
        string phone
        string email
        string logo
        string coverImage
        number rating
        number totalReviews
        boolean isActive
        boolean isApproved
        object openingHours
        number minimumOrder
        number deliveryFee
        number estimatedDeliveryTime
        date createdAt
        date updatedAt
    }

    CATEGORIES {
        ObjectId id PK
        string name
        string slug UK
        string description
        string image
        ObjectId restaurant FK
        number sortOrder
        boolean isActive
        date createdAt
        date updatedAt
    }

    MEALS {
        ObjectId id PK
        string name
        string slug UK
        string description
        number price
        string image
        ObjectId category FK
        ObjectId restaurant FK
        boolean isAvailable
        boolean isPopular
        number preparationTime
        array ingredients
        array allergens
        object nutritionInfo "Embedded: {calories, protein, carbs, fat}"
        date createdAt
        date updatedAt
    }

    ORDERS {
        ObjectId id PK
        ObjectId customer FK
        ObjectId restaurant FK
        array items "Embedded: [{meal FK, quantity, price, specialInstructions}]"
        enum status
        object deliveryAddress "Embedded: {title, street, city, state, zipCode}"
        enum paymentMethod
        enum paymentStatus
        string stripePaymentIntentId
        number subtotal
        number deliveryFee
        number tax
        number discount
        number total
        ObjectId coupon FK
        string notes
        date estimatedDeliveryTime
        date actualDeliveryTime
        string cancelReason
        date createdAt
        date updatedAt
    }

    REVIEWS {
        ObjectId id PK
        ObjectId user FK
        ObjectId restaurant FK
        ObjectId order FK
        number rating
        string comment
        date createdAt
        date updatedAt
    }

    COUPONS {
        ObjectId id PK
        string code UK
        string description
        enum discountType
        number discountValue
        number minimumOrder
        number maximumDiscount
        date startDate
        date endDate
        number usageLimit
        number usedCount
        boolean isActive
        array applicableRestaurants "ObjectId[] FK"
        date createdAt
        date updatedAt
    }

    NOTIFICATIONS {
        ObjectId id PK
        ObjectId user FK
        enum type
        string title
        string message
        mixed data
        boolean isRead
        date createdAt
    }

    %% Relationships
    USERS ||--o{ RESTAURANTS : "owns"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    
    RESTAURANTS ||--o{ CATEGORIES : "has"
    RESTAURANTS ||--o{ MEALS : "offers"
    RESTAURANTS ||--o{ ORDERS : "receives"
    RESTAURANTS ||--o{ REVIEWS : "reviewed_in"
    
    CATEGORIES ||--o{ MEALS : "contains"
    
    ORDERS }o--o| COUPONS : "applies"
    ORDERS ||--o| REVIEWS : "generates"
```

## Cardinality Summary Table

| Entity (Source) | Relationship | Entity (Target) | Cardinality | Description |
|---|---|---|---|---|
| **User** | owns | **Restaurant** | 1 : N (One-to-Many) | A user (with RestaurantOwner role) can own multiple restaurants. |
| **User** | places | **Order** | 1 : N (One-to-Many) | A user (Customer) can place multiple orders over time. |
| **User** | writes | **Review** | 1 : N (One-to-Many) | A user can write multiple reviews for different restaurants. |
| **User** | receives | **Notification**| 1 : N (One-to-Many) | A user can receive multiple notifications. |
| **Restaurant** | has | **Category** | 1 : N (One-to-Many) | A restaurant has multiple menu categories (e.g., Starters, Mains). |
| **Restaurant** | offers | **Meal** | 1 : N (One-to-Many) | A restaurant offers multiple meals on its menu. |
| **Restaurant** | receives | **Order** | 1 : N (One-to-Many) | A restaurant receives multiple orders from different customers. |
| **Restaurant**| reviewed_in | **Review** | 1 : N (One-to-Many) | A restaurant accumulates multiple reviews from customers. |
| **Category** | contains | **Meal** | 1 : N (One-to-Many) | A category categorizes multiple meals. |
| **Order** | applies | **Coupon** | N : 1 (Many-to-One) | Multiple orders can use the same coupon, but an order has at most one coupon. |
| **Order** | generates | **Review** | 1 : 1 (One-to-One) | An order can generate at most one review to ensure verified purchases. |
