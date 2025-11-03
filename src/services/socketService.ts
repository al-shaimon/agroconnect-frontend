import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/theme';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    // Socket.IO disabled for Vercel deployment (serverless doesn't support WebSockets)
    // Use polling for notifications instead, or deploy backend to a platform that supports WebSockets
    // console.log('⚠️ Socket.IO is disabled in production (Vercel limitation)');
    return;

    /* Original Socket.IO code - uncomment if deploying to a WebSocket-compatible platform
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
        // Join the user's room
        if (this.socket) {
          this.socket.emit('join', userId);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    */
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }
}

export const socketService = new SocketService();
