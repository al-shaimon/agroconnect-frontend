import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { COLORS } from '../../constants/theme';
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
  const [stats] = useState({
    totalUsers: 156,
    pendingVerifications: 12,
    totalOrders: 89,
    activeUsers: 142,
  });

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
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
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
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingVerifications}</p>
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Requires attention
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
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  78 completed
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
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  91% activity rate
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
            <CardTitle>Recent Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div>
                    <p className="font-medium">John Farmer</p>
                    <p className="text-sm text-gray-600">Pending verification</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/verifications')}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Buyer</p>
                    <p className="text-sm text-gray-600">Pending verification</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/verifications')}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Review
                </Button>
              </div>
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
                <span className="font-semibold">68</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '44%' }}></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Buyers</span>
                <span className="font-semibold">88</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '56%' }}></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Verified Users</span>
                <span className="font-semibold text-green-600">142 / 156</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
