import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { farmerService } from '../../services/farmerService';
import type { Order } from '../../types';
import { COLORS } from '../../constants/theme';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
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
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
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

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'in-transit',
      'in-transit': 'delivered',
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return null;

    const labels = {
      confirmed: 'Confirm Order',
      'in-transit': 'Mark In Transit',
      delivered: 'Mark Delivered',
    };
    return labels[nextStatus as keyof typeof labels];
  };

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
        <div className="space-y-4">
          {orders.map((order) => {
            const buyer = typeof order.buyerId === 'object' ? order.buyerId : null;
            const nextStatus = getNextStatus(order.status);
            const nextStatusLabel = getNextStatusLabel(order.status);

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
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="border rounded-lg overflow-hidden">
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
                  {nextStatus && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex gap-2 pt-2">
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
                      {order.status === 'pending' && (
                        <Button
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          disabled={updatingStatus === order._id}
                          variant="destructive"
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
