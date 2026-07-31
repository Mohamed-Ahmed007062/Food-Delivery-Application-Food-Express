import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { logger } from './shared/utils/logger.js';

// Lazy MongoDB connection middleware for serverless environment
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    logger.warn(`MongoDB connection notice: ${(err as Error).message}`);
  }
  next();
});

// Run HTTP listener only when running locally or on non-serverless platform
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📚 Swagger docs available at http://localhost:${env.PORT}/api-docs`);
      logger.info(`🏥 Health check at http://localhost:${env.PORT}/api/v1/health`);
      logger.info(`🔌 Socket.IO Server initialized and listening`);
    });
  };

  startServer();
}

export default app;
