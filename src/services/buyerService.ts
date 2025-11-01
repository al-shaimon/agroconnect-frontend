import api from './api';
import type { Product, Order, CreateOrderData, BuyerStats, ApiResponse } from '../types';

export const buyerService = {
  // Browse all products
  getProducts: async (params?: {
    category?: string;
    quality?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    order?: string;
  }): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>('/buyer/products', { params });
    return response.data;
  },

  // Get product details
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/buyer/products/${id}`);
    return response.data;
  },

  // Place order
  placeOrder: async (data: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>('/buyer/orders', data);
    return response.data;
  },

  // Get my orders
  getOrders: async (status?: string): Promise<ApiResponse<Order[]>> => {
    const response = await api.get<ApiResponse<Order[]>>('/buyer/orders', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  // Get order details
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/buyer/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(`/buyer/orders/${id}/cancel`);
    return response.data;
  },

  // Get buyer stats
  getStats: async (): Promise<ApiResponse<BuyerStats>> => {
    const response = await api.get<ApiResponse<BuyerStats>>('/buyer/stats');
    return response.data;
  },
};
