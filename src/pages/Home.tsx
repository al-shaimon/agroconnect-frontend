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
    <div className="space-y-16">
      {/* Hero Section with Video Background */}
      <section className="relative rounded-2xl overflow-hidden min-h-[600px] flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/bannerVideo.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 py-12 px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <Leaf className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">Welcome to AgroConnect</h1>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
            Connecting farmers directly with buyers for fresh, quality agricultural products.
            Building a sustainable future for agriculture.
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
              className="text-lg px-8 bg-white/90 hover:bg-white"
            >
              Learn More
            </Button>
          </div>
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

      {/* Testimonials Section */}
      <section
        className="relative rounded-2xl p-12 md:p-16 text-white overflow-hidden"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <Quote className="h-16 w-16 text-white/30" />
          </div>

          {/* Testimonial Content */}
          <div className="text-center space-y-6 min-h-[250px] flex flex-col justify-center">
            <p className="text-xl md:text-2xl leading-relaxed">
              {testimonials[currentTestimonial].quote}
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold">{testimonials[currentTestimonial].author}</p>
              <p className="text-white/80">{testimonials[currentTestimonial].role}</p>
            </div>

            {/* Avatar Indicators */}
            <div className="flex justify-center gap-3 mt-6">
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
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
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
