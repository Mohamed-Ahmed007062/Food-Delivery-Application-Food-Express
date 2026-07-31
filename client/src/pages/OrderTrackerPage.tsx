import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../features/orders/services/orderService.js';
import { CheckCircle2, Clock, MapPin, ChefHat, Bike, PackageCheck, XCircle } from 'lucide-react';

export const OrderTrackerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
    refetchInterval: 10000, // Poll status every 10s
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(id!, 'Cancelled by customer'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading live order tracker...
      </div>
    );
  }

  if (!order) return null;

  const steps = [
    { status: 'placed', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'preparing', label: 'Preparing Food', icon: ChefHat },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { status: 'delivered', label: 'Delivered', icon: PackageCheck },
  ];

  const statusOrder = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider">
              Live Order Tracker
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-heading">
              Order #{order.orderNumber}
            </h1>
          </div>

          <Link
            to="/orders"
            className="rounded-xl border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent"
          >
            All Orders
          </Link>
        </div>

        {/* Status Tracker Stepper */}
        {order.status === 'cancelled' ? (
          <div className="mt-8 rounded-2xl bg-destructive/10 p-6 text-center text-destructive">
            <XCircle className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-bold font-heading">Order Cancelled</h3>
            <p className="text-sm">{order.cancelReason || 'This order has been cancelled.'}</p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="text-base font-bold font-heading">Order Status Progress</h3>

            <div className="mt-8 flex items-center justify-between relative">
              {steps.map((step, index) => {
                const isCompleted = currentIndex >= index;
                const isCurrent = currentIndex === index;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center z-10">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg'
                          : isCompleted
                          ? 'bg-primary/90 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-semibold ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.status === 'placed' && (
              <div className="mt-8 border-t pt-4 text-center">
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="rounded-xl border border-destructive/20 bg-destructive/10 px-6 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* Order Details Breakdown */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-bold font-heading">Delivery Info</h4>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {order.deliveryAddress.title}: {order.deliveryAddress.street}, {order.deliveryAddress.city}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span>Payment:</span>
                <span className="font-semibold uppercase text-foreground">{order.paymentMethod}</span>
                {order.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                    PAID ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    PENDING ⏳
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-bold font-heading">Financial Summary</h4>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Delivery</span>
                <span className="font-mono text-foreground">${(order.tax + order.deliveryFee).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-bold text-foreground text-sm">
                <span>Total Paid</span>
                <span className="font-mono text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
