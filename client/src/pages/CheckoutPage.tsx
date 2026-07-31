import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { cartService } from '../features/cart/services/cartService.js';
import { orderService } from '../features/orders/services/orderService.js';
import {
  CreditCard,
  Banknote,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Lock,
  Loader2,
} from 'lucide-react';

// Initialize Stripe with publishable key from environment
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Stripe CardElement custom styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#1a1a2e',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

/**
 * Inner checkout form component — must be rendered inside <Elements>
 * so it can access Stripe hooks (useStripe, useElements).
 */
const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Address State
  const [title, setTitle] = useState('Home');
  const [street, setStreet] = useState('123 Main St');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<string>('');

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  /**
   * Main order placement handler:
   * 1. Creates the order on the backend (which also creates a Stripe PaymentIntent)
   * 2. If payment method is 'stripe', confirms the payment using the card element
   * 3. Navigates to the order page on success
   */
  const handlePlaceOrder = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // Step 1: Create the order on the backend
      setPaymentStep('Creating your order...');
      const res = await orderService.createOrder({
        deliveryAddress: { title, street, city, state, zipCode },
        paymentMethod,
        notes,
      });

      if (paymentMethod === 'stripe' && res.clientSecret) {
        // Step 2: Confirm the payment with Stripe
        if (!stripe || !elements) {
          setError('Stripe is still loading. Please wait a moment and try again.');
          setIsProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setError('Please enter your card details.');
          setIsProcessing(false);
          return;
        }

        setPaymentStep('Processing payment securely...');

        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(res.clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });

        if (stripeError) {
          setError(stripeError.message || 'Payment failed. Please check your card details and try again.');
          setIsProcessing(false);
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
          setPaymentStep('Payment successful! Verifying...');
          try {
            await orderService.confirmPayment(res.order._id, paymentIntent.id);
          } catch {
            // fallback if offline
          }
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          navigate(`/orders/${res.order._id}`);
          return;
        }

        // Handle other payment statuses
        setError(`Payment status: ${paymentIntent?.status}. Please contact support.`);
        setIsProcessing(false);
      } else {
        // Cash on Delivery — navigate directly
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        navigate(`/orders/${res.order._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading checkout details...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-heading">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center space-x-2 text-xs font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight font-heading">
        Checkout & Order Placement
      </h1>

      {error && (
        <div className="mt-4 flex items-center space-x-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column — Address & Payment Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery Address Card */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center space-x-2 text-lg font-bold font-heading">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Delivery Address</span>
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Address Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  State / Zip Code
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-1/2 rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-1/2 rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center space-x-2 text-lg font-bold font-heading">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <span>Payment Option</span>
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                onClick={() => setPaymentMethod('stripe')}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-foreground font-heading">
                        Credit / Debit Card
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stripe Secure Payment
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Banknote className="h-6 w-6 text-secondary" />
                    <div>
                      <p className="font-bold text-foreground font-heading">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pay cash when food arrives
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            </div>

            {/* Stripe Card Input — only visible when stripe is selected */}
            {paymentMethod === 'stripe' && (
              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Card Details
                </label>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Your payment info is encrypted and secured by Stripe</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Test Mode:</span>
                  <span>Use card number <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-primary">4242 4242 4242 4242</code>, any future date, any CVC</span>
                </div>
              </div>
            )}

            {/* Delivery Instructions */}
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase text-muted-foreground">
                Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gate code, apartment number, ring bell..."
                className="mt-1 w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Column — Order Breakdown */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold font-heading">Order Summary</h3>

            <div className="mt-4 divide-y">
              {cart.items.map((item) => (
                <div key={item.meal} className="flex justify-between py-2 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">
                      {item.quantity}x
                    </span>{' '}
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t pt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-mono text-foreground">
                  ${cart.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-foreground">
                  {cart.deliveryFee === 0
                    ? 'Free'
                    : `$${cart.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">
                    -${cart.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3 text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="font-mono text-primary">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || (paymentMethod === 'stripe' && !stripe)}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{paymentStep || 'Processing...'}</span>
                </>
              ) : paymentMethod === 'stripe' ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay ${cart.total.toFixed(2)} & Place Order</span>
                </>
              ) : (
                'Confirm & Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Outer CheckoutPage component — wraps the form in Stripe's <Elements> provider
 */
export const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};
