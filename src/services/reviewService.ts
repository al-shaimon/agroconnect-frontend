import api from './api';
import type { ApiResponse } from '../types';

export interface ReviewRatings {
  // For buyers reviewing farmers
  productQuality?: number;
  accuracy?: number;
  communication?: number;
  packaging?: number;
  timeliness?: number;

  // For farmers reviewing buyers
  paymentPromptness?: number;
  professionalism?: number;
  clarity?: number;
  respectfulness?: number;
}

export interface Review {
  _id: string;
  orderId:
    | string
    | {
        _id: string;
        orderId: string;
        totalAmount: number;
        createdAt: string;
      };
  reviewerId:
    | string
    | {
        _id: string;
        name: string;
        profileImage?: string;
        role: string;
      };
  revieweeId:
    | string
    | {
        _id: string;
        name: string;
        profileImage?: string;
        role: string;
      };
  reviewerRole: 'buyer' | 'farmer';
  ratings: ReviewRatings;
  averageRating: number;
  comment?: string;
  response?: {
    text: string;
    createdAt: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewData {
  orderId: string;
  revieweeId: string;
  ratings: ReviewRatings;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    stats: ReviewStats;
  };
  message?: string;
}

export const reviewService = {
  // Create a review
  createReview: async (data: CreateReviewData): Promise<ApiResponse<Review>> => {
    const response = await api.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  // Get reviews for a user
  getUserReviews: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> => {
    const response = await api.get<ReviewsResponse>(`/reviews/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get my reviews (as reviewer)
  getMyReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await api.get<ApiResponse<Review[]>>('/reviews/my-reviews');
    return response.data;
  },

  // Get reviews I received
  getReceivedReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await api.get<ApiResponse<Review[]>>('/reviews/received');
    return response.data;
  },

  // Check if order can be reviewed
  canReviewOrder: async (
    orderId: string
  ): Promise<
    ApiResponse<{
      canReview: boolean;
      reason?: string;
      review?: Review;
    }>
  > => {
    const response = await api.get<
      ApiResponse<{
        canReview: boolean;
        reason?: string;
        review?: Review;
      }>
    >(`/reviews/can-review/${orderId}`);
    return response.data;
  },

  // Add response to review
  addResponse: async (reviewId: string, response: string): Promise<ApiResponse<Review>> => {
    const responseData = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}/response`, {
      response,
    });
    return responseData.data;
  },
};
