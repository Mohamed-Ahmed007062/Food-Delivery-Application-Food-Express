import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService.js';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponErr, setCouponErr] = useState<string | null>(null);

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isOpen,
  });

  const updateMutation = useMutation({
    mutationFn: ({ mealId, quantity }: { mealId: string; quantity: number }) =>
      cartService.updateQuantity(mealId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (mealId: string) => cartService.removeItem(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || !couponCode.trim()) return;
    setCouponMsg(null);
    setCouponErr(null);

    try {
      const res = await cartService.applyCoupon(couponCode);
      const appliedCode = res.cart?.couponCode || couponCode;
      setCouponMsg(`Coupon ${appliedCode} applied! -$${res.discountAmount.toFixed(2)}`);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (err) {
      setCouponErr((err as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-card shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold font-heading">Your Order Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-muted p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading && (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading cart...</p>
              )}

              {cart && cart.items.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted" />
                  <p className="mt-4 text-base font-semibold text-foreground font-heading">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-xs">Browse restaurants and add delicious meals to your cart.</p>
                </div>
              )}

              {cart && cart.items.length > 0 && (
                <div className="space-y-4">
                  {cart.restaurant && (
                    <div className="rounded-xl bg-primary/10 p-3 text-xs font-semibold text-primary">
                      Ordering from: <span className="underline">{cart.restaurant.name}</span>
                    </div>
                  )}

                  <div className="divide-y">
                    {cart.items.map((item) => (
                      <div key={item.meal} className="flex items-center justify-between py-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-foreground">{item.name}</h4>
                          <span className="font-mono text-xs text-primary font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 rounded-lg border bg-background p-1">
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  mealId: item.meal,
                                  quantity: item.quantity - 1,
                                })
                              }
                              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  mealId: item.meal,
                                  quantity: item.quantity + 1,
                                })
                              }
                              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeMutation.mutate(item.meal)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="pt-4">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Coupon Code"
                          className="w-full rounded-xl border bg-background py-2 pl-9 pr-3 text-xs uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/90"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <p className="mt-1.5 flex items-center space-x-1 text-[11px] font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{couponMsg}</span>
                      </p>
                    )}
                    {couponErr && <p className="mt-1.5 text-[11px] text-destructive">{couponErr}</p>}
                  </form>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart && cart.items.length > 0 && (
              <div className="border-t bg-card p-6">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-foreground">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono text-foreground">${cart.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-foreground">
                      {cart.deliveryFee === 0 ? 'Free' : `$${cart.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-${cart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-base font-bold text-foreground">
                    <span>Total</span>
                    <span className="font-mono text-primary">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => clearMutation.mutate()}
                    className="rounded-xl border border-destructive/20 bg-destructive/10 py-3 text-xs font-semibold text-destructive hover:bg-destructive/20"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/checkout');
                    }}
                    className="col-span-2 flex items-center justify-center space-x-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
