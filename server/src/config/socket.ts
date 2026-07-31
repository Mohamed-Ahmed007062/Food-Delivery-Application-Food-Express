import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/utils/logger.js';
import { env } from './env.js';

let io: Server | null = null;

export const initSocket = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Socket Client Connected: ${socket.id}`);

    socket.on('join:room', (room: string) => {
      socket.join(room);
      logger.info(`🚪 Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('leave:room', (room: string) => {
      socket.leave(room);
      logger.info(`👋 Socket ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const emitEvent = (event: string, data: unknown, room?: string) => {
  if (!io) return;
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
};
