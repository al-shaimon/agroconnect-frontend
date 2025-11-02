import { useState, useEffect } from 'react';
import { driverService } from '../../services/driverService';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { COLORS } from '../../constants/theme';
import { Package, TrendingUp, Star, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const DriverDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<{
    completedDeliveries: number;
    rating: number;
    totalRatings: number;
    totalEarnings: number;
    activeOrders: number;
    todayDeliveries: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await driverService.getStats();
      setStats(response.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      setUpdatingAvailability(true);
      const newStatus = !isAvailable;
      const response = await driverService.updateAvailability(newStatus);
      setIsAvailable(newStatus);
      toast.success(response.message);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (!user?.isVerified || user?.verificationStatus !== 'approved') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
            <p className="text-gray-600 mb-4">
              Your account is currently under verification. You will be able to access the dashboard
              once your documents are approved by our admin team.
            </p>
            <Badge className="bg-yellow-100 text-yellow-800">
              Status: {user?.verificationStatus || 'Pending'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}!{' '}
            {user?.driverType && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 capitalize">{user.driverType}</Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={`${
              isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
          <Button
            onClick={handleAvailabilityToggle}
            disabled={updatingAvailability}
            style={{ backgroundColor: isAvailable ? '#6B7280' : COLORS.primary }}
            className="text-white"
          >
            {updatingAvailability ? 'Updating...' : isAvailable ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">{stats?.completedDeliveries || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Deliveries</p>
                <p className="text-2xl font-bold">{stats?.todayDeliveries || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">{stats?.activeOrders || 0}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {stats?.rating?.toFixed(1) || '0.0'}
                  <Star className="h-5 w-5 text-yellow-500" />
                </p>
                <p className="text-xs text-gray-500">({stats?.totalRatings || 0} ratings)</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">৳{stats?.totalEarnings || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="text-lg font-semibold capitalize">
                  {user?.vehicleInfo?.vehicleType || 'N/A'}
                </p>
                {user?.vehicleInfo?.hasFreezer && (
                  <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">
                    Freezer Available
                  </Badge>
                )}
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => (window.location.href = '/driver/available-orders')}
              style={{ backgroundColor: COLORS.primary }}
              className="text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              View Available Orders
            </Button>
            <Button onClick={() => (window.location.href = '/driver/my-orders')} variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              My Deliveries
            </Button>
            <Button onClick={() => (window.location.href = '/driver/profile')} variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
