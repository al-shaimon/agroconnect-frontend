import { useEffect, useState } from 'react';
import { farmerService } from '../../services/farmerService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COLORS } from '../../constants/theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RevenueData {
  _id: string;
  productName: string;
  totalRevenue: number;
  totalQuantity: number;
}

export const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<string>('30');

  const fetchRevenueData = async (days: number) => {
    try {
      setIsLoading(true);
      const response = await farmerService.getRevenueAnalytics(days);
      if (response.success && response.data) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue analytics', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData(parseInt(period));
  }, [period]);

  const chartData = revenueData.map((item) => ({
    name:
      item.productName.length > 15 ? item.productName.substring(0, 15) + '...' : item.productName,
    revenue: item.totalRevenue,
    quantity: item.totalQuantity,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: COLORS.primary }}>Revenue & Quantity Analytics</CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading chart data...</div>
        ) : revenueData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No data available for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Revenue (৳)', angle: -90, position: 'insideLeft' }}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Quantity', angle: 90, position: 'insideRight' }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'Revenue') return [`৳${value.toLocaleString()}`, name];
                  return [value.toLocaleString(), name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Revenue"
                dot={{ fill: COLORS.primary }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quantity"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Quantity Sold"
                dot={{ fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
