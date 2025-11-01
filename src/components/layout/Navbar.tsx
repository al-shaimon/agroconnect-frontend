import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { COLORS } from '../../constants/theme';
import { Menu, ShoppingCart, Bell, LogOut, User, Sprout } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isAuthenticated, logout, isBuyer } = useAuth();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'buyer':
        return '/buyer/marketplace';
      case 'admin':
        return '/admin/panel';
      default:
        return '/';
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-white shadow-sm"
      style={{ borderBottomColor: COLORS.border }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Product Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-6 w-6" style={{ color: COLORS.primary }} />
              <span className="text-xl font-semibold" style={{ color: COLORS.primary }}>
                AgroConnect
              </span>
            </Link>

            {/* Product Navigation */}
            <div className="hidden md:flex items-center gap-4 ml-6">
              <Link to="/marketplace">
                <Button variant="ghost">All Products</Button>
              </Link>
              {user?.role === 'farmer' && (
                <Link to="/farmer/products/new">
                  <Button variant="ghost">Add Product</Button>
                </Link>
              )}
              {user?.role === 'farmer' && (
                <Link to="/farmer/products">
                  <Button variant="ghost">My Products</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Cart, Notifications, and User Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Cart Button (for buyers) */}
            {isBuyer && (
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Link to="/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-6 w-6" style={{ color: COLORS.primary }} />
              <span className="text-xl font-semibold" style={{ color: COLORS.primary }}>
                AgroConnect
              </span>
            </Link>

            {/* Product Navigation */}
            <div className="hidden md:flex items-center gap-4 ml-6">
              <Link to="/products">
                <Button variant="ghost">All Products</Button>
              </Link>
              {user?.role === 'farmer' && (
                <Link to="/farmer/products/new">
                  <Button variant="ghost">Add Product</Button>
                </Link>
              )}
              {user?.role === 'farmer' && (
                <Link to="/farmer/products">
                  <Button variant="ghost">My Products</Button>
                </Link>
              )}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-8 w-8" style={{ color: COLORS.primary }} />
              <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                AgroConnect
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isBuyer() && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => navigate('/buyer/cart')}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                )}

                <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
