import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider.js';
import { authService } from '../../features/auth/services/authService.js';
import { User, Mail, Shield, Phone, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refetchUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);

    try {
      await authService.updateProfile({ name, phone });
      await refetchUser();
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileErr((err as Error).message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);

    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      setPasswordMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordErr((err as Error).message);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Profile Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary font-heading">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading">{user.name}</h1>
                <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                <span>{user.role}</span>
              </span>
              <button
                onClick={() => logout()}
                className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
              >
                Sign Out
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold font-heading">Personal Details</h3>

            {profileErr && (
              <div className="flex items-center space-x-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{profileErr}</span>
              </div>
            )}

            {profileMsg && (
              <div className="flex items-center space-x-2 rounded-xl bg-green-500/10 p-3 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{profileMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Save Details
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h3 className="flex items-center space-x-2 text-lg font-semibold font-heading">
            <KeyRound className="h-5 w-5 text-primary" />
            <span>Security & Password</span>
          </h3>

          {passwordErr && (
            <div className="mt-4 flex items-center space-x-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{passwordErr}</span>
            </div>
          )}

          {passwordMsg && (
            <div className="mt-4 flex items-center space-x-2 rounded-xl bg-green-500/10 p-3 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{passwordMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl border border-input bg-background px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-accent"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
