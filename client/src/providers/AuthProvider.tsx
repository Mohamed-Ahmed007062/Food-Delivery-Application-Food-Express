import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, LoginInput, RegisterInput } from '../features/auth/types/auth.types.js';
import { authService } from '../features/auth/services/authService.js';
import { getAccessTokenMemory } from '../lib/axios.js';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Silent refresh / auto-login on app mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user: fetchedUser } = await authService.getMe();
        setUser(fetchedUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    return authService.register(data);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = async () => {
    try {
      const { user: fetchedUser } = await authService.getMe();
      setUser(fetchedUser);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && !!getAccessTokenMemory(),
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
