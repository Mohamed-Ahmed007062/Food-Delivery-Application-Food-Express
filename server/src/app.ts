import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { morganStream } from './shared/utils/logger.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import { NotFoundError } from './shared/errors/appError.js';

// Feature Routes
import authRoutes from './features/auth/auth.routes.js';
import restaurantRoutes from './features/restaurants/restaurant.routes.js';
import categoryRoutes from './features/categories/category.routes.js';
import mealRoutes from './features/meals/meal.routes.js';
import reviewRoutes from './features/reviews/review.routes.js';
import couponRoutes from './features/coupons/coupon.routes.js';
import cartRoutes from './features/cart/cart.routes.js';
import orderRoutes from './features/orders/order.routes.js';
import analyticsRoutes from './features/analytics/analytics.routes.js';
import userRoutes from './features/users/user.routes.js';
import uploadRoutes from './features/upload/upload.routes.js';

const app: Express = express();

// Dynamic CORS configuration for dev & production
const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173'];

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.NODE_ENV === 'development' || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow origin in dev mode
      }
    },
    credentials: true,
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging Middleware
app.use(morgan('combined', { stream: morganStream }));

// Rate Limiting
app.use('/api', globalRateLimiter);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'FoodExpress API is running and operational',
    docs: '/api-docs',
    health: '/api/v1/health',
    version: '1.0.0',
  });
});

// Health Check Endpoints
app.get(['/health', '/api/health', '/api/v1/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Food Delivery API is healthy and operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// Feature Route Mounts (Supports both /api/v1/... and legacy /api/... aliases)
app.use(['/api/v1/auth', '/api/auth'], authRoutes);
app.use(['/api/v1/restaurants', '/api/restaurants'], restaurantRoutes);
app.use(['/api/v1/categories', '/api/categories'], categoryRoutes);
app.use(['/api/v1/meals', '/api/meals', '/api/food'], mealRoutes);
app.use(['/api/v1/reviews', '/api/reviews'], reviewRoutes);
app.use(['/api/v1/coupons', '/api/coupons'], couponRoutes);
app.use(['/api/v1/cart', '/api/cart'], cartRoutes);
app.use(['/api/v1/orders', '/api/orders'], orderRoutes);
app.use(['/api/v1/analytics', '/api/analytics'], analyticsRoutes);
app.use(['/api/v1/users', '/api/users', '/api/user'], userRoutes);
app.use(['/api/v1/upload', '/api/upload'], uploadRoutes);

// Handle 404 Routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
