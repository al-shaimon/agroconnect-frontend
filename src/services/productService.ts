import api from './api';
import type { ApiResponse } from '../types';

export interface Product {
  _id: string;
  farmerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  cloudinaryPublicId: string;
  quality: string;
  harvestDate: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  // Get products by farmer ID
  getProductsByFarmer: async (farmerId: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products/farmer/${farmerId}`);
    return response.data;
  },

  // Create a new product (farmer only)
  createProduct: async (productData: FormData): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update a product (farmer only)
  updateProduct: async (id: string, productData: FormData): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a product (farmer only)
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`);
    return response.data;
  },

  // Filter products
  filterProducts: async (filters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    quality?: string;
  }): Promise<ApiResponse<Product[]>> => {
    const queryParams = new URLSearchParams();
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.quality) queryParams.append('quality', filters.quality);

    const response = await api.get<ApiResponse<Product[]>>(`/products/filter?${queryParams}`);
    return response.data;
  },
};