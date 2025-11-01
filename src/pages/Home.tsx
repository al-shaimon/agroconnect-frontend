import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import { Sprout, Users, ShoppingBag, TrendingUp, Leaf, Heart } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'farmer') navigate('/farmer/dashboard');
      else if (user?.role === 'buyer') navigate('/buyer/marketplace');
      else if (user?.role === 'admin') navigate('/admin/panel');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: Sprout,
      title: 'Direct from Farmers',
      description: 'Get fresh products directly from local farmers without middlemen',
    },
    {
      icon: ShoppingBag,
      title: 'Easy Shopping',
      description: 'Browse and order agricultural products with just a few clicks',
    },
    {
      icon: TrendingUp,
      title: 'Fair Prices',
      description: 'Farmers get better prices, buyers get competitive rates',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect local farmers with buyers in your community',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full" style={{ backgroundColor: `${COLORS.primary}20` }}>
            <Leaf className="h-16 w-16" style={{ color: COLORS.primary }} />
          </div>
        </div>
        <h1 className="text-5xl font-bold" style={{ color: COLORS.primary }}>
          Welcome to AgroConnect
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connecting farmers directly with buyers for fresh, quality agricultural products. Building
          a sustainable future for agriculture.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={handleGetStarted}
            style={{ backgroundColor: COLORS.primary }}
            className="text-lg px-8"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/about')}
            className="text-lg px-8"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center" style={{ color: COLORS.primary }}>
          Why Choose AgroConnect?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div
                  className="p-3 rounded-full w-fit"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <feature.icon className="h-8 w-8" style={{ color: COLORS.primary }} />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-12 text-center space-y-6">
        <Heart className="h-12 w-12 mx-auto" style={{ color: COLORS.primary }} />
        <h2 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Join Our Growing Community
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Whether you're a farmer looking to sell your products or a buyer seeking fresh produce,
          AgroConnect is your platform for direct agricultural trade.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/register')}
          style={{ backgroundColor: COLORS.primary }}
        >
          Register Now
        </Button>
      </section>
    </div>
  );
}
