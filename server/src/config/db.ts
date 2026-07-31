import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

export const connectDB = async (): Promise<void> => {
  mongoose.connection.on('connected', () => {
    logger.info(`🍃 MongoDB Connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    logger.warn(`⚠️ MongoDB Error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB Disconnected. Attempting reconnection...');
  });

  const attemptConnect = async (retries = 3, delay = 2000): Promise<void> => {
    for (let i = 0; i < retries; i++) {
      try {
        await mongoose.connect(env.MONGODB_URI, {
          serverSelectionTimeoutMS: 15000,
          dbName: 'food-delivery',
        });
        return;
      } catch (error) {
        if (i === retries - 1) {
          logger.warn(`⚠️ MongoDB Connection Warning: ${(error as Error).message}`);
          logger.warn(`⚠️ Server is running with demo fallback data enabled.`);
        } else {
          logger.info(`⏳ Retrying MongoDB connection (${i + 1}/${retries})...`);
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
  };

  await attemptConnect();
};
