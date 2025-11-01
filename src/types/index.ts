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
  role: 'farmer' | 'buyer' | 'admin';
  location?: Location;
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
  farmerId:
    | string
    | {
        _id: string;
        name: string;
        phone: string;
        email: string;
        location?: Location;
      };
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  availableQuantity: number;
  imageUrl?: string;
  quality: 'Premium' | 'Standard' | 'Organic';
  harvestDate?: string;
  isAvailable: boolean;
  location?: string;
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

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
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
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
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
  }>;
  deliveryAddress: DeliveryAddress;
  notes?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Notification Types
export interface Notification {
  _id: string;
  userId?: string;
  type: 'order' | 'broadcast' | 'status_update';
  title: string;
  message: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
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
