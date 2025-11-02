import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { COLORS } from '../../constants/theme';
import {
  Leaf,
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  Thermometer,
  Droplets,
  Package,
  Truck,
  XCircle,
  Scale,
} from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';

export const FarmerGuidelines = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Farmer Guidelines & Best Practices
        </h1>
        <p className="text-gray-600">
          Follow these guidelines to ensure quality products and maintain your reputation
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          These guidelines are designed to help you provide the best products to buyers and build
          trust in the AgroConnect marketplace.
        </AlertDescription>
      </Alert>

      {/* Product Quality Standards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Product Quality Standards</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Best Practices
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600">
                • Harvest products at optimal ripeness for the best quality
              </li>
              <li className="text-gray-600">
                • Clean and sort products before listing them for sale
              </li>
              <li className="text-gray-600">
                • Use high-quality, clear photos of your actual products
              </li>
              <li className="text-gray-600">
                • Provide accurate descriptions including variety, grade, and origin
              </li>
              <li className="text-gray-600">
                • Regularly update availability and pricing information
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Prohibited Practices
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600">• Never use misleading photos or descriptions</li>
              <li className="text-gray-600">• Don't mix different quality grades in one batch</li>
              <li className="text-gray-600">
                • Avoid selling products past their optimal freshness
              </li>
              <li className="text-gray-600">• Never apply prohibited pesticides or chemicals</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Storage & Handling */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Storage & Handling</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-600" />
              Temperature Control
            </h3>
            <p className="text-gray-600">• Store perishable items at appropriate temperatures</p>
            <p className="text-gray-600">• Keep vegetables cool and dry</p>
            <p className="text-gray-600">• Maintain cold chain for dairy and meat products</p>
            <p className="text-gray-600">• Protect from direct sunlight and extreme heat</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              Moisture Management
            </h3>
            <p className="text-gray-600">• Ensure proper ventilation to prevent moisture buildup</p>
            <p className="text-gray-600">• Keep grains and pulses in dry, pest-free storage</p>
            <p className="text-gray-600">• Use proper containers to maintain product quality</p>
          </div>
        </CardContent>
      </Card>

      {/* Packaging & Delivery */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Packaging & Delivery</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Packaging Guidelines</h3>
            <p className="text-gray-600">• Use clean, food-grade packaging materials</p>
            <p className="text-gray-600">
              • Pack products securely to prevent damage during transit
            </p>
            <p className="text-gray-600">• Label packages clearly with product details</p>
            <p className="text-gray-600">
              • Include harvest date and handling instructions if needed
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Delivery Standards</h3>
            <p className="text-gray-600">• Prepare orders promptly after confirmation</p>
            <p className="text-gray-600">• Coordinate with assigned drivers for timely pickup</p>
            <p className="text-gray-600">• Ensure products are ready at the scheduled time</p>
            <p className="text-gray-600">• Communicate any delays or issues immediately</p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Measurements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Pricing & Measurements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Fair Pricing</h3>
            <p className="text-gray-600">
              • Set competitive prices based on quality and market rates
            </p>
            <p className="text-gray-600">• Be transparent about any additional charges</p>
            <p className="text-gray-600">• Offer consistent pricing for similar quality</p>
            <p className="text-gray-600">• Update prices regularly to reflect market conditions</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Accurate Measurements</h3>
            <p className="text-gray-600">• Use calibrated scales for weighing</p>
            <p className="text-gray-600">• Provide exact quantities as listed in the product</p>
            <p className="text-gray-600">• Account for reasonable variations in natural products</p>
            <p className="text-gray-600">• Be honest about count and weight</p>
          </div>
        </CardContent>
      </Card>

      {/* Safety & Compliance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-orange-600">Safety & Compliance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Food Safety</h3>
            <p className="text-gray-600">• Follow good agricultural practices (GAP)</p>
            <p className="text-gray-600">• Maintain cleanliness in harvesting and handling areas</p>
            <p className="text-gray-600">
              • Use only approved pesticides with proper waiting periods
            </p>
            <p className="text-gray-600">• Keep records of pesticide and fertilizer use</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Legal Requirements</h3>
            <p className="text-gray-600">• Provide accurate verification documents when required</p>
            <p className="text-gray-600">• Comply with local agricultural regulations</p>
            <p className="text-gray-600">• Pay applicable taxes on sales</p>
            <p className="text-gray-600">
              • Respect organic certification requirements if claiming organic
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Success */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Tips for Success</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Badge className="bg-green-100 text-green-800 mt-1">Tip</Badge>
            <p className="text-gray-600">
              Build a good reputation by consistently delivering quality products on time
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-green-100 text-green-800 mt-1">Tip</Badge>
            <p className="text-gray-600">
              Respond promptly to buyer inquiries and order notifications
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-green-100 text-green-800 mt-1">Tip</Badge>
            <p className="text-gray-600">
              Take professional photos showcasing your products' quality
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-green-100 text-green-800 mt-1">Tip</Badge>
            <p className="text-gray-600">
              Maintain accurate inventory to avoid disappointing buyers
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-green-100 text-green-800 mt-1">Tip</Badge>
            <p className="text-gray-600">
              Learn from buyer feedback to improve your products and service
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert className="bg-red-50 border-red-200">
        <Ban className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Important:</strong> Violation of these guidelines may result in account suspension
          or removal from the platform. Serious violations may be reported to relevant authorities.
        </AlertDescription>
      </Alert>
    </div>
  );
};
