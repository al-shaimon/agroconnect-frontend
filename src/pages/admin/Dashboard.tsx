import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { COLORS } from '../../constants/theme';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import type { AdminStats } from '../../types';
import {
  Users,
  FileCheck,
  ShoppingCart,
  Bell,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load dashboard data</p>
        <Button onClick={fetchStats} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/users')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.users.total}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats.users.active} active
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/verifications')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unverified Users</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.users.total - stats.users.verified}
                </p>
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.users.verified} verified
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/orders')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.orders.total}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {stats.orders.delivered} delivered
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">৳{stats.revenue.total.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stats.orders.confirmed + stats.orders.inTransit + stats.orders.delivered} paid
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/admin/verifications')}
              style={{ backgroundColor: COLORS.primary }}
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <FileCheck className="h-6 w-6" />
              <span>Review Verifications</span>
            </Button>
            <Button
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              onClick={() => navigate('/admin/orders')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <ShoppingCart className="h-6 w-6" />
              <span>View Orders</span>
            </Button>
            <Button
              onClick={() => navigate('/admin/broadcast')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Bell className="h-6 w-6" />
              <span>Send Broadcast</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/users')}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full ${
                          user.role === 'farmer' ? 'bg-green-100' : 'bg-blue-100'
                        } flex items-center justify-center`}
                      >
                        <span className="text-lg font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {user.isVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent users</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Farmers</span>
                <span className="font-semibold">{stats.users.farmers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.users.total > 0 ? (stats.users.farmers / stats.users.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Buyers</span>
                <span className="font-semibold">{stats.users.buyers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.users.total > 0 ? (stats.users.buyers / stats.users.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Verified Users</span>
                <span className="font-semibold text-green-600">
                  {stats.users.verified} / {stats.users.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.users.total > 0 ? (stats.users.verified / stats.users.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Products</span>
                  <span className="font-semibold">{stats.products.total}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Available</span>
                  <span>{stats.products.available}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Pending</p>
                    <p className="text-lg font-semibold text-yellow-600">{stats.orders.pending}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">In Transit</p>
                    <p className="text-lg font-semibold text-blue-600">{stats.orders.inTransit}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
