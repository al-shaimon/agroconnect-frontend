import { Card, CardContent } from '../../components/ui/card';
import { COLORS } from '../../constants/theme';
import { Truck, Package, BarChart, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SupplyChain() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Truck,
      title: 'End-to-End Logistics',
      description:
        'Comprehensive logistics management from farm gate to end consumer. Track every step of the journey.',
    },
    {
      icon: Package,
      title: 'Quality Control',
      description:
        'Rigorous quality checks at every stage ensure only the best produce reaches buyers.',
    },
    {
      icon: BarChart,
      title: 'Data-Driven Insights',
      description:
        'Real-time analytics and reporting help optimize supply chain efficiency and reduce waste.',
    },
    {
      icon: CheckCircle,
      title: 'Traceability',
      description:
        'Complete transparency from farm to table. Know the origin and journey of every product.',
    },
    {
      icon: Users,
      title: 'Stakeholder Coordination',
      description: 'Seamless coordination between farmers, distributors, retailers, and consumers.',
    },
    {
      icon: TrendingUp,
      title: 'Reduced Wastage',
      description:
        'Efficient processes and demand forecasting minimize post-harvest losses and maximize value.',
    },
  ];

  const benefits = [
    'Reduce post-harvest losses by up to 40%',
    'Improve delivery times with optimized routing',
    'Increase profit margins for all stakeholders',
    'Ensure food safety and quality standards',
    'Enable demand-driven production planning',
    'Provide transparent pricing mechanisms',
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            SOLVING INEFFICIENCIES IN THE AGRI SUPPLY CHAIN
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">From Farm to market everyday</p>
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-6">
        <div className="text-center max-w-5xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            AgroConnect is building the largest demand-driven, organized and tech-enabled supply
            chain of fresh agriculture produce. We connect farmers directly with buyers by taking
            complete control of the supply chain.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform eliminates inefficiencies, reduces waste, and ensures that quality produce
            reaches consumers while farmers receive fair compensation for their work.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center" style={{ color: COLORS.primary }}>
          Our Supply Chain Solutions
        </h2>

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

      {/* The Process */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: COLORS.primary }}>
          How Our Supply Chain Works
        </h2>
        <div className="grid gap-8 md:grid-cols-5">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Harvest</h3>
            <p className="text-gray-600 text-sm">Farmers harvest at optimal maturity</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Collection</h3>
            <p className="text-gray-600 text-sm">Efficient collection from farm gates</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality Check</h3>
            <p className="text-gray-600 text-sm">Rigorous quality and safety testing</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              4
            </div>
            <h3 className="font-semibold text-lg mb-2">Distribution</h3>
            <p className="text-gray-600 text-sm">Optimized routing to buyers</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              5
            </div>
            <h3 className="font-semibold text-lg mb-2">Delivery</h3>
            <p className="text-gray-600 text-sm">Fresh produce at destination</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center" style={{ color: COLORS.primary }}>
          Key Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle
                className="h-6 w-6 mt-1 flex-shrink-0"
                style={{ color: COLORS.primary }}
              />
              <p className="text-gray-700 text-lg">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="rounded-2xl p-8 md:p-12 text-center text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h2 className="text-3xl font-bold mb-4">Transform Your Agricultural Supply Chain</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Partner with us to build an efficient, transparent, and sustainable supply chain for
          agricultural products.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/register')}
          className="bg-white hover:bg-gray-100 text-lg px-8"
          style={{ color: COLORS.primary }}
        >
          Get Started
        </Button>
      </section>
    </div>
  );
}
