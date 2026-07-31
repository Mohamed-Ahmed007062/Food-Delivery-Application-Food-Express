import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';
import { BarChart, StatusPie } from '../../components/common/Charts.js';
import { useSocket } from '../../lib/socket.js';

export const AdminDashboardPage: React.FC = () => {
  useSocket();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'users' | 'coupons'>('analytics');

  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState('');

  const { data: analytics } = useQuery({
    queryKey: ['analytics', 'admin'],
    queryFn: async () => {
      const res: any = await apiClient.get('/analytics/admin');
      return res?.data?.analytics || res?.analytics || res;
    },
  });

  const { data: restaurantsData } = useQuery({
    queryKey: ['restaurants', 'admin'],
    queryFn: async () => {
      const res: any = await apiClient.get('/restaurants');
      return Array.isArray(res) ? res : (res?.data?.restaurants || res?.data || res?.restaurants || []);
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', 'admin'],
    queryFn: async () => {
      const res: any = await apiClient.get('/users');
      return Array.isArray(res) ? res : (res?.data || res?.users || []);
    },
  });

  const { data: couponsData } = useQuery({
    queryKey: ['coupons', 'admin'],
    queryFn: async () => {
      const res: any = await apiClient.get('/coupons');
      return Array.isArray(res) ? res : (res?.data?.coupons || res?.data || res?.coupons || []);
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      await apiClient.patch(`/restaurants/${id}/approve`, { isApproved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const userStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiClient.patch(`/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/coupons', {
        code: couponCode,
        discountType: 'percentage',
        discountValue: parseFloat(couponVal),
        endDate: '2026-12-31T23:59:59Z',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setCouponCode('');
      setCouponVal('');
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider">
            System Administration Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading">
            Platform Analytics & Operations
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-muted p-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'analytics' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'approvals' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Approvals
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'users' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            User Matrix
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'coupons' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Coupons
          </button>
        </div>
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Total GMV Revenue</span>
              <p className="mt-2 font-mono text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Platform Commission (10%)</span>
              <p className="mt-2 font-mono text-2xl font-bold text-primary">${analytics?.platformCommission?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Total Orders</span>
              <p className="mt-2 font-mono text-2xl font-bold">{analytics?.totalOrders || 0}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Active Restaurants</span>
              <p className="mt-2 font-mono text-2xl font-bold">{analytics?.totalRestaurants || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BarChart data={analytics?.dailyOrders || []} title="Platform Sales & Daily Trends" />
            </div>
            <div>
              <StatusPie data={analytics?.ordersByStatus || []} title="Order Status Breakdown" />
            </div>
          </div>
        </div>
      )}

      {/* APPROVALS TAB */}
      {activeTab === 'approvals' && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold font-heading">Restaurant Approval Queue</h3>
          <div className="divide-y rounded-2xl border bg-card shadow-sm">
            {restaurantsData?.map((rest: any) => (
              <div key={rest._id} className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base">{rest.name}</h4>
                  <p className="text-xs text-muted-foreground">{rest.cuisine?.join(', ')} - {rest.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {rest.isApproved ? (
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600">Approved</span>
                  ) : (
                    <button
                      onClick={() => approveMutation.mutate({ id: rest._id, isApproved: true })}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow"
                    >
                      Approve Restaurant
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER MATRIX TAB */}
      {activeTab === 'users' && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold font-heading">Platform Users Management</h3>
          <div className="divide-y rounded-2xl border bg-card shadow-sm">
            {(Array.isArray(usersData) ? usersData : (usersData?.data || usersData?.users || []))?.map((user: any) => (
              <div key={user._id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{user.name}</h4>
                  <p className="text-xs text-muted-foreground">{user.email} - <span className="uppercase font-semibold">{user.role}</span></p>
                </div>

                <button
                  onClick={() =>
                    userStatusMutation.mutate({ userId: user._id, isActive: !user.isActive })
                  }
                  className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    user.isActive ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Banned'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="mt-8 space-y-6">
          <div className="max-w-md rounded-2xl border bg-card p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold font-heading">Create Platform Coupon</h4>
            <input
              type="text"
              placeholder="Coupon Code (e.g. SAVE20)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border bg-background p-2.5 text-xs font-bold uppercase"
            />
            <input
              type="number"
              placeholder="Discount Percentage (%)"
              value={couponVal}
              onChange={(e) => setCouponVal(e.target.value)}
              className="w-full rounded-xl border bg-background p-2.5 text-xs"
            />
            <button
              onClick={() => createCouponMutation.mutate()}
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow"
            >
              Create Coupon
            </button>
          </div>

          <div className="divide-y rounded-2xl border bg-card shadow-sm">
            {couponsData?.map((cpn: any) => (
              <div key={cpn._id} className="p-4 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-primary">{cpn.code}</span>
                  <p className="text-muted-foreground">{cpn.discountValue}% OFF</p>
                </div>
                <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 font-bold text-green-600">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
