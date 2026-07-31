import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Activity,
  LogOut,
  ShoppingBag,
  History,
  LayoutDashboard,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider.js';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../../features/cart/services/cartService.js';
import { CartDrawer } from '../../features/cart/components/CartDrawer.js';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: !!user,
  });

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading">FoodExpress</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/restaurants"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Marketplace
            </Link>
            <Link
              to="/health"
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Activity className="h-4 w-4" />
              <span>Health</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] text-white">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/orders"
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <History className="h-4 w-4" />
                  <span>Orders</span>
                </Link>

                {/* Owner Dashboard Link */}
                {(user.role === 'restaurant-owner' || user.role === 'admin') && (
                  <Link
                    to="/owner/dashboard"
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Owner Studio</span>
                  </Link>
                )}

                {/* Admin Portal Link */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-sm font-medium text-secondary transition-colors hover:text-primary font-bold"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 rounded-xl bg-accent/50 px-3 py-1.5 text-sm font-semibold hover:bg-accent"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-1 rounded-xl bg-primary/10 p-2 text-primary"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-mono text-[9px] text-white">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl border bg-muted/50 p-2 text-foreground hover:bg-muted"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/restaurants"
              onClick={closeMobileMenu}
              className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Marketplace
            </Link>

            <Link
              to="/health"
              onClick={closeMobileMenu}
              className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Activity className="h-4 w-4 text-primary" />
              <span>Health Check</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <History className="h-4 w-4 text-primary" />
                  <span>Orders</span>
                </Link>

                {(user.role === 'restaurant-owner' || user.role === 'admin') && (
                  <Link
                    to="/owner/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <span>Owner Studio</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-bold text-secondary hover:bg-muted"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2 rounded-xl bg-muted/60 px-3 py-2 text-sm font-semibold"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </Link>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-2 border-t flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center rounded-xl border py-2.5 text-xs font-semibold hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-full text-center rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Cart Drawer Modal */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
