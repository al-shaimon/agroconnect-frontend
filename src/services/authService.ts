import api from './api';
import type { AuthResponse, LoginFormData, RegisterFormData, User, ApiResponse } from '../types';

export const authService = {
  // Register new user
  register: async (data: RegisterFormData | FormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User> | FormData): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // Upload verification document
  uploadVerificationDocument: async (formData: FormData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/auth/upload-verification', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete verification document
  deleteVerificationDocument: async (documentId: string): Promise<ApiResponse<User>> => {
    const response = await api.delete<ApiResponse<User>>(
      `/auth/verification-document/${documentId}`
    );
    return response.data;
  },

  // Get stored user from localStorage
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};
