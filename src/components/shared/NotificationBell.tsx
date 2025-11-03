import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { notificationService } from '../../services/notificationService';
import { pollingService } from '../../services/pollingService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types';
import { COLORS } from '../../constants/theme';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to polling updates
    const unsubscribe = pollingService.subscribe((data) => {
      const previousCount = notifications.length;
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);

      // Show toast for new notifications
      if (data.notifications.length > previousCount) {
        const newNotification = data.notifications[0];
        toast.info(newNotification.message);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getNotificationPath = (notification: Notification): string => {
    const role = user?.role;

    // Handle order notifications
    if (notification.type === 'order' && notification.orderId) {
      if (role === 'farmer') {
        return `/farmer/orders`;
      } else if (role === 'buyer') {
        // TODO: Create buyer orders page, for now redirect to marketplace
        return `/buyer/marketplace`;
      }
    }

    // Handle verification notifications
    if (notification.type === 'verification') {
      if (role === 'farmer' || role === 'buyer') {
        return '/profile';
      }
    }

    // Handle system notifications (document submission for admin)
    if (notification.type === 'system') {
      if (role === 'admin') {
        return '/admin/verifications';
      }
    }

    // Handle broadcast notifications
    if (notification.type === 'broadcast') {
      if (role === 'farmer') {
        return '/farmer/dashboard';
      } else if (role === 'buyer') {
        return '/buyer/marketplace';
      } else if (role === 'admin') {
        return '/admin/panel';
      }
    }

    // Default fallback
    return '/';
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    // Navigate to relevant page
    const path = getNotificationPath(notification);
    navigate(path);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              style={{ backgroundColor: COLORS.primary }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              style={{ color: COLORS.primary }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-green-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS.primary }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
