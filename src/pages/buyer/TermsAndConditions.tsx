import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { COLORS } from "../../constants/theme";
import {
  Truck,
  AlertTriangle,
  Clock,
  Shield,
  Ban,
  FileText,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Separator } from "../../components/ui/separator";

export const TermsAndConditions = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Terms & Conditions
        </h1>
        <p className="text-gray-600">
          Please read these terms carefully before placing your order
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By placing an order on AgroConnect, you agree to abide by these terms
          and conditions.
        </AlertDescription>
      </Alert>

      {/* Transportation & Delivery */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              Transportation & Delivery Policy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Standard Delivery Time</h3>
            <p className="text-gray-600">
              • Orders are typically delivered within{" "}
              <strong>24-48 hours</strong> from order confirmation.
            </p>
            <p className="text-gray-600">
              • Delivery time may vary based on your location and the farmer's
              location.
            </p>
            <p className="text-gray-600">
              • Remote areas may require additional 1-2 days for delivery.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Transportation Methods</h3>
            <p className="text-gray-600">
              • Products are transported in temperature-controlled vehicles when
              necessary.
            </p>
            <p className="text-gray-600">
              • Fragile items are packaged with extra care to prevent damage.
            </p>
            <p className="text-gray-600">
              • Real-time tracking is available for all orders.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Delivery Charges</h3>
            <p className="text-gray-600">
              • Delivery charges are calculated based on distance and order
              weight.
            </p>
            <p className="text-gray-600">
              • Free delivery on orders above <strong>৳500</strong> within city
              limits.
            </p>
            <p className="text-gray-600">
              • Additional charges may apply for express delivery or remote
              locations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delays & Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              Delays & Unforeseen Circumstances
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Weather-Related Delays
            </h3>
            <p className="text-gray-600 mb-2">
              In case of severe weather conditions (heavy rain, storms, floods):
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Deliveries may be postponed for safety reasons</li>
              <li>You will be notified immediately about the delay</li>
              <li>Estimated new delivery time will be provided</li>
              <li>
                No cancellation charges if you choose to cancel due to delay
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Road Blockades & Traffic Jams
            </h3>
            <p className="text-gray-600 mb-2">
              In case of road blockades, strikes, or severe traffic:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Delivery may be delayed by 2-4 hours or more</li>
              <li>
                Our delivery team will find alternative routes when possible
              </li>
              <li>Real-time updates will be sent via SMS/notification</li>
              <li>
                Compensation: 10% discount coupon for your next order if delay
                exceeds 6 hours
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              Vehicle Breakdown
            </h3>
            <p className="text-gray-600 mb-2">
              If delivery vehicle encounters technical issues:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Backup vehicle will be dispatched immediately</li>
              <li>Products will be transferred safely to ensure freshness</li>
              <li>Maximum delay: 4-6 hours</li>
              <li>
                If delay is unavoidable, you have the option to cancel without
                penalty
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Emergency Situations</h3>
            <p className="text-gray-600 mb-2">
              In case of natural disasters, civil unrest, or government-imposed
              restrictions:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Orders may be held until it's safe to deliver</li>
              <li>
                Full refund available if delivery cannot be completed within 72
                hours
              </li>
              <li>Priority delivery once normal operations resume</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Returns & Refunds */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              Returns & Refunds Policy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Acceptable Return Reasons</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Product quality is not as described</li>
              <li>Spoiled or damaged products upon delivery</li>
              <li>Wrong items delivered</li>
              <li>Incomplete order</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Return Process</h3>
            <p className="text-gray-600">
              1. Take photos of the damaged/wrong products immediately
            </p>
            <p className="text-gray-600">
              2. Contact our support within 2 hours of delivery
            </p>
            <p className="text-gray-600">
              3. Return will be picked up within 24 hours
            </p>
            <p className="text-gray-600">
              4. Refund processed within 3-5 business days
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Refund Options</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>
                <strong>Full Refund:</strong> Money returned to your original
                payment method
              </li>
              <li>
                <strong>Replacement:</strong> New product delivered at no extra
                cost
              </li>
              <li>
                <strong>Store Credit:</strong> Amount credited to your
                AgroConnect wallet with 5% bonus
              </li>
            </ul>
          </div>

          <Separator />

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-700">
              Non-Returnable Items
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Products that have been consumed or used</li>
              <li>
                Items returned after 24 hours without proper documentation
              </li>
              <li>Damage caused by buyer negligence</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>
              Quality Assurance
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Our Commitment</h3>
            <p className="text-gray-600">
              • All products are inspected before dispatch
            </p>
            <p className="text-gray-600">
              • Farmers are verified and must maintain quality standards
            </p>
            <p className="text-gray-600">
              • Cold chain maintained for perishable items
            </p>
            <p className="text-gray-600">
              • Regular quality audits conducted on all farmers
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Buyer Protection</h3>
            <p className="text-gray-600">
              • 100% money-back guarantee if quality standards are not met
            </p>
            <p className="text-gray-600">
              • Dispute resolution team available 24/7
            </p>
            <p className="text-gray-600">
              • Compensation for proven quality issues
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Legal Terms</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Payment Terms</h3>
            <p className="text-gray-600">
              • Payment is processed securely through our payment gateway
            </p>
            <p className="text-gray-600">
              • Prices are subject to change based on market conditions
            </p>
            <p className="text-gray-600">
              • Final price includes all applicable taxes
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Liability</h3>
            <p className="text-gray-600">
              • AgroConnect acts as a platform connecting farmers and buyers
            </p>
            <p className="text-gray-600">
              • We ensure quality control but ultimate responsibility lies with
              the farmer
            </p>
            <p className="text-gray-600">
              • We are not liable for delays beyond our control (Acts of God)
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Dispute Resolution</h3>
            <p className="text-gray-600">
              • All disputes will first be attempted to resolve through
              mediation
            </p>
            <p className="text-gray-600">
              • Legal jurisdiction: Courts of Bangladesh
            </p>
            <p className="text-gray-600">
              • Arbitration option available for quicker resolution
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
            Need Help?
          </h3>
          <p className="text-gray-600">
            If you have any questions about these terms or need assistance with
            your order:
          </p>
          <p className="text-gray-600 mt-2">
            📧 Email: support@agroconnect.com
          </p>
          <p className="text-gray-600">📞 Hotline: +880 1234-567890 (24/7)</p>
          <p className="text-gray-600">💬 Live Chat: Available in the app</p>
        </CardContent>
      </Card>
    </div>
  );
};
