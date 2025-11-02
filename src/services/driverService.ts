import api from './api';

export const driverService = {
  // Get driver profile
  getProfile: async () => {
    const response = await api.get('/driver/profile');
    return response.data;
  },

  // Update driver profile
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    location?: {
      area?: string;
      city?: string;
      coordinates?: { lat: number; lng: number };
    };
    vehicleInfo?: {
      vehicleType?: string;
      vehicleModel?: string;
      vehicleNumber?: string;
      hasFreezer?: boolean;
    };
  }) => {
    const response = await api.put('/driver/profile', data);
    return response.data;
  },

  // Update availability status
  updateAvailability: async (isAvailable: boolean) => {
    const response = await api.put('/driver/availability', { isAvailable });
    return response.data;
  },

  // Update current location
  updateLocation: async (latitude: number, longitude: number) => {
    const response = await api.put('/driver/location', { latitude, longitude });
    return response.data;
  },

  // Get available orders
  getAvailableOrders: async () => {
    const response = await api.get('/driver/available-orders');
    return response.data;
  },

  // Get my assigned orders
  getMyOrders: async (status?: string) => {
    const response = await api.get('/driver/my-orders', { params: { status } });
    return response.data;
  },

  // Accept an order
  acceptOrder: async (orderId: string) => {
    const response = await api.post(`/driver/accept-order/${orderId}`);
    return response.data;
  },

  // Update delivery status
  updateDeliveryStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/driver/order/${orderId}/status`, { status });
    return response.data;
  },

  // Get driver statistics
  getStats: async () => {
    const response = await api.get('/driver/stats');
    return response.data;
  },
};
