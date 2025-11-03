import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { pollingService } from '../services/pollingService';
import { useAuth } from './useAuth';

// Use polling instead of WebSockets for Vercel compatibility
const USE_POLLING = true; // Set to false if backend supports WebSockets

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      if (USE_POLLING) {
        // Use polling for Vercel deployment
        pollingService.start();
      } else {
        // Use WebSockets (requires compatible backend deployment)
        socketService.connect(user._id);
      }
    }

    return () => {
      if (USE_POLLING) {
        pollingService.stop();
      } else {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user?._id]);

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    if (!USE_POLLING) {
      socketService.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (!USE_POLLING) {
      socketService.off(event, callback);
    }
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    if (!USE_POLLING) {
      socketService.emit(event, data);
    }
  }, []);

  return { on, off, emit, isConnected: USE_POLLING ? true : socketService.isConnected() };
};
