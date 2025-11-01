import { Card, CardContent } from '../../components/ui/card';
import { COLORS } from '../../constants/theme';
import { Sprout, TrendingUp, Wallet, Users, Globe, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ForFarmers() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && user?.role === 'farmer') {
      navigate('/farmer/dashboard');
    } else if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: Wallet,
      title: 'Direct Market Access',
      description:
        'Sell your products directly to buyers and restaurants without middlemen. Keep more of your hard-earned profits.',
    },
    {
      icon: TrendingUp,
      title: 'Better Prices',
      description:
        'Get fair market prices for your produce. Our platform ensures transparency and competitive rates for your crops.',
    },
    {
      icon: Globe,
      title: 'Wider Reach',
      description:
        'Connect with buyers across regions. Expand your customer base beyond your local market.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description:
        'Join a network of farmers sharing best practices, tips, and supporting each other through challenges.',
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      description:
        'Access real-time market data, demand trends, and price forecasts to make informed planting decisions.',
    },
    {
      icon: Sprout,
      title: 'Easy Product Listing',
      description:
        'List your products in minutes with our simple interface. Update prices and availability anytime.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-500 opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        ></div>
        <div className="relative px-8 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">HELPING FARMERS WIN</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Combining finance, technology and direct market access
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* What We Offer */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
            What We Offer
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg">
            In everything we do, we put the farmers at the center of our work. Our aim is to
            increase farmers' income and improve their livelihood by providing bundled services of
            finance, access to inputs, timely advisory and access to the right markets through our
            platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      {/* How It Works */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: COLORS.primary }}>
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              1
            </div>
            <h3 className="font-semibold text-xl mb-3">Register Your Farm</h3>
            <p className="text-gray-600">
              Sign up and create your farmer profile. Add details about your farm and the crops you
              grow.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              2
            </div>
            <h3 className="font-semibold text-xl mb-3">List Your Products</h3>
            <p className="text-gray-600">
              Upload photos and details of your products. Set your prices and available quantities.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              3
            </div>
            <h3 className="font-semibold text-xl mb-3">Receive Orders</h3>
            <p className="text-gray-600">
              Get notified when buyers place orders. Coordinate delivery and receive payment
              securely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="rounded-2xl p-8 md:p-12 text-center text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm Business?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of farmers who are already benefiting from direct market access and fair
          prices.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-white hover:bg-gray-100 text-lg px-8"
          style={{ color: COLORS.primary }}
        >
          Join AgroConnect Today
        </Button>
      </section>
    </div>
  );
}
