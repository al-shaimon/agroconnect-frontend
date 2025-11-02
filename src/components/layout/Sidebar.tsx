import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/theme';
import {
  LayoutDashboard,
  Package,
  Package2,
  ShoppingBag,
  Users,
  Bell,
  ClipboardList,
  Store,
  Receipt,
  FileCheck,
  UserCircle,
  Truck,
  MapPin,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const farmerLinks = [
    { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/farmer/products', icon: Package, label: 'My Products' },
    { to: '/farmer/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/buyer/marketplace', icon: Store, label: 'Marketplace' },
    { to: '/buyer/orders', icon: Receipt, label: 'My Orders' },
    { to: '/buyer/cart', icon: ShoppingBag, label: 'Cart' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/panel', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/verifications', icon: FileCheck, label: 'Verifications' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/products', icon: Package2, label: 'Products' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/broadcast', icon: Bell, label: 'Broadcast' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const driverLinks = [
    { to: '/driver/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/driver/available-orders', icon: Package, label: 'Available Orders' },
    { to: '/driver/my-orders', icon: Truck, label: 'My Deliveries' },
    { to: '/driver/profile', icon: MapPin, label: 'Location & Profile' },
    { to: '/profile', icon: UserCircle, label: 'Account' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'farmer':
        return farmerLinks;
      case 'buyer':
        return buyerLinks;
      case 'admin':
        return adminLinks;
      case 'driver':
        return driverLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ borderRightColor: COLORS.border }}
      >
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
                style={isActive ? { backgroundColor: COLORS.primary } : undefined}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
