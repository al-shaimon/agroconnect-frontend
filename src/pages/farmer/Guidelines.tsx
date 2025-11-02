import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { COLORS } from "../../constants/theme";
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
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

export const FarmerGuidelines = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Farmer Guidelines & Best Practices
        </h1>
        <p className="text-gray-600">
          Follow these guidelines to ensure quality products and maintain your
          reputation
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Adhering to these guidelines protects your business and ensures
          customer satisfaction. Violations may result in penalties or account
          suspension.
        </AlertDescription>
      </Alert>

      {/* Quality Standards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle
              className="h-6 w-6"
              style={{ color: COLORS.primary }}
            />
            <CardTitle style={{ color: COLORS.primary }}>
              Product Quality Standards
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Freshness Requirements
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>
                <strong>Vegetables & Fruits:</strong> Must be harvested within
                24 hours of listing
              </li>
              <li>
                <strong>Leafy Greens:</strong> Harvested on the same day as
                order confirmation
              </li>
              <li>
                <strong>Root Vegetables:</strong> Can be stored up to 3 days
                with proper care
              </li>
              <li>
                <strong>Grains & Pulses:</strong> Must be properly dried and
                stored (max 6 months old)
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Quality Grades</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: "#10b981" }}>Premium</Badge>
                <p className="text-sm text-gray-600">
                  Perfect appearance, no blemishes, uniform size
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: "#3b82f6" }}>Standard</Badge>
                <p className="text-sm text-gray-600">
                  Good quality, minor imperfections acceptable
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: "#22c55e" }}>Organic</Badge>
                <p className="text-sm text-gray-600">
                  Certified organic, grown without synthetic
                  pesticides/fertilizers
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-3">
              ⚠️ <strong>Important:</strong> You must accurately represent the
              quality grade of your products. Misrepresentation will result in
              penalties.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Produce Care */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              How to Keep Produce Fresh & Clean
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Cleaning & Washing
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Remove all dirt, soil, and debris before listing</li>
              <li>Wash produce with clean, potable water</li>
              <li>
                Do not use chemical cleaners or soap (food-safe cleaning agents
                only if necessary)
              </li>
              <li>Dry thoroughly to prevent bacterial growth</li>
              <li>Remove damaged or diseased portions</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              Storage Temperature Guidelines
            </h3>
            <div className="space-y-2 ml-4">
              <div>
                <p className="font-medium text-gray-700">
                  Cool Storage (10-15°C):
                </p>
                <p className="text-sm text-gray-600">
                  Potatoes, onions, garlic, winter squash
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  Cold Storage (2-8°C):
                </p>
                <p className="text-sm text-gray-600">
                  Leafy greens, berries, broccoli, carrots, most vegetables
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  Room Temperature (18-22°C):
                </p>
                <p className="text-sm text-gray-600">
                  Tomatoes (if unripe), bananas, citrus fruits
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Packaging Best Practices
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Use clean, food-grade packaging materials</li>
              <li>Avoid overpacking that can damage delicate produce</li>
              <li>
                Provide adequate ventilation for items that need air circulation
              </li>
              <li>Use cushioning materials for fragile items</li>
              <li>Label packages clearly with product name and quantity</li>
              <li>Include harvest date on package</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Hygiene Standards</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Always wash hands before handling produce</li>
              <li>Use clean tools and containers</li>
              <li>Keep storage areas clean and pest-free</li>
              <li>Sanitize work surfaces regularly</li>
              <li>Wear clean clothes and hair covering when packing</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Prohibited Practices */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <Ban className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-700">
              Prohibited Practices & Penalties
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2 text-red-700 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Selling Spoiled or Rotten Produce
            </h3>
            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700 font-medium">
                What Constitutes Spoiled Produce:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Visible mold, fungus, or bacterial growth</li>
                <li>Foul or fermented odor</li>
                <li>Slimy or mushy texture</li>
                <li>Excessive bruising, cuts, or decay</li>
                <li>Discoloration indicating spoilage</li>
                <li>Insect infestation or pest damage</li>
              </ul>

              <div className="mt-4 space-y-2">
                <p className="font-medium text-red-700">Penalties:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">1st Offense</Badge>
                    <div>
                      <p className="text-sm text-gray-600">
                        • Written warning + Full refund to customer
                      </p>
                      <p className="text-sm text-gray-600">
                        • ৳1,000 fine + Mandatory retraining
                      </p>
                      <p className="text-sm text-gray-600">
                        • 1-star rating penalty
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">2nd Offense</Badge>
                    <div>
                      <p className="text-sm text-gray-600">
                        • ৳5,000 fine + Account suspension for 7 days
                      </p>
                      <p className="text-sm text-gray-600">
                        • Loss of "Verified Seller" badge
                      </p>
                      <p className="text-sm text-gray-600">
                        • Featured listing privileges revoked for 30 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">3rd Offense</Badge>
                    <div>
                      <p className="text-sm text-gray-600">
                        • ৳10,000 fine + Account suspension for 30 days
                      </p>
                      <p className="text-sm text-gray-600">
                        • Mandatory quality audit of your farm
                      </p>
                      <p className="text-sm text-gray-600">
                        • Probationary status for 6 months
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">4th Offense</Badge>
                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        • PERMANENT ACCOUNT TERMINATION
                      </p>
                      <p className="text-sm text-gray-600">
                        • Legal action may be pursued
                      </p>
                      <p className="text-sm text-gray-600">
                        • Banned from platform permanently
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-red-700 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Cheating on Weight or Quantity
            </h3>
            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700">
                Providing less quantity than paid for, using incorrect weights,
                or padding weight with non-product materials.
              </p>
              <p className="text-gray-700 font-medium">Penalties:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>
                  <strong>1st Offense:</strong> ৳2,000 fine + 200% refund to
                  customer
                </li>
                <li>
                  <strong>2nd Offense:</strong> ৳10,000 fine + 15-day suspension
                </li>
                <li>
                  <strong>3rd Offense:</strong> Permanent ban + legal action
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Misrepresenting Product Quality or Type
            </h3>
            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700">
                Selling non-organic produce as organic, listing Premium quality
                when it's Standard, or incorrect product names.
              </p>
              <p className="text-gray-700 font-medium">Penalties:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>
                  <strong>1st Offense:</strong> ৳3,000 fine + warning
                </li>
                <li>
                  <strong>2nd Offense:</strong> ৳8,000 fine + 10-day suspension
                </li>
                <li>
                  <strong>3rd Offense:</strong> Account termination
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-red-700">
              Using Harmful Chemicals
            </h3>
            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700">
                Using banned pesticides, excessive chemicals, or artificial
                coloring to make produce look fresh.
              </p>
              <p className="text-gray-700 font-medium">Penalties:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>
                  <strong>Immediate:</strong> Account suspension pending
                  investigation
                </li>
                <li>
                  <strong>If proven:</strong> Permanent ban + ৳50,000 fine
                </li>
                <li>
                  <strong>Severe cases:</strong> Legal action + criminal charges
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportation Guidelines */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              Transportation & Delivery Guidelines
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Pre-Delivery Checklist</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Verify order details and quantities</li>
              <li>Ensure products are properly packaged</li>
              <li>Use ice packs for perishables if needed</li>
              <li>Double-check delivery address</li>
              <li>Prepare invoice and quality certificate</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">During Transit</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Keep products away from direct sunlight</li>
              <li>Maintain required temperature</li>
              <li>Avoid stacking heavy items on delicate produce</li>
              <li>Update delivery status regularly</li>
              <li>Handle with care to prevent bruising</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Rewards for Good Practice */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-700">
              Rewards for Quality Excellence
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2 text-green-700">
              Benefits of Maintaining Quality:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>
                <strong>"Verified Quality Seller"</strong> badge after 50
                successful orders
              </li>
              <li>
                <strong>Featured listings</strong> on homepage for highly-rated
                farmers
              </li>
              <li>
                <strong>Lower commission rates</strong> (down to 5% from
                standard 10%)
              </li>
              <li>
                <strong>Priority support</strong> and faster payment processing
              </li>
              <li>
                <strong>Marketing support</strong> and promotional opportunities
              </li>
              <li>
                <strong>Exclusive access</strong> to bulk buyers and premium
                customers
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
            Need Training or Support?
          </h3>
          <p className="text-gray-600">
            We provide free training on best practices, quality control, and
            packaging:
          </p>
          <p className="text-gray-600 mt-2">
            📧 Email: farmer-support@agroconnect.com
          </p>
          <p className="text-gray-600">📞 Hotline: +880 1234-567891 (24/7)</p>
          <p className="text-gray-600">
            📚 Online Training: Available in your dashboard
          </p>
          <p className="text-gray-600">
            🎥 Video Tutorials: Watch best practices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
