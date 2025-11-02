import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { COLORS } from '../../constants/theme';
import { Truck, Package, CheckCircle, Clock, User } from 'lucide-react';

export const DriverDashboard = () => {
  const { user } = useAuth();

  // Type assertion for driver-specific fields
  const driverUser = user as typeof user & {
    completedDeliveries?: number;
    rating?: number;
    totalRatings?: number;
    driverType?: 'professional' | 'volunteer';
    vehicleInfo?: {
      vehicleType?: string;
      vehicleModel?: string;
      vehicleNumber?: string;
      hasFreezer?: boolean;
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            Driver Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {driverUser?.name}!</p>
        </div>
        <Truck className="h-12 w-12" style={{ color: COLORS.primary }} />
      </div>

      {/* Verification Status Alert */}
      {driverUser?.verificationStatus === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">Verification Pending</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Your account is currently under review. You'll be notified once your documents are
                  verified and you can start accepting deliveries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {driverUser?.verificationStatus === 'rejected' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Verification Rejected</h3>
                <p className="text-sm text-red-800 mt-1">
                  {driverUser?.rejectionReason ||
                    'Your documents were rejected. Please contact support.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {driverUser?.verificationStatus === 'approved' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Verified Driver</h3>
                <p className="text-sm text-green-800 mt-1">
                  Your account is verified. You can now accept delivery orders!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverUser?.completedDeliveries || 0}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverUser?.rating?.toFixed(1) || '0.0'}</div>
            <p className="text-xs text-muted-foreground">
              {driverUser?.totalRatings || 0} total ratings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver Type</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {driverUser?.driverType || 'Not Set'}
            </div>
            <p className="text-xs text-muted-foreground">
              {driverUser?.driverType === 'volunteer' ? 'Community Helper' : 'Professional Driver'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Info */}
      {driverUser?.vehicleInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="font-semibold capitalize">{driverUser.vehicleInfo.vehicleType}</p>
              </div>
              {driverUser.vehicleInfo.vehicleModel && (
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold">{driverUser.vehicleInfo.vehicleModel}</p>
                </div>
              )}
              {driverUser.vehicleInfo.vehicleNumber && (
                <div>
                  <p className="text-sm text-gray-600">Vehicle Number</p>
                  <p className="font-semibold">{driverUser.vehicleInfo.vehicleNumber}</p>
                </div>
              )}
              {driverUser.vehicleInfo.hasFreezer && (
                <div>
                  <p className="text-sm text-gray-600">Special Features</p>
                  <p className="font-semibold text-green-600">Freezer Van Available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-600">
            <p>• View available delivery orders</p>
            <p>• Accept and manage deliveries</p>
            <p>• Track your delivery history</p>
            <p>• Update your availability status</p>
            <p>• View earnings and statistics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
