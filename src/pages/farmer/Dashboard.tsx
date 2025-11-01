import { useEffect, useState } from 'react';
import { farmerService } from '../../services/farmerService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { COLORS } from '../../constants/theme';
import { Package, ShoppingBag, DollarSign, Clock, XCircle } from 'lucide-react';
import type { FarmerStats } from '../../types';
import { RevenueChart } from '../../components/farmer/RevenueChart';

export const FarmerDashboard = () => {
  const [stats, setStats] = useState<FarmerStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await farmerService.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.products.total || 0,
      icon: Package,
      color: COLORS.primary,
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      icon: ShoppingBag,
      color: '#3b82f6',
    },
    {
      title: 'Pending Orders',
      value: stats?.orders.pending || 0,
      icon: Clock,
      color: '#f59e0b',
    },
    {
      title: 'Cancelled Orders',
      value: stats?.orders.cancelled || 0,
      icon: XCircle,
      color: '#ef4444',
    },
    {
      title: 'Total Revenue',
      value: `৳${stats?.revenue.total || 0}`,
      icon: DollarSign,
      color: COLORS.success,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RevenueChart />
    </div>
  );
};
