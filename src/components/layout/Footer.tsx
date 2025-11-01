import { Link } from 'react-router-dom';
import { COLORS } from '../../constants/theme';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-white" style={{ borderTopColor: COLORS.border }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="h-8 w-8" style={{ color: COLORS.primary }} />
              <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                AgroConnect
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Connecting farmers directly with buyers for fresh, quality agricultural products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.primary }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/buyer/marketplace" className="text-gray-600 hover:text-gray-900">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.primary }}>
              For Farmers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/farmer/dashboard" className="text-gray-600 hover:text-gray-900">
                  Farmer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: COLORS.primary }}>
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: COLORS.primary }} />
                support@agroconnect.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: COLORS.primary }} />
                +880 1234-567890
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: COLORS.primary }} />
            Chattagram, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 border-t pt-8 text-center text-sm text-gray-600"
          style={{ borderTopColor: COLORS.border }}
        >
          <p>&copy; {new Date().getFullYear()} AgroConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
