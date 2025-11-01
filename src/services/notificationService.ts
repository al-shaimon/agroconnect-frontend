import api from './api';
import type { Notification, ApiResponse } from '../types';

export const notificationService = {
  // Get all notifications
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await api.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/notifications/${id}`);
    return response.data;
  },
};
