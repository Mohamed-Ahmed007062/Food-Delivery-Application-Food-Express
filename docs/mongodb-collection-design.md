# MongoDB Collection Design

This document details the complete Mongoose schema design for the 8 core collections in the Food Delivery Web Application. 

---

## 1. Users Collection

### Schema Definition
```typescript
const AddressSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 50 },
  street: { type: String, required: true, trim: true, maxlength: 100 },
  city: { type: String, required: true, trim: true, maxlength: 50 },
  state: { type: String, required: true, trim: true, maxlength: 50 },
  zipCode: { type: String, required: true, trim: true, maxlength: 20 },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true, minlength: 8, select: false },
  phone: { type: String, required: true, trim: true, match: /^\+?[1-9]\d{1,14}$/ },
  avatar: { type: String, default: 'default-avatar-url' },
  role: { type: String, enum: ['Customer', 'RestaurantOwner', 'Admin'], default: 'Customer' },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  refreshToken: { type: String, select: false },
  addresses: [AddressSchema],
  favorites: {
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }]
  }
}, { timestamps: true });

// Hooks:
// pre('save') → hash password with bcrypt (salt rounds: 12) if modified
// pre('save') → ensure only one default address exists

// Methods:
// comparePassword(candidatePassword: string): Promise<boolean>
// generateAccessToken(): string
// generateRefreshToken(): string

// Statics:
// findByEmail(email: string): Promise<IUser | null>

// Indexes:
// { email: 1 } (unique)
// { role: 1 }
// { resetPasswordToken: 1 }

// toJSON transform:
// delete ret.password; delete ret.__v; delete ret.refreshToken;
```

---

## 2. Restaurants Collection

### Schema Definition
```typescript
const OpeningHoursSchema = new Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  open: { type: String, required: true, match: /^([01]\d|2[0-3]):?([0-5]\d)$/ }, // HH:mm
  close: { type: String, required: true, match: /^([01]\d|2[0-3]):?([0-5]\d)$/ },
  isClosed: { type: Boolean, default: false }
}, { _id: false });

const RestaurantSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: 1000 },
  cuisine: [{ type: String, trim: true }],
  address: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  phone: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  logo: { type: String },
  coverImage: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false }, // Admin approval
  openingHours: [OpeningHoursSchema],
  minimumOrder: { type: Number, default: 0, min: 0 },
  deliveryFee: { type: Number, default: 0, min: 0 },
  estimatedDeliveryTime: { type: Number, required: true, min: 0 }, // In minutes
}, { timestamps: true });

// Virtuals:
// RestaurantSchema.virtual('categories', { ref: 'Category', localField: '_id', foreignField: 'restaurant' });

// Hooks:
// pre('validate') → generate slug from name

// Indexes:
// { slug: 1 } (unique)
// { owner: 1 }
// { location: "2dsphere" } // for geo-queries
// { isActive: 1, isApproved: 1 }
```

---

## 3. Categories Collection

### Schema Definition
```typescript
const CategorySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 250 },
  image: { type: String },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hooks:
// pre('validate') → generate slug from name + restaurant ID (to ensure uniqueness)

// Indexes:
// { slug: 1 } (unique)
// { restaurant: 1, sortOrder: 1 }
```

---

## 4. Meals Collection

### Schema Definition
```typescript
const NutritionInfoSchema = new Schema({
  calories: { type: Number, min: 0 },
  protein: { type: Number, min: 0 },
  carbs: { type: Number, min: 0 },
  fat: { type: Number, min: 0 }
}, { _id: false });

const MealSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  preparationTime: { type: Number, min: 0 }, // In minutes
  ingredients: [{ type: String, trim: true }],
  allergens: [{ type: String, trim: true }],
  nutritionInfo: NutritionInfoSchema
}, { timestamps: true });

// Hooks:
// pre('validate') → generate slug from name + restaurant ID

// Indexes:
// { slug: 1 } (unique)
// { restaurant: 1, category: 1 }
// { isAvailable: 1 }
```

