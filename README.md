# 🍔 FoodExpress - Full-Stack MERN Food Delivery Marketplace & Platform

FoodExpress is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) web application that delivers a seamless food ordering experience across 28 global cuisines. It features real-time Socket.IO order tracking, Stripe payment gateway integration, responsive UI, restaurant owner management studio, and a platform admin portal.

---

## ✨ Features & Highlights

### 🛒 Marketplace & Ordering
- **28 Cuisines Navigation**: Explore authentic dishes from 28 global cuisines (Egypt 🇪🇬, Italy 🇮🇹, Japan 🇯🇵, France 🇫🇷, USA 🇺🇸, Mexico 🇲🇽, India 🇮🇳, and more).
- **Search & Filters**: Search dishes by keyword, cuisine area, category, or popular items.
- **Rich Recipe Detail Modals**: View full recipe instructions, nutrition breakdown, allergen tags, and ingredient lists with measurements and images.
- **Cart & Coupon System**: Real-time total calculation, tax, delivery fee, and active promo code application (`WELCOME20`, `SAVE10`, `FOOD50`, `FREE5`).
- **Stripe Payments**: Integrated Stripe Checkout with test keys and credit card authorization.
- **Real-Time Order Tracking**: Powered by Socket.IO for live order status updates (`PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).

### 👨‍🍳 Restaurant Owner Studio
- **Order Management Matrix**: Real-time status transitions for incoming restaurant orders.
- **Meal CRUD Operations**: Add new meals, edit prices & categories, and delete items with modal confirmation dialogs.
- **Business Analytics**: 7-day revenue & order charts, popular dish stats, and customer reviews.

### 🛡️ Admin Portal & Security
- **JWT Authentication**: Secure Access & Refresh tokens with HTTP-only cookies and RBAC (`customer`, `owner`, `admin`).
- **Input Validation**: Strict Zod schema validation across all endpoints.
- **Error Handling**: Custom AppError hierarchy with logging.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, React Query, Axios, Socket.IO Client
- **Backend**: Node.js, Express.js, TypeScript, MongoDB Atlas (Mongoose), Socket.IO, Stripe API, JWT, Winston Logger
- **Testing**: Node Test Runner (`npx tsx --test`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local `mongod` service

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mohamed-Ahmed007062/Food-Delivery-Application-FoodExpress.git
   cd Food-Delivery-Application-FoodExpress
   ```

2. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure Environment Variables**

   Create `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
   ```

4. **Run Development Servers**

   ```bash
   # Run Backend Server (from /server)
   npm run dev

   # Run Frontend Client (from /client)
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Running Tests

```bash
cd server
npx tsx --test tests/marketplace_unit.test.ts
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
