import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, Truck, Package, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { cart } = useProducts();
  const { user, profile, signOut, checkRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeliveryPartner, setIsDeliveryPartner] = React.useState(false);

  // Check if we're on the restaurant dashboard
  const isRestaurantDashboard = location.pathname === '/restaurant-dashboard';

  React.useEffect(() => {
    if (user) {
      checkRole('delivery_partner').then(setIsDeliveryPartner);
    }
  }, [user]);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // Prevent navigation on restaurant dashboard
    if (isRestaurantDashboard) {
      e.preventDefault();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to={isRestaurantDashboard ? "#" : "/"} 
            className="flex items-center space-x-2"
            onClick={handleLogoClick}
          >
            <div className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              FOODIEXPRESS
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search restaurants or dishes..."
                className="pl-10 bg-muted border-border"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links for logged-in users */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/orders">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                {isDeliveryPartner && (
                  <Link to="/delivery">
                    <Button variant="ghost" size="sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Delivery
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Partner with us */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/restaurant-login">
                <Button variant="ghost" size="sm">
                  <Store className="h-4 w-4 mr-2" />
                  Restaurant Login
                </Button>
              </Link>
              <Link to="/register-restaurant">
                <Button variant="outline" size="sm">
                  Partner with us
                </Button>
              </Link>
            </div>

            {/* Cart - hidden on restaurant dashboard */}
            {!isRestaurantDashboard && (
              <Link to="/checkout">
                <Button variant="ghost" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center animate-glow">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* User actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground hidden sm:block">Hi, {profile?.full_name || user.email}</span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search restaurants or dishes..."
              className="pl-10 bg-muted border-border"
            />
          </div>
        </div>
      </div>
    </header>
  );
};