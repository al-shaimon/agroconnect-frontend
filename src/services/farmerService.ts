import api from './api';
import type { Product, ProductFormData, Order, FarmerStats, ApiResponse } from '../types';

export const farmerService = {
  // Get farmer's products
  getMyProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>('/farmer/products');
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/farmer/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (data: ProductFormData | FormData): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>('/farmer/products', data, {
      headers:
        data instanceof FormData
          ? {
              'Content-Type': 'multipart/form-data',
            }
          : undefined,
    });
    return response.data;
  },

  // Update product
  updateProduct: async (
    id: string,
    data: Partial<ProductFormData> | FormData
  ): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(`/farmer/products/${id}`, data, {
      headers:
        data instanceof FormData
          ? {
              'Content-Type': 'multipart/form-data',
            }
          : undefined,
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/farmer/products/${id}`);
    return response.data;
  },

  // Get farmer's orders
  getOrders: async (status?: string): Promise<ApiResponse<Order[]>> => {
    const response = await api.get<ApiResponse<Order[]>>('/farmer/orders', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await api.put<ApiResponse<Order>>(`/farmer/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  // Get farmer stats
  getStats: async (): Promise<ApiResponse<FarmerStats>> => {
    const response = await api.get<ApiResponse<FarmerStats>>('/farmer/stats');
    return response.data;
  },

  // Get revenue analytics by product
  getRevenueAnalytics: async (
    days: number = 30
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        productName: string;
        totalRevenue: number;
        totalQuantity: number;
      }>
    >
  > => {
    const response = await api.get('/farmer/analytics/revenue', {
      params: { days },
    });
    return response.data;
  },
};
