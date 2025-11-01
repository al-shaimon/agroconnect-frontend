import api from './api';
import type { User, Order, AdminStats, BroadcastFormData, ApiResponse } from '../types';

export const adminService = {
  // Get all users
  getUsers: async (params?: {
    role?: string;
    isVerified?: boolean;
    isActive?: boolean;
  }): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params });
    return response.data;
  },

  // Get user details
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data;
  },

  // Verify user
  verifyUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/verify`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id: string, isActive: boolean): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/admin/users/${id}`);
    return response.data;
  },

  // Get all orders
  getOrders: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Order[]>> => {
    const response = await api.get<ApiResponse<Order[]>>('/admin/orders', { params });
    return response.data;
  },

  // Get order details
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/admin/orders/${id}`);
    return response.data;
  },

  // Get platform stats
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data;
  },

  // Send broadcast notification
  sendBroadcast: async (data: BroadcastFormData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/admin/broadcast', data);
    return response.data;
  },

  // Global Products Management
  getGlobalProducts: async (params?: {
    category?: string;
    search?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/products/admin/global-products', {
      params,
    });
    return response.data;
  },

  getGlobalProduct: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/products/admin/global-products/${id}`);
    return response.data;
  },

  createGlobalProduct: async (data: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/products/admin/global-products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGlobalProduct: async (id: string, data: FormData): Promise<ApiResponse<any>> => {
    const response = await api.put<ApiResponse<any>>(
      `/products/admin/global-products/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteGlobalProduct: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/products/admin/global-products/${id}`);
    return response.data;
  },
};
