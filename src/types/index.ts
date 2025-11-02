// User Types
export interface Location {
  area: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin' | 'driver';
  location?: Location;
  profileImage?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDocuments?: Array<{
    _id: string;
    documentType: 'nid' | 'passport' | 'driving_license' | 'birth_certificate' | 'trade_license';
    documentNumber: string;
    documentUrl: string;
    cloudinaryPublicId?: string;
    uploadedAt: string;
  }>;
  rejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  // Driver-specific fields
  driverType?: 'professional' | 'volunteer';
  vehicleInfo?: {
    vehicleType?: 'bike' | 'bicycle' | 'car' | 'van' | 'truck';
    vehicleModel?: string;
    vehicleNumber?: string;
    hasFreezer?: boolean;
    vehicleImage?: string;
    vehicleImagePublicId?: string;
  };
  isAvailable?: boolean;
  completedDeliveries?: number;
  rating?: number;
  totalRatings?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    location?: Location;
    isVerified: boolean;
    token: string;
  };
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  images?: string[];
  isActive?: boolean;
  // For global products in marketplace
  minPrice?: number;
  maxPrice?: number;
  farmersCount?: number;
  available?: boolean;
  // Legacy fields for backward compatibility
  farmerId?:
    | string
    | {
        _id: string;
        name: string;
        phone: string;
        email: string;
        location?: Location;
        rating?: number;
        totalReviews?: number;
      };
  price?: number;
  availableQuantity?: number;
  imageUrl?: string;
  quality?: 'Premium' | 'Standard' | 'Organic';
  harvestDate?: string;
  isAvailable?: boolean;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmerProduct {
  _id: string;
  globalProductId: Product;
  farmerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    location?: Location;
    rating?: number;
    totalReviews?: number;
  };
  price: number;
  availableQuantity: number;
  quality: 'Premium' | 'Standard' | 'Organic';
  harvestDate?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  availableQuantity: number;
  quality: 'Premium' | 'Standard' | 'Organic';
  harvestDate?: string;
  location?: string;
}

// Slot Types
export interface TimeSlot {
  start: string;
  end: string;
}

export interface DeliverySlotInfo {
  date: string;
  timeSlot: TimeSlot;
}

export interface ProductSlot {
  _id: string;
  productId: string;
  farmerId: string;
  date: Date;
  timeSlot: TimeSlot;
  availableQuantity: number;
  originalQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  deliverySlot?: DeliverySlotInfo;
}

export interface DeliveryAddress {
  area: string;
  city: string;
  details?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  buyerId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
  farmerId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
  items: OrderItem[];
  totalAmount: number;
  status: 'processing' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'verified' | 'rejected';
  paymentDetails?: {
    bkashNumber: string;
    transactionId: string;
  };
  deliveryAddress: DeliveryAddress;
  notes?: string;
  orderDate: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    deliverySlot?: DeliverySlotInfo;
  }>;
  deliveryAddress: DeliveryAddress;
  notes?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSlot?: DeliverySlotInfo;
}

// Notification Types
export interface Notification {
  _id: string;
  recipientId?: string;
  recipientRole?: 'farmer' | 'buyer' | 'all';
  type: 'order' | 'broadcast' | 'system' | 'verification';
  title: string;
  message: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Stats Types
export interface FarmerStats {
  products: {
    total: number;
    available: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    total: number;
  };
  recentOrders: Order[];
}

export interface BuyerStats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  spending: {
    total: number;
  };
  recentOrders: Order[];
}

export interface AdminStats {
  users: {
    total: number;
    farmers: number;
    buyers: number;
    verified: number;
    active: number;
  };
  products: {
    total: number;
    available: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  revenue: {
    total: number;
  };
  recentOrders: Order[];
  recentUsers: User[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  unreadCount?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'buyer';
  location: {
    area: string;
    city: string;
  };
}

export interface BroadcastFormData {
  title: string;
  message: string;
  recipientRole: 'farmer' | 'buyer' | 'all';
}
