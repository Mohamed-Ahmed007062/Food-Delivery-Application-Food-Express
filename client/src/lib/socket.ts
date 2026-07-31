import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider.js';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const useSocket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.emit('join:room', `user:${user._id}`);
    if (user.role === 'restaurant-owner' || user.role === 'admin') {
      socket.emit('join:room', 'admin');
    }

    socket.on('order:created', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    });

    socket.on('order:status_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    });

    socket.on('analytics:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    });

    return () => {
      socket.off('order:created');
      socket.off('order:status_updated');
      socket.off('analytics:updated');
      socket.disconnect();
    };
  }, [user, queryClient]);

  return socket;
};
