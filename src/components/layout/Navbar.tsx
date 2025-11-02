import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { COLORS } from "../../constants/theme";
import {
  Menu,
  ShoppingCart,
  LogOut,
  User,
  Sprout,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { NotificationBell } from "../shared/NotificationBell";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, isAuthenticated, logout, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case "farmer":
        return "/farmer/dashboard";
      case "buyer":
        return "/buyer/dashboard";
      case "admin":
        return "/admin/panel";
      default:
        return "/";
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-white shadow-sm"
      style={{ borderBottomColor: COLORS.border }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="h-8 w-8" style={{ color: COLORS.primary }} />
              <span
                className="text-xl font-bold"
                style={{ color: COLORS.primary }}
              >
                AgroConnect
              </span>
            </Link>
          </div>

          {/* Center nav links (visible on large screens) */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                isActivePath("/")
                  ? "text-black border-current"
                  : "text-gray-700 hover:text-black border-transparent"
              }`}
              style={
                isActivePath("/")
                  ? { borderColor: COLORS.primary, color: COLORS.primary }
                  : {}
              }
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                isActivePath("/about")
                  ? "text-black border-current"
                  : "text-gray-700 hover:text-black border-transparent"
              }`}
              style={
                isActivePath("/about")
                  ? { borderColor: COLORS.primary, color: COLORS.primary }
                  : {}
              }
            >
              About Us
            </Link>

            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`text-sm font-medium transition-colors pb-1 border-b-2 flex items-center gap-1 ${
                    isActivePath("/solutions")
                      ? "text-black border-current"
                      : "text-gray-700 hover:text-black border-transparent"
                  }`}
                  style={
                    isActivePath("/solutions")
                      ? { borderColor: COLORS.primary, color: COLORS.primary }
                      : {}
                  }
                >
                  Solutions
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/solutions/farmers" className="cursor-pointer">
                    For Farmers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/solutions/consumers" className="cursor-pointer">
                    For Consumers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/solutions/supply-chain" className="cursor-pointer">
                    Supply Chain
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/blog"
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                isActivePath("/blog")
                  ? "text-black border-current"
                  : "text-gray-700 hover:text-black border-transparent"
              }`}
              style={
                isActivePath("/blog")
                  ? { borderColor: COLORS.primary, color: COLORS.primary }
                  : {}
              }
            >
              Blog
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
                    onClick={() => navigate("/buyer/cart")}
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

                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardLink())}
                    >
                      Dashboard
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
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
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
