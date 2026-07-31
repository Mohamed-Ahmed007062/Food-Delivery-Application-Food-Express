import { apiClient, setAccessTokenMemory } from '../../../lib/axios.js';
import { RegisterInput, LoginInput, IUser } from '../types/auth.types.js';

export const authService = {
  async register(data: RegisterInput): Promise<{ message: string }> {
    const res: any = await apiClient.post('/auth/register', data);
    return {
      message: res.message || res.data?.message || 'Account created successfully! Please sign in.',
    };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.post(`/auth/verify-email/${token}`);
  },

  async login(data: LoginInput): Promise<{ accessToken: string; user: IUser }> {
    const res: any = await apiClient.post('/auth/login', data);
    const accessToken = res.data.accessToken;
    setAccessTokenMemory(accessToken);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAccessTokenMemory(null);
    }
  },

  async getMe(): Promise<{ user: IUser }> {
    const res: any = await apiClient.get('/auth/me');
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiClient.post(`/auth/reset-password/${token}`, { password });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.patch('/auth/change-password', { currentPassword, newPassword });
  },

  async updateProfile(data: Partial<IUser>): Promise<{ user: IUser }> {
    const res: any = await apiClient.put('/auth/profile', data);
    return res.data;
  },
};
