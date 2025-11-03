import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import {
  Sprout,
  Users,
  ShoppingBag,
  TrendingUp,
  Leaf,
  Heart,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'farmer') navigate('/farmer/dashboard');
      else if (user?.role === 'buyer') navigate('/buyer/marketplace');
      else if (user?.role === 'admin') navigate('/admin/panel');
    } else {
      navigate('/register');
    }
  };

  const testimonials = [
    {
      quote:
        'AgroConnect is the reason behind my development. AgroConnect is providing us with many facilities related to agricultural work and farming. All credit goes to AgroConnect.',
      author: 'Mst Rokhsana Rony',
      role: 'Livestock Farmer',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    },
    {
      quote:
        'The direct market access has transformed my farm business. I can now sell my produce at fair prices without middlemen taking their cut. My income has increased significantly.',
      author: 'Abdul Karim',
      role: 'Rice Farmer',
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop',
    },
    {
      quote:
        'As a buyer, I love getting fresh vegetables directly from local farmers. The quality is outstanding and I know exactly where my food comes from. Highly recommended!',
      author: 'Sarah Ahmed',
      role: 'Restaurant Owner',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      quote:
        'AgroConnect has made it so easy to manage my orders and reach customers across the region. The platform is simple to use and the support team is always helpful.',
      author: 'Habibur Rahman',
      role: 'Vegetable Farmer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
    <div className="space-y-8 md:space-y-16">
      {/* Hero Section with Video Background */}
      <section className="relative rounded-lg md:rounded-2xl overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/thumbnail.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={(e) => {
            const video = e.currentTarget;
            video.play().catch((err) => console.log('Video autoplay failed:', err));
          }}
        >
          <source src="/bannerVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-4 md:space-y-6 py-8 md:py-12 px-3 md:px-4">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <Leaf className="h-12 w-12 md:h-16 md:w-16 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Welcome to AgroConnect
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto drop-shadow-md">
            Connecting farmers directly with buyers for fresh, quality agricultural products.
            Building a sustainable future for agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              style={{ backgroundColor: COLORS.primary }}
              className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="text-base md:text-lg px-6 md:px-8 bg-white/90 hover:bg-white w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6 md:space-y-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-center"
          style={{ color: COLORS.primary }}
        >
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

      {/* Testimonials Section */}
      <section
        className="relative rounded-lg md:rounded-2xl p-4 md:p-12 lg:p-16 text-white overflow-hidden"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="flex justify-center mb-6 md:mb-8">
            <Quote className="h-12 w-12 md:h-16 md:w-16 text-white/30" />
          </div>

          {/* Testimonial Content */}
          <div className="text-center space-y-4 md:space-y-6 min-h-[200px] md:min-h-[250px] flex flex-col justify-center">
            <p className="text-base md:text-xl lg:text-2xl leading-relaxed">
              {testimonials[currentTestimonial].quote}
            </p>
            <div className="space-y-2">
              <p className="text-base md:text-lg font-semibold">
                {testimonials[currentTestimonial].author}
              </p>
              <p className="text-sm md:text-base text-white/80">
                {testimonials[currentTestimonial].role}
              </p>
            </div>

            {/* Avatar Indicators */}
            <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-6">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-green-600'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </section>

      {/* Call to Action - Enhanced Community Section */}
      <section className="relative overflow-hidden rounded-lg md:rounded-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50"></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Content */}
        <div className="relative p-4 md:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center p-2 md:p-3 mb-4 md:mb-6 rounded-full bg-white shadow-lg">
                <Heart className="h-8 w-8 md:h-10 md:w-10" style={{ color: COLORS.primary }} />
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
                style={{ color: COLORS.primary }}
              >
                Join Our Growing Community
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Be part of Bangladesh's largest direct farm-to-table marketplace. Connect, trade,
                and grow together.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-8 md:mb-12">
              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                <div
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                  style={{ color: COLORS.primary }}
                >
                  5,000+
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Active Farmers</div>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Growing daily</div>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                <div
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                  style={{ color: COLORS.primary }}
                >
                  15,000+
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">Happy Buyers</div>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                  Satisfied customers
                </div>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                <div
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                  style={{ color: COLORS.primary }}
                >
                  50,000+
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  Orders Delivered
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                  On-time delivery
                </div>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-md hover:shadow-xl transition-shadow text-center">
                <div
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                  style={{ color: COLORS.primary }}
                >
                  64
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  Districts Covered
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                  Nationwide reach
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-12">
              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3 md:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.primary}20` }}
                  >
                    <Sprout className="h-5 w-5 md:h-6 md:w-6" style={{ color: COLORS.primary }} />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base md:text-lg mb-2"
                      style={{ color: COLORS.primary }}
                    >
                      For Farmers
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-600">
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Sell directly at better prices
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Reach thousands of buyers instantly
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Free training and quality support
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Fast payment within 24 hours
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3 md:gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.primary}20` }}
                  >
                    <ShoppingBag
                      className="h-5 w-5 md:h-6 md:w-6"
                      style={{ color: COLORS.primary }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base md:text-lg mb-2"
                      style={{ color: COLORS.primary }}
                    >
                      For Buyers
                    </h3>
                    <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-600">
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        100% fresh, farm-direct produce
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Competitive prices, no middlemen
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Doorstep delivery in 24-48 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.primary }}
                        ></div>
                        Quality guaranteed or money back
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  style={{ backgroundColor: COLORS.primary }}
                  className="text-base md:text-lg px-6 md:px-10 py-5 md:py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  Start Your Journey Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="text-base md:text-lg px-6 md:px-10 py-5 md:py-6 border-2 hover:bg-gray-50 w-full sm:w-auto"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                >
                  Learn How It Works
                </Button>
              </div>
              <p className="text-xs md:text-sm text-gray-500">
                🎉 Special Offer: First 100 new farmers get ৳500 bonus credit!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
