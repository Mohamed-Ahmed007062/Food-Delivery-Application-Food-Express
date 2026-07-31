import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { orderService, IOrder } from '../features/orders/services/orderService.js';
import { ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getUserOrders(),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderId: string) => orderService.reorder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/checkout');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading order history...
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      placed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      confirmed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      preparing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      out_for_delivery: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      delivered: 'bg-green-500/10 text-green-600 dark:text-green-400',
      cancelled: 'bg-destructive/10 text-destructive',
    };
    return (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
          statusStyles[status] || 'bg-muted text-muted-foreground'
        }`}
      >
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading">Order History</h1>
          <p className="text-sm text-muted-foreground">Track past food orders and reorder your favorites</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {data && data.data.length === 0 && (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted" />
            <h3 className="mt-4 text-lg font-bold text-foreground font-heading">No Orders Placed Yet</h3>
            <p className="text-sm">Explore restaurants and order your first meal!</p>
            <Link
              to="/restaurants"
              className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow"
            >
              Browse Marketplace
            </Link>
          </div>
        )}

        {data &&
          data.data.map((order: IOrder) => (
            <div key={order._id} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-base font-bold text-foreground">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => reorderMutation.mutate(order._id)}
                    className="flex items-center space-x-1 rounded-xl border border-input bg-background px-3.5 py-1.5 text-xs font-semibold hover:bg-accent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reorder</span>
                  </button>
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-semibold text-foreground">{order.restaurant?.name || 'Restaurant'}</p>
                  <p className="text-muted-foreground">{order.items.length} item(s)</p>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-mono text-sm font-bold text-primary">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
