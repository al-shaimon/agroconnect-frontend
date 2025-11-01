// Theme Constants for AgroConnect
export const COLORS = {
  primary: '#2bbe65',
  primaryDark: '#229954',
  primaryLight: '#3dd378',
  white: '#ffffff',
  background: '#f8f9fa',
  text: '#212529',
  textLight: '#6c757d',
  border: '#dee2e6',
  error: '#dc3545',
  success: '#2bbe65',
  warning: '#ffc107',
  info: '#17a2b8',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const PRODUCT_CATEGORIES = ['Vegetable', 'Fruit', 'Grain', 'Dairy', 'Poultry'] as const;

export const PRODUCT_QUALITIES = ['Premium', 'Standard', 'Organic'] as const;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in-transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
} as const;

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  BROADCAST: 'broadcast',
  STATUS_UPDATE: 'status_update',
} as const;
