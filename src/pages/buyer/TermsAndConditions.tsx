import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { COLORS } from '../../constants/theme';
import {
  Truck,
  AlertTriangle,
  Clock,
  Shield,
  Ban,
  FileText,
  RefreshCw,
  AlertCircle,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';

export const TermsAndConditions = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
          Terms & Conditions
        </h1>
        <p className="text-gray-600">Please read these terms carefully before placing your order</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By placing an order on AgroConnect, you agree to abide by these terms and conditions.
        </AlertDescription>
      </Alert>

      {/* Delivery Terms */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Delivery Terms</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Delivery Timeframes
            </h3>
            <p className="text-gray-600">• Standard delivery: 1-3 business days within the city</p>
            <p className="text-gray-600">• Express delivery: Same day or next day (if available)</p>
            <p className="text-gray-600">• Remote areas: 3-5 business days</p>
            <p className="text-gray-600">
              • Delivery times may vary during peak seasons or adverse weather
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-600">• Ensure your delivery address is complete and accurate</p>
            <p className="text-gray-600">
              • Be available to receive the order at the specified address
            </p>
            <p className="text-gray-600">
              • Additional charges may apply for address changes after order placement
            </p>
            <p className="text-gray-600">• Provide contact number for delivery coordination</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Receiving Orders</h3>
            <p className="text-gray-600">• Inspect products upon delivery before accepting</p>
            <p className="text-gray-600">• Sign delivery confirmation only after verification</p>
            <p className="text-gray-600">
              • Report any discrepancies immediately to our support team
            </p>
            <p className="text-gray-600">• Perishable items must be refrigerated immediately</p>
          </div>
        </CardContent>
      </Card>

      {/* Return & Refund Policy */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Return & Refund Policy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Eligible for Return/Refund
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600">• Products received damaged or spoiled</li>
              <li className="text-gray-600">• Incorrect items delivered</li>
              <li className="text-gray-600">• Missing items from your order</li>
              <li className="text-gray-600">
                • Products not matching description or quality standards
              </li>
              <li className="text-gray-600">
                • Quality issues reported within 24 hours of delivery
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-600" />
              Not Eligible for Return
            </h3>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-600">• Products properly delivered and accepted</li>
              <li className="text-gray-600">• Natural variations in size, color, or appearance</li>
              <li className="text-gray-600">• Buyer's remorse or change of mind</li>
              <li className="text-gray-600">• Damage caused by buyer negligence after delivery</li>
              <li className="text-gray-600">
                • Complaints raised after 24 hours without valid reason
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Refund Process</h3>
            <p className="text-gray-600">• Refunds are processed within 5-7 business days</p>
            <p className="text-gray-600">• Amount will be credited to original payment method</p>
            <p className="text-gray-600">• Photo evidence may be required for quality issues</p>
            <p className="text-gray-600">• Partial refunds for partial order issues</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Cancellation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-orange-600">Order Cancellation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Buyer Cancellation</h3>
            <p className="text-gray-600">
              • Orders can be cancelled within 1 hour of placement for free
            </p>
            <p className="text-gray-600">
              • After 1 hour, cancellation charges may apply (10% of order value)
            </p>
            <p className="text-gray-600">• Orders in "In Transit" status cannot be cancelled</p>
            <p className="text-gray-600">
              • Frequent cancellations may affect your account standing
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Farmer/Platform Cancellation</h3>
            <p className="text-gray-600">• Full refund if farmer cancels the order</p>
            <p className="text-gray-600">
              • Platform may cancel orders due to unavailability or force majeure
            </p>
            <p className="text-gray-600">• You will be notified immediately of any cancellation</p>
          </div>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Quality Assurance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Our Commitment</h3>
            <p className="text-gray-600">• All products are inspected before dispatch</p>
            <p className="text-gray-600">
              • Farmers are verified and must maintain quality standards
            </p>
            <p className="text-gray-600">• Cold chain maintained for perishable items</p>
            <p className="text-gray-600">• Regular quality audits conducted on all farmers</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Your Responsibility</h3>
            <p className="text-gray-600">• Inspect products immediately upon delivery</p>
            <p className="text-gray-600">• Report issues within 24 hours with photo evidence</p>
            <p className="text-gray-600">• Store products properly after delivery</p>
            <p className="text-gray-600">• Provide honest feedback to help improve quality</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Payment Terms</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Payment Methods</h3>
            <p className="text-gray-600">• We accept major credit/debit cards</p>
            <p className="text-gray-600">• Mobile banking (bKash, Nagad, Rocket)</p>
            <p className="text-gray-600">• Cash on Delivery (for eligible orders)</p>
            <p className="text-gray-600">• Digital wallets and other secure payment methods</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Pricing</h3>
            <p className="text-gray-600">• All prices are inclusive of applicable taxes</p>
            <p className="text-gray-600">
              • Delivery charges are clearly mentioned before checkout
            </p>
            <p className="text-gray-600">• Prices may vary based on market conditions</p>
            <p className="text-gray-600">• Special discounts and offers are subject to terms</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Payment Security</h3>
            <p className="text-gray-600">• All transactions are encrypted and secure</p>
            <p className="text-gray-600">• We never store your complete card details</p>
            <p className="text-gray-600">
              • Payment information is protected by industry standards
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Liability & Disputes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Liability & Disputes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Liability</h3>
            <p className="text-gray-600">
              • AgroConnect acts as a platform connecting farmers and buyers
            </p>
            <p className="text-gray-600">
              • We ensure quality control but ultimate responsibility lies with the farmer
            </p>
            <p className="text-gray-600">
              • We are not liable for delays beyond our control (Acts of God)
            </p>
            <p className="text-gray-600">• Maximum liability is limited to the order value</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Dispute Resolution</h3>
            <p className="text-gray-600">
              • All disputes will first be attempted to resolve through mediation
            </p>
            <p className="text-gray-600">• Contact our support team for any complaints or issues</p>
            <p className="text-gray-600">• We aim to resolve all disputes within 7 business days</p>
            <p className="text-gray-600">
              • Legal disputes are subject to jurisdiction of local courts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Conduct */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>User Conduct</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Rule</Badge>
            <p className="text-gray-600">Provide accurate information when placing orders</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Rule</Badge>
            <p className="text-gray-600">Treat delivery personnel and farmers with respect</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Rule</Badge>
            <p className="text-gray-600">Do not misuse the platform or attempt fraud</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Rule</Badge>
            <p className="text-gray-600">Provide honest reviews based on actual experience</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-blue-100 text-blue-800 mt-1">Rule</Badge>
            <p className="text-gray-600">Comply with all applicable laws and regulations</p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" style={{ color: COLORS.primary }} />
            <CardTitle style={{ color: COLORS.primary }}>Privacy & Data Protection</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Data Collection</h3>
            <p className="text-gray-600">
              • We collect necessary information to process your orders
            </p>
            <p className="text-gray-600">• Personal data is protected according to privacy laws</p>
            <p className="text-gray-600">
              • We never sell your personal information to third parties
            </p>
            <p className="text-gray-600">• You can request deletion of your data at any time</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Communication</h3>
            <p className="text-gray-600">
              • We may send order updates via SMS, email, or push notifications
            </p>
            <p className="text-gray-600">• Marketing communications can be opted out at any time</p>
            <p className="text-gray-600">• Essential service messages cannot be disabled</p>
          </div>
        </CardContent>
      </Card>

      {/* Changes to Terms */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Notice:</strong> AgroConnect reserves the right to modify these terms and
          conditions at any time. Continued use of the platform constitutes acceptance of updated
          terms.
        </AlertDescription>
      </Alert>

      {/* Warning */}
      <Alert className="bg-red-50 border-red-200">
        <Ban className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Important:</strong> Violation of these terms may result in account suspension or
          termination. Fraudulent activities will be reported to authorities.
        </AlertDescription>
      </Alert>
    </div>
  );
};
