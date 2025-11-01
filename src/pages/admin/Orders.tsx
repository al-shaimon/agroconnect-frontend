import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import type { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLORS } from '../../constants/theme';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Package,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: { status?: string; startDate?: string; endDate?: string } = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await adminService.getOrders(params);
      setOrders(response.data || []);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    try {
      const response = await adminService.getOrder(orderId);
      setSelectedOrder(response.data || null);
      setShowOrderDialog(true);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch order details');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      'in-transit': { color: 'bg-purple-100 text-purple-800', text: 'In Transit' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };

    const item = config[status as keyof typeof config] || config.pending;
    return <Badge className={item.color}>{item.text}</Badge>;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();

    const buyerName = order.buyerId && typeof order.buyerId === 'object' ? order.buyerId.name : '';
    const farmerName =
      order.farmerId && typeof order.farmerId === 'object' ? order.farmerId.name : '';

    return (
      order.orderId?.toLowerCase().includes(search) ||
      buyerName.toLowerCase().includes(search) ||
      farmerName.toLowerCase().includes(search)
    );
  });

  const calculateStats = () => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter((o) => o.status === 'pending').length;
    const confirmed = filteredOrders.filter((o) => o.status === 'confirmed').length;
    const inTransit = filteredOrders.filter((o) => o.status === 'in-transit').length;
    const delivered = filteredOrders.filter((o) => o.status === 'delivered').length;
    const cancelled = filteredOrders.filter((o) => o.status === 'cancelled').length;
    const totalRevenue = filteredOrders
      .filter((o) => ['confirmed', 'in-transit', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return { total, pending, confirmed, inTransit, delivered, cancelled, totalRevenue };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-600 mt-1">Monitor all platform orders</p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" style={{ color: COLORS.primary }} />
          <span className="text-2xl font-bold">{stats.total}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">In Transit</p>
            <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Order ID, buyer, or farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">
                <Filter className="h-4 w-4 inline mr-2" />
                Status
              </Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">
                <Calendar className="h-4 w-4 inline mr-2" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Buyer</th>
                    <th className="text-left py-3 px-4">Farmer</th>
                    <th className="text-left py-3 px-4">Items</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-medium">{order.orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {order.buyerId && typeof order.buyerId === 'object'
                              ? order.buyerId.name
                              : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.buyerId && typeof order.buyerId === 'object'
                              ? order.buyerId.email
                              : ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {order.farmerId && typeof order.farmerId === 'object'
                              ? order.farmerId.name
                              : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.farmerId && typeof order.farmerId === 'object'
                              ? order.farmerId.email
                              : ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{order.items?.length || 0}</span> item(s)
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">
                          ৳{order.totalAmount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewOrderDetails(order._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status and Amount */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">
                    ৳{selectedOrder.totalAmount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Buyer & Farmer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Buyer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <p className="font-medium">
                        {selectedOrder.buyerId && typeof selectedOrder.buyerId === 'object'
                          ? selectedOrder.buyerId.name
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {selectedOrder.buyerId && typeof selectedOrder.buyerId === 'object'
                          ? selectedOrder.buyerId.email
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {selectedOrder.buyerId && typeof selectedOrder.buyerId === 'object'
                          ? selectedOrder.buyerId.phone
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Farmer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <p className="font-medium">
                        {selectedOrder.farmerId && typeof selectedOrder.farmerId === 'object'
                          ? selectedOrder.farmerId.name
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {selectedOrder.farmerId && typeof selectedOrder.farmerId === 'object'
                          ? selectedOrder.farmerId.email
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {selectedOrder.farmerId && typeof selectedOrder.farmerId === 'object'
                          ? selectedOrder.farmerId.phone
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Information */}
              {selectedOrder.deliveryAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {selectedOrder.deliveryAddress.area}, {selectedOrder.deliveryAddress.city}
                    </p>
                    {selectedOrder.deliveryAddress.details && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedOrder.deliveryAddress.details}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{item.productName || 'Product'}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} unit(s) × ৳{item.pricePerUnit?.toLocaleString()}
                            </p>
                            {item.deliverySlot && (
                              <p className="text-xs text-gray-500 mt-1">
                                Slot: {item.deliverySlot.date} | {item.deliverySlot.timeSlot.start}{' '}
                                - {item.deliverySlot.timeSlot.end}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{item.subtotal?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
