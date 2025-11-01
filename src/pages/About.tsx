import { Card, CardContent } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import { Target, Eye, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: COLORS.primary }}>
          About AgroConnect
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionizing agricultural commerce by connecting farmers directly with buyers
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed">
            AgroConnect was founded with a simple yet powerful vision: to create a direct bridge
            between farmers and buyers, eliminating unnecessary middlemen and ensuring fair prices
            for everyone. We believe that farmers deserve better compensation for their hard work,
            and buyers deserve access to fresh, quality products at competitive prices.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform leverages modern technology to make agricultural trade more efficient,
            transparent, and beneficial for all parties involved. From small-scale farmers to large
            buyers, AgroConnect serves as a marketplace where quality meets opportunity.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 space-y-4 text-center">
            <div
              className="p-3 rounded-full w-fit mx-auto"
              style={{ backgroundColor: `${COLORS.primary}20` }}
            >
              <Target className="h-8 w-8" style={{ color: COLORS.primary }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
              Our Mission
            </h3>
            <p className="text-gray-600">
              To empower farmers and provide buyers with direct access to quality agricultural
              products, fostering a sustainable and equitable food supply chain.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4 text-center">
            <div
              className="p-3 rounded-full w-fit mx-auto"
              style={{ backgroundColor: `${COLORS.primary}20` }}
            >
              <Eye className="h-8 w-8" style={{ color: COLORS.primary }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
              Our Vision
            </h3>
            <p className="text-gray-600">
              To become the leading platform for agricultural commerce, creating a transparent
              ecosystem that benefits farmers, buyers, and communities alike.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4 text-center">
            <div
              className="p-3 rounded-full w-fit mx-auto"
              style={{ backgroundColor: `${COLORS.primary}20` }}
            >
              <Award className="h-8 w-8" style={{ color: COLORS.primary }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
              Our Values
            </h3>
            <p className="text-gray-600">
              Transparency, fairness, sustainability, and community empowerment are at the core of
              everything we do at AgroConnect.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
