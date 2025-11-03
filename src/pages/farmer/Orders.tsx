import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { farmerService } from '../../services/farmerService';
import { reviewService, type CreateReviewData } from '../../services/reviewService';
import type { Order } from '../../types';
import { COLORS } from '../../constants/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Package, Clock, CheckCircle, XCircle, Truck, Star } from 'lucide-react';

export const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState<{
    orderId: string;
    action: 'verify' | 'reject';
  } | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
  const [buyerRatings, setBuyerRatings] = useState<Record<string, number>>({});

  // Rating state
  const [ratings, setRatings] = useState({
    paymentPromptness: 0,
    communication: 0,
    professionalism: 0,
    clarity: 0,
    respectfulness: 0,
  });
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getOrders();
      setOrders(response.data || []);

      // Collect unique buyer IDs that need ratings (only for processing orders)
      const uniqueBuyerIds = new Set<string>();
      const deliveredOrderIds: string[] = [];

      for (const order of response.data || []) {
        // Collect delivered orders for review check
        if (order.status === 'delivered') {
          deliveredOrderIds.push(order._id);
        }

        // Collect unique buyer IDs only for processing orders (where ratings are displayed)
        if (order.status === 'processing' && order.paymentStatus === 'pending') {
          const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;
          if (buyer && buyer._id) {
            uniqueBuyerIds.add(buyer._id);
          }
        }
      }

      // Fetch buyer ratings in parallel (only for unique buyers)
      const ratings: Record<string, number> = {};
      const ratingPromises = Array.from(uniqueBuyerIds).map(async (buyerId) => {
        try {
          const buyerReviews = await reviewService.getUserReviews(buyerId);
          if (buyerReviews.data && buyerReviews.data.stats) {
            ratings[buyerId] = buyerReviews.data.stats.averageRating;
          }
        } catch (error) {
          console.error('Error fetching buyer reviews for:', buyerId, error);
        }
      });

      // Fetch review checks in parallel (only for delivered orders)
      const reviewed = new Set<string>();
      const reviewPromises = deliveredOrderIds.map(async (orderId) => {
        try {
          const reviewCheck = await reviewService.canReviewOrder(orderId);
          if (!reviewCheck.data?.canReview && reviewCheck.data?.review) {
            reviewed.add(orderId);
          }
        } catch (error) {
          console.error('Error checking review for order:', orderId, error);
        }
      });

      // Wait for all parallel requests to complete
      await Promise.all([...ratingPromises, ...reviewPromises]);

      setReviewedOrders(reviewed);
      setBuyerRatings(ratings);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (orderId: string, action: 'verify' | 'reject') => {
    try {
      setVerifyingPayment({ orderId, action });
      await farmerService.verifyPayment(orderId, action);
      toast.success(
        action === 'verify'
          ? 'Payment verified successfully! Order confirmed.'
          : 'Payment rejected. Order has been cancelled.'
      );
      fetchOrders();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to verify payment');
    } finally {
      setVerifyingPayment(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      setUpdatingStatus(orderId);
      await farmerService.updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'in-transit': { color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Package;

    return (
      <Badge className={`${config?.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getNextStatus = (currentStatus: string, paymentStatus?: string) => {
    // Can't proceed to confirmed if payment is not verified
    if (currentStatus === 'processing' && paymentStatus !== 'verified') {
      return null;
    }

    const statusFlow = {
      processing: 'confirmed',
      confirmed: 'in-transit',
      'in-transit': 'delivered',
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusLabel = (currentStatus: string, paymentStatus?: string) => {
    const nextStatus = getNextStatus(currentStatus, paymentStatus);
    if (!nextStatus) return null;

    const labels = {
      confirmed: 'Confirm Order',
      'in-transit': 'Mark In Transit',
      delivered: 'Mark Delivered',
    };
    return labels[nextStatus as keyof typeof labels];
  };

  const openReviewDialog = async (order: Order) => {
    const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;
    if (!buyer) {
      toast.error('Buyer information not available');
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
          paymentPromptness: 0,
          communication: 0,
          professionalism: 0,
          clarity: 0,
          respectfulness: 0,
        });
        setComment('');
      } else {
        toast.info(response.data?.reason || 'Cannot review this order');
      }
    } catch (error) {
      console.error('Error checking review status:', error);
      toast.error('Failed to check review status');
    }
  };

  const submitReview = async () => {
    if (!selectedOrder) return;

    const buyer = typeof selectedOrder.buyerId === 'object' ? selectedOrder.buyerId : null;
    if (!buyer) {
      toast.error('Buyer information not available');
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
        revieweeId: buyer._id,
        ratings,
        comment: comment.trim() || undefined,
      };

      console.log('Submitting review:', reviewData);
      const response = await reviewService.createReview(reviewData);
      console.log('Review response:', response);

      if (response.success) {
        toast.success('Review submitted successfully!');
        setReviewDialogOpen(false);
        setSelectedOrder(null);
        // Refresh orders to update UI
        fetchOrders();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Failed to submit review';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">You haven't received any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => {
            const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;
            const nextStatus = getNextStatus(order.status, order.paymentStatus);
            const nextStatusLabel = getNextStatusLabel(order.status, order.paymentStatus);

            return (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Buyer Info */}
                  {buyer && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Buyer Information</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Name:</span>{' '}
                          <span className="font-medium">{buyer.name}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Phone:</span>{' '}
                          <span className="font-medium">{buyer.phone}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Email:</span>{' '}
                          <span className="font-medium">{buyer.email}</span>
                        </p>
                        {buyerRatings[buyer._id] && (
                          <p className="flex items-center gap-2 mt-2">
                            <span className="text-gray-600">Average Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-yellow-600">
                                {buyerRatings[buyer._id].toFixed(1)}
                              </span>
                            </div>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Details - Show for processing orders with pending payment */}
                  {order.status === 'processing' &&
                    order.paymentStatus === 'pending' &&
                    order.paymentDetails && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          Payment Verification Required
                        </h4>
                        <div className="space-y-2 text-sm mb-4">
                          <p>
                            <span className="text-gray-600">bKash Number:</span>{' '}
                            <span className="font-mono font-medium">
                              {order.paymentDetails.bkashNumber}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Transaction ID:</span>{' '}
                            <span className="font-mono font-medium">
                              {order.paymentDetails.transactionId}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handlePaymentVerification(order._id, 'verify')}
                            disabled={verifyingPayment?.orderId === order._id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                          >
                            {verifyingPayment?.orderId === order._id &&
                            verifyingPayment?.action === 'verify' ? (
                              <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Verifying...
                              </span>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Verify Payment</span>
                                <span className="sm:hidden">Verify</span>
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handlePaymentVerification(order._id, 'reject')}
                            disabled={verifyingPayment?.orderId === order._id}
                            variant="destructive"
                            className="flex-1 text-sm"
                          >
                            {verifyingPayment?.orderId === order._id &&
                            verifyingPayment?.action === 'reject' ? (
                              'Rejecting...'
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Reject Payment</span>
                                <span className="sm:hidden">Reject</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* Payment Details - Show for confirmed/verified orders */}
                  {order.paymentDetails &&
                    order.paymentStatus === 'verified' &&
                    (order.status === 'confirmed' ||
                      order.status === 'in-transit' ||
                      order.status === 'delivered') && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Payment Information (Verified)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-600">bKash Number:</span>{' '}
                            <span className="font-mono font-medium">
                              {order.paymentDetails.bkashNumber}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-600">Transaction ID:</span>{' '}
                            <span className="font-mono font-medium">
                              {order.paymentDetails.transactionId}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>

                    {/* Desktop Table View */}
                    <div className="hidden md:block border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                              Product
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                              Price/Unit
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 text-sm">{item.productName}</td>
                              <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-right">
                                ৳{item.pricePerUnit.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-medium">
                                ৳{item.subtotal.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-right">
                              Total Amount:
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-right">
                              ৳{order.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-white">
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Quantity</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Price/Unit</p>
                                <p className="font-medium">৳{item.pricePerUnit.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t flex justify-between items-center">
                              <span className="text-sm text-gray-600">Subtotal</span>
                              <span className="font-semibold text-base">
                                ৳{item.subtotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Total Amount */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total Amount</span>
                          <span className="font-bold text-lg text-green-600">
                            ৳{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-700">
                      {order.deliveryAddress.area}, {order.deliveryAddress.city}
                      {order.deliveryAddress.details && (
                        <>
                          <br />
                          <span className="text-gray-600">{order.deliveryAddress.details}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                      <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {nextStatus && order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(order._id, nextStatus)}
                          disabled={updatingStatus === order._id}
                          style={{ backgroundColor: COLORS.primary }}
                          className="text-white"
                        >
                          {updatingStatus === order._id ? (
                            <span className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Updating...
                            </span>
                          ) : (
                            nextStatusLabel
                          )}
                        </Button>
                        {order.status === 'confirmed' && (
                          <Button
                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                            disabled={updatingStatus === order._id}
                            variant="destructive"
                          >
                            Cancel Order
                          </Button>
                        )}
                      </>
                    )}

                    {/* Review Button for Delivered Orders */}
                    {order.status === 'delivered' && (
                      <>
                        {reviewedOrders.has(order._id) ? (
                          <Button variant="outline" className="flex items-center gap-2" disabled>
                            <CheckCircle className="h-4 w-4" />
                            Reviewed
                          </Button>
                        ) : (
                          <Button
                            onClick={() => openReviewDialog(order)}
                            className="flex items-center gap-2"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            <Star className="h-4 w-4" />
                            Rate Buyer
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Rate the Buyer</DialogTitle>
            <DialogDescription className="text-sm">
              Please rate your experience with the buyer for order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 py-3 md:py-4">
            {/* Payment Promptness */}
            <div>
              <Label className="text-sm md:text-base font-semibold">Payment Promptness</Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">Was the payment made on time?</p>
              <StarRating
                value={ratings.paymentPromptness}
                onChange={(value) => setRatings({ ...ratings, paymentPromptness: value })}
              />
            </div>

            {/* Communication */}
            <div>
              <Label className="text-sm md:text-base font-semibold">Communication</Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">
                How clear and responsive was the buyer?
              </p>
              <StarRating
                value={ratings.communication}
                onChange={(value) => setRatings({ ...ratings, communication: value })}
              />
            </div>

            {/* Professionalism */}
            <div>
              <Label className="text-sm md:text-base font-semibold">Professionalism</Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">
                How professional was the buyer?
              </p>
              <StarRating
                value={ratings.professionalism}
                onChange={(value) => setRatings({ ...ratings, professionalism: value })}
              />
            </div>

            {/* Clarity */}
            <div>
              <Label className="text-sm md:text-base font-semibold">Clarity</Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">
                Were the buyer's requirements clearly stated?
              </p>
              <StarRating
                value={ratings.clarity}
                onChange={(value) => setRatings({ ...ratings, clarity: value })}
              />
            </div>

            {/* Respectfulness */}
            <div>
              <Label className="text-sm md:text-base font-semibold">Respectfulness</Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">How respectful was the buyer?</p>
              <StarRating
                value={ratings.respectfulness}
                onChange={(value) => setRatings({ ...ratings, respectfulness: value })}
              />
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-sm md:text-base font-semibold">
                Additional Comments (Optional)
              </Label>
              <p className="text-xs md:text-sm text-gray-600 mb-2">Share your experience</p>
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>

            {/* Average Rating Display */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">Average Rating</p>
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
                        className={`h-5 w-5 md:h-6 md:w-6 ${
                          star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-base md:text-lg font-bold">
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

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submittingReview}
              className="flex-1 text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={submittingReview || Object.values(ratings).some((r) => r === 0)}
              className="flex-1 text-sm md:text-base"
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
