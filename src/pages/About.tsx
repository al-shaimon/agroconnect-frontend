import { Card, CardContent } from "../components/ui/card";
import { COLORS } from "../constants/theme";
import {
  Target,
  Eye,
  Award,
  Leaf,
  Users,
  TrendingUp,
  Shield,
  Heart,
  CheckCircle,
  Sprout,
  Globe,
  Zap,
} from "lucide-react";

export default function About() {
  const stats = [
    { value: "5,000+", label: "Farmers", sublabel: "Empowered nationwide" },
    { value: "15,000+", label: "Buyers", sublabel: "Satisfied customers" },
    { value: "50,000+", label: "Orders", sublabel: "Successfully delivered" },
    { value: "64", label: "Districts", sublabel: "Across Bangladesh" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description:
        "Open pricing, clear terms, and honest communication in every transaction.",
    },
    {
      icon: Heart,
      title: "Fairness",
      description:
        "Equal opportunities for farmers and reasonable prices for buyers.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "Supporting eco-friendly farming practices and reducing environmental impact.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building strong relationships between farmers, buyers, and local communities.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description:
        "Helping farmers expand their business and buyers access better products.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Using technology to modernize agriculture and streamline trade.",
    },
  ];

  const achievements = [
    { text: "Winner of National AgriTech Innovation Award 2024" },
    { text: "Recognized by Bangladesh Agricultural Ministry" },
    { text: "Featured in Top 10 StartUp Bangladesh 2024" },
    { text: "ISO 9001:2015 Quality Management Certified" },
    { text: "Partnership with 200+ Farmer Cooperatives" },
    { text: "98% Customer Satisfaction Rate" },
  ];

  const team = [
    {
      role: "Leadership",
      description:
        "Experienced team with 20+ years in agriculture and technology",
    },
    {
      role: "Technology",
      description:
        "Expert developers ensuring platform security and reliability",
    },
    {
      role: "Support",
      description:
        "24/7 customer service team ready to help farmers and buyers",
    },
    {
      role: "Quality",
      description: "Dedicated quality assurance team verifying every product",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-green-50">
            <Sprout className="h-12 w-12" style={{ color: COLORS.primary }} />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: COLORS.primary }}
          >
            About AgroConnect
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing Bangladesh's agricultural commerce by creating
            direct connections between farmers and buyers, eliminating
            middlemen, and ensuring fair prices for all.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative">
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white text-lg font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-white/80 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            Our Story
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: COLORS.primary }}
          ></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <Globe
                    className="h-6 w-6"
                    style={{ color: COLORS.primary }}
                  />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  The Beginning
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                AgroConnect was born from a simple observation: farmers were
                selling their produce at unfairly low prices while buyers were
                paying high prices due to multiple middlemen. We saw an
                opportunity to bridge this gap using technology.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2023, we started with just 50 farmers in Dhaka
                division. Today, we've grown to become Bangladesh's leading
                farm-to-table marketplace, serving thousands across the nation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <TrendingUp
                    className="h-6 w-6"
                    style={{ color: COLORS.primary }}
                  />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  Our Impact
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Through our platform, farmers have seen an average income
                increase of 40% by eliminating middlemen. Buyers enjoy 25% lower
                prices while getting fresher produce delivered directly from
                farms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We've facilitated over ৳500 crore in transactions, supporting
                rural economies and ensuring urban populations have access to
                quality, fresh agricultural products.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            className="hover:shadow-xl transition-all hover:-translate-y-2 border-t-4"
            style={{ borderTopColor: COLORS.primary }}
          >
            <CardContent className="p-8 space-y-4 text-center">
              <div
                className="p-4 rounded-full w-fit mx-auto"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Target
                  className="h-10 w-10"
                  style={{ color: COLORS.primary }}
                />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To empower farmers with fair market access and provide buyers
                with direct access to quality agricultural products, fostering a
                sustainable and equitable food supply chain that benefits all
                stakeholders.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition-all hover:-translate-y-2 border-t-4"
            style={{ borderTopColor: COLORS.primary }}
          >
            <CardContent className="p-8 space-y-4 text-center">
              <div
                className="p-4 rounded-full w-fit mx-auto"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Eye className="h-10 w-10" style={{ color: COLORS.primary }} />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become South Asia's leading platform for agricultural
                commerce, creating a transparent ecosystem where farmers thrive,
                buyers get quality products, and communities prosper together.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition-all hover:-translate-y-2 border-t-4"
            style={{ borderTopColor: COLORS.primary }}
          >
            <CardContent className="p-8 space-y-4 text-center">
              <div
                className="p-4 rounded-full w-fit mx-auto"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Award
                  className="h-10 w-10"
                  style={{ color: COLORS.primary }}
                />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                Our Promise
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Quality products, fair prices, timely delivery, and exceptional
                service. We stand behind every transaction with our 100%
                satisfaction guarantee and dedicated support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            Our Core Values
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These principles guide every decision we make and every action we
            take
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-white"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${COLORS.primary}20` }}
                  >
                    <value.icon
                      className="h-6 w-6"
                      style={{ color: COLORS.primary }}
                    />
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            Recognition & Achievements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="h-5 w-5 flex-shrink-0 mt-0.5"
                    style={{ color: COLORS.primary }}
                  />
                  <p className="text-gray-700 leading-relaxed">
                    {achievement.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals working tirelessly to serve farmers and
            buyers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow text-center"
            >
              <CardContent className="p-6 space-y-3">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <Users
                    className="h-8 w-8"
                    style={{ color: COLORS.primary }}
                  />
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {member.role}
                </h3>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="rounded-2xl p-8 md:p-12 text-center text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Want to Know More?
        </h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have questions, feedback, or
          partnership opportunities, our team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-left">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-1">📧 Email Us</p>
            <p className="text-white/90">support@agroconnect.com</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-1">📞 Call Us</p>
            <p className="text-white/90">+880 1234-567890</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-1">📍 Visit Us</p>
            <p className="text-white/90">Chittagong, Bangladesh</p>
          </div>
        </div>
      </section>
    </div>
  );
}
