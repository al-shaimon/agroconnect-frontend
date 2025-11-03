// Polling-based notification service (Vercel-compatible alternative to Socket.IO)
import { notificationService } from './notificationService';
import type { Notification } from '../types';

type NotificationCallback = (data: { notifications: Notification[]; unreadCount: number }) => void;

class PollingService {
  private intervalId: number | null = null;
  private pollingInterval = 5000; // 5 seconds
  private listeners: Set<NotificationCallback> = new Set();
  private lastNotificationCount = 0;

  start() {
    if (this.intervalId) return;

    console.log('✅ Started polling for notifications (every 5 seconds)');

    // Poll immediately
    this.pollNotifications();

    // Then poll every 5 seconds
    this.intervalId = window.setInterval(() => {
      this.pollNotifications();
    }, this.pollingInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('❌ Stopped polling for notifications');
    }
  }

  // Subscribe to notification updates
  subscribe(callback: NotificationCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private async pollNotifications() {
    try {
      const response = await notificationService.getNotifications();
      if (response.success && response.data) {
        const currentCount = response.data.length;

        // Notify all listeners
        this.listeners.forEach((callback) => {
          callback({
            notifications: response.data || [],
            unreadCount: response.unreadCount || 0,
          });
        });

        // Log if new notifications arrived
        if (currentCount > this.lastNotificationCount) {
          console.log('📬 New notifications received:', currentCount - this.lastNotificationCount);
        }

        this.lastNotificationCount = currentCount;
      }
    } catch (error) {
      console.error('Error polling notifications:', error);
    }
  }
}

export const pollingService = new PollingService();
