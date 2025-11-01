import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { farmerService } from '../../services/farmerService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COLORS, ORDER_STATUSES } from '../../constants/theme';
import type { Order } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';

export const OrderNotifications = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await farmerService.getOrders('pending');
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await farmerService.updateOrderStatus(orderId, status);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'in-transit':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell style={{ color: COLORS.primary }} />
          <CardTitle style={{ color: COLORS.primary }}>Recent Orders</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No pending orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{order.orderId}</p>
                    <p className="text-sm text-gray-600">
                      {typeof order.buyerId === 'object' && order.buyerId.name}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Items: {order.items.length}</p>
                  <p>Total: ৳{order.totalAmount}</p>
                  <p className="text-xs mt-1">
                    {formatDistanceToNow(new Date(order.orderDate), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) => handleStatusUpdate(order._id, value)}
                    defaultValue={order.status}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ORDER_STATUSES.PENDING}>Pending</SelectItem>
                      <SelectItem value={ORDER_STATUSES.CONFIRMED}>Confirmed</SelectItem>
                      <SelectItem value={ORDER_STATUSES.IN_TRANSIT}>In Transit</SelectItem>
                      <SelectItem value={ORDER_STATUSES.DELIVERED}>Delivered</SelectItem>
                      <SelectItem value={ORDER_STATUSES.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
