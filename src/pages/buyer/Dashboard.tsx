import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyerService';
import type { BuyerStats } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { COLORS } from '../../constants/theme';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const BuyerDashboard = () => {
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await buyerService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const orderStats = [
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      icon: ShoppingCart,
      color: COLORS.primary,
    },
    {
      title: 'Pending',
      value: stats?.orders.pending || 0,
      icon: Clock,
      color: '#fbbf24',
    },
    {
      title: 'Confirmed',
      value: stats?.orders.confirmed || 0,
      icon: CheckCircle,
      color: '#10b981',
    },
    {
      title: 'In Transit',
      value: stats?.orders.inTransit || 0,
      icon: Truck,
      color: '#3b82f6',
    },
    {
      title: 'Delivered',
      value: stats?.orders.delivered || 0,
      icon: Package,
      color: '#22c55e',
    },
    {
      title: 'Cancelled',
      value: stats?.orders.cancelled || 0,
      icon: XCircle,
      color: '#ef4444',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Total Spending Card */}
      <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" style={{ color: COLORS.primary }} />
            Total Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            ৳{stats?.spending.total.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Total amount spent on confirmed, in-transit, and delivered orders
          </p>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {orderStats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                    <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: COLORS.primary }} />
              Recent Orders
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/buyer/orders')}
              className="flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => {
                const farmer = typeof order.farmerId === 'object' ? order.farmerId : null;

                return (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/buyer/orders/${order._id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">Order #{order.orderId}</p>
                          <p className="text-sm text-gray-600">
                            Farmer: {farmer?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
                        ৳{order.totalAmount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'in-transit'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/buyer/marketplace')}
                style={{ backgroundColor: COLORS.primary }}
              >
                Start Shopping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/buyer/marketplace')}
            >
              <ShoppingCart className="h-6 w-6" style={{ color: COLORS.primary }} />
              <span>Browse Products</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/buyer/orders')}
            >
              <Package className="h-6 w-6" style={{ color: COLORS.primary }} />
              <span>My Orders</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/profile')}
            >
              <TrendingUp className="h-6 w-6" style={{ color: COLORS.primary }} />
              <span>My Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