---

## 5. Orders Collection

### Schema Definition
```typescript
const OrderItemSchema = new Schema({
  meal: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // Snapshot of price at time of order
  specialInstructions: { type: String, maxlength: 250 }
}, { _id: false });

const OrderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [OrderItemSchema],
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  deliveryAddress: {
    title: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['Card', 'CashOnDelivery'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  stripePaymentIntentId: { type: String },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  notes: { type: String, maxlength: 500 },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  cancelReason: { type: String, maxlength: 250 }
}, { timestamps: true });

// Hooks:
// pre('save') → calculate total = subtotal + deliveryFee + tax - discount
// post('save') → trigger Socket.IO notification if status changed

// Indexes:
// { customer: 1, createdAt: -1 }
// { restaurant: 1, status: 1 }
// { stripePaymentIntentId: 1 } (sparse)
```

---

## 6. Reviews Collection

### Schema Definition
```typescript
const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }, // 1 review per order
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 }
}, { timestamps: true });

// Statics:
// calculateAverageRating(restaurantId: string): Promise<void>

// Hooks:
// post('save') → call calculateAverageRating
// post('remove') → call calculateAverageRating

// Indexes:
// { restaurant: 1, createdAt: -1 }
// { order: 1 } (unique)
// { user: 1 }
```

---

## 7. Coupons Collection

### Schema Definition
```typescript
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, maxlength: 250 },
  discountType: { type: String, enum: ['Percentage', 'Fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minimumOrder: { type: Number, default: 0, min: 0 },
  maximumDiscount: { type: Number }, // useful for Percentage type
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  applicableRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }] // empty = platform-wide
}, { timestamps: true });

// Methods:
// isValid(cartTotal: number, restaurantId: string): boolean

// Indexes:
// { code: 1 } (unique)
// { isActive: 1, endDate: 1 }
```

---

## 8. Notifications Collection

### Schema Definition
```typescript
const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['OrderStatus', 'Promo', 'System', 'RestaurantUpdate'], 
    required: true 
  },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 500 },
  data: { type: Schema.Types.Mixed }, // Payload (e.g., { orderId: '...' })
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes:
// { user: 1, createdAt: -1 }
// { user: 1, isRead: 1 }

// TTL Index to automatically delete old notifications
// { createdAt: 1 } expireAfterSeconds: 2592000 (30 days)
```

---

## Migration & Seeding Strategy

To streamline development and set up the production environment correctly, a unified database seeding strategy is necessary.

### 1. Development Seeding Process
A seeder script (`src/scripts/seed.ts`) should be created to populate the database with mock data. 
- **Tooling**: Use `faker.js` for generating realistic data.
- **Execution**: Provide package.json scripts like `npm run db:seed` and `npm run db:reset`.

### 2. Seed Data Format and Flow
1. **Clear DB**: Wipe all existing collections (ONLY in dev/test environments).
2. **Users**: Create:
   - 1 Admin user (e.g., admin@example.com).
   - 2 Restaurant Owners.
   - 5 Customers.
3. **Restaurants**: Seed 5-10 restaurants linked to the Restaurant Owners, featuring random location coordinates and diverse cuisines.
4. **Categories & Meals**: For each restaurant, seed 3-4 Categories (Starters, Mains, Drinks) and 5-10 Meals per category.
5. **Coupons**: Generate platform-wide and restaurant-specific coupons.
6. **Orders & Reviews**: Seed a small number of historical orders and associated reviews to populate the dashboard analytics.

### 3. Production Seeding (Initial Admin User)
For production deployments, the system should *never* use faker data. Instead, create a dedicated admin bootstrap script (`src/scripts/create-admin.ts`) that reads from environment variables:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

The script will insert the initial admin user into the database if no admin currently exists. Subsequent setup (like onboarding restaurants) can be done via the Admin Dashboard.
