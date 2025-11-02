import { Card, CardContent } from "../../components/ui/card";
import { COLORS } from "../../constants/theme";
import { ShoppingBag, Leaf, Heart, Shield, Clock, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ForConsumers() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && user?.role === "buyer") {
      navigate("/buyer/marketplace");
    } else if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/register");
    }
  };

  const handleCategoryClick = () => {
    if (isAuthenticated && user?.role === "buyer") {
      navigate("/buyer/marketplace");
    } else if (isAuthenticated) {
      // If logged in but not a buyer, redirect to home
      navigate("/");
    } else {
      // Not logged in, redirect to login
      navigate("/login");
    }
  };

  const benefits = [
    {
      icon: Leaf,
      title: "Fresh & Organic",
      description:
        "Get farm-fresh produce delivered to your doorstep. No chemicals, no preservatives, just natural goodness.",
    },
    {
      icon: Heart,
      title: "Support Local Farmers",
      description:
        "Every purchase directly supports local farmers and their families. Help build sustainable farming communities.",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "All products are verified and meet quality standards. Get what you pay for, every single time.",
    },
    {
      icon: Clock,
      title: "Convenient Ordering",
      description:
        "Browse products, place orders, and track deliveries all from your phone or computer.",
    },
    {
      icon: MapPin,
      title: "Know Your Source",
      description:
        "See exactly where your food comes from. Meet the farmers growing your vegetables and fruits.",
    },
    {
      icon: ShoppingBag,
      title: "Fair Prices",
      description:
        "No middlemen means better prices for you and better income for farmers. Everyone wins.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            FRESH FROM FARM TO TABLE
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Buy directly from local farmers and enjoy the freshest, healthiest
            produce
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8"
          >
            Start Shopping
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            Why Choose AgroConnect?
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg">
            We connect you directly with farmers, eliminating middlemen and
            ensuring you get the freshest produce at fair prices while
            supporting sustainable agriculture and local communities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div
                  className="p-3 rounded-full w-fit"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <benefit.icon
                    className="h-8 w-8"
                    style={{ color: COLORS.primary }}
                  />
                </div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: COLORS.primary }}
        >
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              1
            </div>
            <h3 className="font-semibold text-xl mb-3">Browse Products</h3>
            <p className="text-gray-600">
              Explore our marketplace filled with fresh produce from local
              farmers.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              2
            </div>
            <h3 className="font-semibold text-xl mb-3">Add to Cart</h3>
            <p className="text-gray-600">
              Select the products you want and add them to your shopping cart.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              3
            </div>
            <h3 className="font-semibold text-xl mb-3">Place Order</h3>
            <p className="text-gray-600">
              Complete your purchase securely and choose your delivery
              preferences.
            </p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
              style={{ backgroundColor: COLORS.primary }}
            >
              4
            </div>
            <h3 className="font-semibold text-xl mb-3">Enjoy Fresh Produce</h3>
            <p className="text-gray-600">
              Receive your order and enjoy farm-fresh quality at home.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="space-y-8">
        <h2
          className="text-3xl font-bold text-center"
          style={{ color: COLORS.primary }}
        >
          What You Can Find
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            "Fresh Vegetables",
            "Seasonal Fruits",
            "Dairy Products",
            "Organic Grains",
          ].map((category, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleCategoryClick}
            >
              <CardContent className="p-6 text-center">
                <Leaf
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: COLORS.primary }}
                />
                <h3 className="font-semibold text-lg">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="rounded-2xl p-8 md:p-12 text-center text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h2 className="text-3xl font-bold mb-4">
          Start Your Healthy Journey Today
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of families enjoying fresh, locally-sourced produce
          delivered to their doorstep.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-white hover:bg-gray-100 text-lg px-8"
          style={{ color: COLORS.primary }}
        >
          Explore Marketplace
        </Button>
      </section>
    </div>
  );
}
