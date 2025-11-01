import api from './api';
import type { ApiResponse, User } from '../types';

export const adminVerificationService = {
  // Get all pending verifications
  getPendingVerifications: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/admin/verifications/pending');
    return response.data;
  },

  // Get all verifications with filters
  getAllVerifications: async (params?: {
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]> & { total?: number; pages?: number }> => {
    const response = await api.get<ApiResponse<User[]> & { total?: number; pages?: number }>(
      '/admin/verifications',
      { params }
    );
    return response.data;
  },

  // Get verification details
  getVerificationDetails: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/admin/verifications/${userId}`);
    return response.data;
  },

  // Approve verification
  approveVerification: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/admin/verifications/${userId}/approve`);
    return response.data;
  },

  // Reject verification
  rejectVerification: async (userId: string, reason: string): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/admin/verifications/${userId}/reject`, {
      reason,
    });
    return response.data;
  },

  // Get verification statistics
  getVerificationStats: async (): Promise<
    ApiResponse<{
      overall: { total: number; pending: number; approved: number; rejected: number };
      byRole: {
        farmer: { pending: number; approved: number; rejected: number };
        buyer: { pending: number; approved: number; rejected: number };
      };
    }>
  > => {
    const response = await api.get('/admin/verifications/stats');
    return response.data;
  },
};
