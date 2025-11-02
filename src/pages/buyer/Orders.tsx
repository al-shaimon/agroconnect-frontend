import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
import { reviewService, type CreateReviewData } from '../../services/reviewService';
import type { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { COLORS } from '../../constants/theme';
import { Package, Clock, CheckCircle, Truck, XCircle, Star, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

export const BuyerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Rating state
  const [ratings, setRatings] = useState({
    productQuality: 0,
    accuracy: 0,
    communication: 0,
    packaging: 0,
    timeliness: 0,
  });
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const filterOrders = () => {
    if (activeTab === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === activeTab));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, orders]);

  const fetchOrders = async () => {
    try {
      const response = await buyerService.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);

        // Check which delivered orders have been reviewed
        const deliveredOrders = response.data.filter((order) => order.status === 'delivered');
        const reviewed = new Set<string>();

        // Check review status for all delivered orders in parallel
        const reviewChecks = deliveredOrders.map(async (order) => {
          try {
            const reviewResponse = await reviewService.canReviewOrder(order._id);
            if (!reviewResponse.data?.canReview && reviewResponse.data?.review) {
              reviewed.add(order._id);
            }
          } catch (error) {
            console.error('Error checking review for order:', order._id, error);
          }
        });

        await Promise.all(reviewChecks);
        setReviewedOrders(reviewed);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const openReviewDialog = async (order: Order) => {
    const farmer = typeof order.farmerId === 'object' ? order.farmerId : null;
    if (!farmer) {
      toast.error('Farmer information not available');
      return;
    }

    // Check if can review
    try {
      const response = await reviewService.canReviewOrder(order._id);
      console.log('Can review response:', response);

      if (response.success && response.data?.canReview) {
        setSelectedOrder(order);
        setReviewDialogOpen(true);
        setRatings({
          productQuality: 0,
          accuracy: 0,
          communication: 0,
          packaging: 0,
          timeliness: 0,
        });
        setComment('');
      } else {
        // If already reviewed, add to reviewed set
        if (!response.data?.canReview && response.data?.review) {
          setReviewedOrders((prev) => new Set([...prev, order._id]));
        }
        toast.info(response.data?.reason || 'Cannot review this order');
      }
    } catch (error) {
      console.error('Error checking review status:', error);
      toast.error('Failed to check review status');
    }
  };

  const submitReview = async () => {
    if (!selectedOrder) return;

    const farmer = typeof selectedOrder.farmerId === 'object' ? selectedOrder.farmerId : null;
    if (!farmer) {
      toast.error('Farmer information not available');
      return;
    }

    // Validate all ratings are filled
    const allRatingsFilled = Object.values(ratings).every((rating) => rating > 0);
    if (!allRatingsFilled) {
      toast.error('Please provide all ratings (1-5 stars each)');
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData: CreateReviewData = {
        orderId: selectedOrder._id,
        revieweeId: farmer._id,
        ratings,
        comment: comment.trim() || undefined,
      };

      console.log('Submitting review:', reviewData);
      const response = await reviewService.createReview(reviewData);
      console.log('Review response:', response);

      if (response.success) {
        toast.success('Review submitted successfully! The farmer can now review you back.');
        setReviewDialogOpen(false);
        // Add to reviewed orders immediately
        setReviewedOrders((prev) => new Set([...prev, selectedOrder._id]));
        setSelectedOrder(null);
        // Refresh orders to update UI
        fetchOrders();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error: unknown) {
      console.error('Error submitting review:', error);
      let errorMessage = 'Failed to submit review';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Narrow error to expected shape without using `any`
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'confirmed':
        return <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    // Status labels are now straightforward as we updated the schema
    return status.toUpperCase().replace(/-/g, ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your orders</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({orders.filter((o) => o.status === 'processing').length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({orders.filter((o) => o.status === 'confirmed').length})
          </TabsTrigger>
          <TabsTrigger value="in-transit">
            In Transit ({orders.filter((o) => o.status === 'in-transit').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`}
                </p>
                <Button
                  onClick={() => navigate('/buyer/marketplace')}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const farmer = typeof order.farmerId === 'object' ? order.farmerId : null;

                return (
                  <Card key={order._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDistanceToNow(new Date(order.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Farmer Info */}
                        <div className="flex items-center justify-between pb-4 border-b">
                          <div>
                            <p className="text-sm text-gray-600">Farmer</p>
                            <p className="font-semibold">{farmer?.name || 'Unknown'}</p>
                            {farmer?.phone && (
                              <p className="text-sm text-gray-600">{farmer.phone}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                              ৳{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Items ({order.items.length})
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                              >
                                <span>
                                  {item.productName} x {item.quantity}
                                </span>
                                <span className="font-semibold">
                                  ৳{item.subtotal.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment Status */}
                        {order.paymentStatus && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              Payment Status
                            </p>
                            {order.paymentStatus === 'pending' && (
                              <p className="text-sm text-yellow-600 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Pending Verification by Farmer
                              </p>
                            )}
                            {order.paymentStatus === 'verified' && (
                              <p className="text-sm text-green-600 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Payment Verified
                              </p>
                            )}
                            {order.paymentStatus === 'rejected' && (
                              <p className="text-sm text-red-600 flex items-center gap-2">
                                <XCircle className="h-4 w-4" />
                                Payment Rejected
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                          {order.status === 'delivered' && (
                            <>
                              {reviewedOrders.has(order._id) ? (
                                <Button
                                  variant="outline"
                                  className="flex-1 flex items-center gap-2"
                                  disabled
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Reviewed
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => openReviewDialog(order)}
                                  className="flex-1 flex items-center gap-2"
                                  style={{ backgroundColor: COLORS.primary }}
                                >
                                  <Star className="h-4 w-4" />
                                  Rate Farmer
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              Please rate your experience with the farmer for order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Product Quality */}
            <div>
              <Label className="text-base font-semibold">Product Quality</Label>
              <p className="text-sm text-gray-600 mb-2">
                How would you rate the quality of the products?
              </p>
              <StarRating
                value={ratings.productQuality}
                onChange={(value) => setRatings({ ...ratings, productQuality: value })}
              />
            </div>

            {/* Accuracy */}
            <div>
              <Label className="text-base font-semibold">Accuracy</Label>
              <p className="text-sm text-gray-600 mb-2">Did the product match the description?</p>
              <StarRating
                value={ratings.accuracy}
                onChange={(value) => setRatings({ ...ratings, accuracy: value })}
              />
            </div>

            {/* Communication */}
            <div>
              <Label className="text-base font-semibold">Communication</Label>
              <p className="text-sm text-gray-600 mb-2">How responsive and clear was the farmer?</p>
              <StarRating
                value={ratings.communication}
                onChange={(value) => setRatings({ ...ratings, communication: value })}
              />
            </div>

            {/* Packaging */}
            <div>
              <Label className="text-base font-semibold">Packaging</Label>
              <p className="text-sm text-gray-600 mb-2">How well were the products packaged?</p>
              <StarRating
                value={ratings.packaging}
                onChange={(value) => setRatings({ ...ratings, packaging: value })}
              />
            </div>

            {/* Timeliness */}
            <div>
              <Label className="text-base font-semibold">Timeliness</Label>
              <p className="text-sm text-gray-600 mb-2">Was the delivery on time?</p>
              <StarRating
                value={ratings.timeliness}
                onChange={(value) => setRatings({ ...ratings, timeliness: value })}
              />
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-base font-semibold">
                Additional Comments (Optional)
              </Label>
              <p className="text-sm text-gray-600 mb-2">Share your experience with others</p>
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>

            {/* Average Rating Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Average Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const ratedValues = Object.values(ratings).filter((r) => r > 0);
                    const avgRating =
                      ratedValues.length > 0
                        ? ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length
                        : 0;
                    return (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-lg font-bold">
                  {(() => {
                    const ratedValues = Object.values(ratings).filter((r) => r > 0);
                    return ratedValues.length > 0
                      ? (ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length).toFixed(1)
                      : '0.0';
                  })()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submittingReview}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={submittingReview || Object.values(ratings).some((r) => r === 0)}
              className="flex-1"
              style={{ backgroundColor: COLORS.primary }}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
