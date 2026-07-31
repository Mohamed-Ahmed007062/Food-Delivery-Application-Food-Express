export type UserRole = 'customer' | 'restaurant-owner' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  addresses?: Array<{
    _id: string;
    title: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'restaurant-owner';
}

export interface LoginInput {
  email: string;
  password: string;
}
