import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';
import { BarChart } from '../../components/common/Charts.js';
import { useSocket } from '../../lib/socket.js';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  useSocket();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'meals' | 'orders' | 'settings'>('overview');

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [deletingMeal, setDeletingMeal] = useState<{ _id: string; name: string } | null>(null);

  const [mealName, setMealName] = useState('');
  const [mealPrice, setMealPrice] = useState('');
  const [mealCategory, setMealCategory] = useState('Main Course');
  const [mealDesc, setMealDesc] = useState('');
  const [mealImg, setMealImg] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics', 'owner'],
    queryFn: async () => {
      const res: any = await apiClient.get('/analytics/owner');
      return res?.data?.analytics || res?.analytics || res;
    },
  });

  const { data: mealsData } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const res: any = await apiClient.get('/meals');
      return Array.isArray(res) ? res : (res?.data?.meals || res?.data || res?.meals || []);
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders', 'owner'],
    queryFn: async () => {
      const res: any = await apiClient.get('/orders');
      return Array.isArray(res) ? res : (res?.data?.orders || res?.data || res?.orders || []);
    },
  });

  const handleOpenAddMealModal = () => {
    setEditingMealId(null);
    setMealName('');
    setMealPrice('');
    setMealCategory('Main Course');
    setMealDesc('');
    setMealImg('');
    setFormError(null);
    setIsMealModalOpen(true);
  };

  const handleOpenEditMealModal = (meal: any) => {
    setEditingMealId(meal._id);
    setMealName(meal.name);
    setMealPrice(meal.price !== undefined ? meal.price.toString() : '');
    setMealDesc(meal.description || '');
    const catName = typeof meal.category === 'object' ? meal.category?.name || 'Main Course' : meal.category || 'Main Course';
    setMealCategory(catName);
    setMealImg(meal.image || '');
    setFormError(null);
    setIsMealModalOpen(true);
  };

  const saveMealMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!mealName.trim() || !mealPrice || !mealDesc.trim()) {
        throw new Error('Please fill in all required fields (*)');
      }
      const priceNum = parseFloat(mealPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        throw new Error('Please enter a valid price (greater than or equal to 0)');
      }

      const payload = {
        name: mealName.trim(),
        price: priceNum,
        description: mealDesc.trim(),
        category: mealCategory,
        image: mealImg.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      };

      if (editingMealId) {
        await apiClient.put(`/meals/${editingMealId}`, payload);
      } else {
        await apiClient.post('/meals', payload);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['meals'], exact: false });
      await queryClient.refetchQueries({ queryKey: ['meals'], exact: false });
      const isEdit = !!editingMealId;
      setIsMealModalOpen(false);
      setEditingMealId(null);
      setMealName('');
      setMealPrice('');
      setMealDesc('');
      setMealImg('');
      setMealCategory('Main Course');
      setFormError(null);
      setToastMessage(isEdit ? 'Meal updated successfully 🎉' : 'Meal created successfully 🎉');
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to save meal. Please try again.');
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      await apiClient.delete(`/meals/${mealId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['meals'], exact: false });
      await queryClient.refetchQueries({ queryKey: ['meals'], exact: false });
      setDeletingMeal(null);
      setToastMessage('Meal deleted successfully 🗑️');
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setToastMessage(err?.response?.data?.message || err?.message || 'Failed to delete meal.');
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  const toggleStockMutation = useMutation({
    mutationFn: async ({ mealId, isAvailable }: { mealId: string; isAvailable: boolean }) => {
      await apiClient.put(`/meals/${mealId}`, { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'], exact: false });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiClient.patch(`/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
    },
  });

  if (isAnalyticsLoading) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading Owner Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-xl animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
            Restaurant Management Studio
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight font-heading">
            {analytics?.restaurantName || 'Bella Italia Woodfired Pizza'}
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-2xl border bg-card p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'meals'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Manage Meals
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Orders Matrix
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="mt-8 space-y-8">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
                <div className="rounded-xl bg-green-500/10 p-2.5 text-green-600 dark:text-green-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Orders</span>
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold">{analytics?.totalOrders || 0}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Pending Orders</span>
                <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold">{analytics?.pendingOrders || 0}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Average Rating</span>
                <div className="rounded-xl bg-yellow-500/10 p-2.5 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold">{analytics?.averageRating || 4.8} / 5</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BarChart data={analytics?.dailyOrders || []} title="Weekly Revenue & Order Trend" />
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold font-heading flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Recent Reviews</span>
                  </h3>
                  {(() => {
                    const reviewsCount = analytics?.recentReviews?.length || 0;
                    return (
                      <span className="text-xs font-semibold text-muted-foreground font-mono bg-muted/50 px-2.5 py-0.5 rounded-full">
                        {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
                      </span>
                    );
                  })()}
                </div>

                {!analytics?.recentReviews || analytics.recentReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                      <Star className="h-7 w-7 fill-primary/20 text-primary" />
                    </div>
                    <div className="space-y-1 max-w-xs">
                      <h4 className="text-sm font-bold font-heading text-foreground">No Reviews Yet</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Customer ratings and feedback for <span className="font-semibold text-foreground">{analytics?.restaurantName || 'Global Kitchen Express'}</span> will appear here once submitted.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y space-y-3">
                    {analytics.recentReviews.map((rev: any, idx: number) => {
                      const userName = rev.user?.name || (typeof rev.user === 'string' ? rev.user : 'Valued Customer');
                      const reviewDate = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                      return (
                        <div key={idx} className="pt-3.5 first:pt-0 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                                {userName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-foreground">{userName}</span>
                            </div>
                            <div className="flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-amber-500 font-mono text-[11px] font-bold">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{rev.rating}.0</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed pl-8">{rev.comment}</p>
                          {reviewDate && (
                            <p className="text-[10px] text-muted-foreground/70 pl-8 font-mono">{reviewDate}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE MEALS TAB */}
      {activeTab === 'meals' && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-heading">Menu Items ({mealsData?.length || 0})</h3>
            <button
              onClick={handleOpenAddMealModal}
              className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Meal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mealsData?.map((meal: any) => (
              <div key={meal._id} className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                <div>
                  <img src={meal.image} alt={meal.name} className="h-36 w-full object-cover rounded-xl" />
                  <div className="mt-3 flex justify-between items-start">
                    <h4 className="font-bold text-sm">{meal.name}</h4>
                    <span className="font-mono text-xs font-bold text-primary">${meal.price?.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{meal.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <button
                    onClick={() =>
                      toggleStockMutation.mutate({
                        mealId: meal._id,
                        isAvailable: !meal.isAvailable,
                      })
                    }
                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${
                      meal.isAvailable
                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                        : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    }`}
                  >
                    {meal.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditMealModal(meal)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit Meal"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingMeal({ _id: meal._id, name: meal.name })}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS MATRIX TAB */}
      {activeTab === 'orders' && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold font-heading">Incoming Orders</h3>
          <div className="divide-y rounded-2xl border bg-card shadow-sm">
            {(Array.isArray(ordersData) ? ordersData : (ordersData?.data || ordersData?.orders || []))?.map((order: any) => (
              <div key={order._id} className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-sm font-bold">#{order.orderNumber}</span>
                  <p className="text-xs text-muted-foreground">{order.items?.length} item(s) - ${order.total?.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      statusMutation.mutate({ orderId: order._id, status: e.target.value })
                    }
                    className="rounded-xl border bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="mt-8 rounded-2xl border bg-card p-8 shadow-sm max-w-xl">
          <h3 className="text-lg font-bold font-heading">Restaurant Settings</h3>
          <p className="text-xs text-muted-foreground mt-1">Configure opening hours and store visibility</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Restaurant Name</label>
              <input
                type="text"
                readOnly
                value={analytics?.restaurantName || 'Bella Italia Woodfired Pizza'}
                className="w-full rounded-xl border bg-muted p-2.5 text-sm font-medium text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Status</label>
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 font-mono">
                Active & Accepting Orders
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deletingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-destructive">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-foreground">Delete Meal</h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-foreground">"{deletingMeal.name}"</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setDeletingMeal(null)}
                className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMealMutation.isPending}
                onClick={() => deleteMealMutation.mutate(deletingMeal._id)}
                className="flex items-center space-x-1.5 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition-all disabled:opacity-50"
              >
                {deleteMealMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Meal</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MEAL MODAL */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold font-heading">
                {editingMealId ? 'Edit Meal' : 'Add New Meal'}
              </h3>
              <button
                onClick={() => setIsMealModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMealMutation.mutate();
              }}
              className="mt-4 space-y-4"
            >
              {formError && (
                <div className="flex items-center space-x-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Meal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Truffle Smash Burger"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                  className="w-full rounded-xl border bg-background p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Category *</label>
                  <select
                    value={mealCategory}
                    onChange={(e) => setMealCategory(e.target.value)}
                    required
                    className="w-full rounded-xl border bg-background p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Italian">Italian</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Asian">Asian</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Appetizers">Appetizers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 14.99"
                    value={mealPrice}
                    onChange={(e) => setMealPrice(e.target.value)}
                    required
                    className="w-full rounded-xl border bg-background p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Description *</label>
                <textarea
                  placeholder="Delicious meal description..."
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-xl border bg-background p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={mealImg}
                  onChange={(e) => setMealImg(e.target.value)}
                  className="w-full rounded-xl border bg-background p-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMealMutation.isPending}
                  className="flex items-center space-x-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveMealMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingMealId ? 'Update Meal' : 'Save Meal'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
