# Production Deployment Guide

## 1. Local Production Deployment (Docker Compose)

### Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Port 80, 5000, 27017 free on host machine

### Execution Steps
```bash
# 1. Build and launch all services in detached production mode
docker-compose up -d --build

# 2. Verify container statuses
docker-compose ps

# 3. Stream server and proxy logs
docker-compose logs -f server nginx

# 4. Verify Health Check
curl http://localhost/api/v1/health

# 5. Stop production stack
docker-compose down -v
```

---

## 2. Cloud Deployment (Render + Vercel + MongoDB Atlas)

### Step 1: MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster.
2. Under Network Access, whitelist `0.0.0.0/0` or Render outbound IP ranges.
3. Under Database Access, create a read-write database user.
4. Copy the connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/food_delivery_db?retryWrites=true&w=majority`.

### Step 2: Render Backend Deployment
1. Connect your GitHub repository to Render.
2. Select **Web Service** using `render.yaml` blueprint or manual Node environment.
3. Set environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Atlas Connection String>`
   - `JWT_SECRET`: `<Secret Key>`
   - `JWT_REFRESH_SECRET`: `<Refresh Secret Key>`
   - `CLIENT_URL`: `https://your-app.vercel.app`
4. Deploy service and copy public Render URL (e.g. `https://foodexpress-backend.onrender.com`).

### Step 3: Vercel Frontend Deployment
1. Import repository into Vercel dashboard.
2. Set Root Directory to `client`.
3. Set Environment Variable:
   - `VITE_API_URL`: `https://foodexpress-backend.onrender.com/api/v1`
4. Deploy application.
