import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      socketService.connect(user._id);
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    socketService.off(event, callback);
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    socketService.emit(event, data);
  }, []);

  return { on, off, emit, isConnected: socketService.isConnected() };
};
