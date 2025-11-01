import { useEffect, useState } from 'react';
import { farmerService } from '../../services/farmerService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { COLORS } from '../../constants/theme';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import type { FarmerStats } from '../../types';
import { ProductList } from '../../components/farmer/ProductList';
import { OrderNotifications } from '../../components/farmer/OrderNotifications';

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
      icon: TrendingUp,
      color: '#f59e0b',
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
      <div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Farmer Dashboard
        </h1>
        <p className="text-gray-600">Manage your products and orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <OrderNotifications />
        <div>
          <ProductList />
        </div>
      </div>
    </div>
  );
};
