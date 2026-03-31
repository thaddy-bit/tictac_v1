import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, setApiToken } from './api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (data: { first_name: string, last_name: string, email: string, phone: string, password: string, role: 'user' | 'pharmacy' }) => Promise<boolean>;
  updateWallet: (amount: number) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.get<{ valid: boolean, user: User }>('/auth/verify');
        if (response.valid) {
          setUser(response.user);
        }
      } catch (error) {
        // Not logged in or expired
        console.log('No active session found');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (phone: string, password: string): Promise<User | null> => {
    try {
      const response = await api.post<{ user: User; token?: string }>('/auth/login', { phone, password });
      if (response.user) {
        if (response.token) setApiToken(response.token);
        setUser(response.user);
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setApiToken(null);
      setUser(null);
      localStorage.removeItem('tictac_draft_search'); // Optional cleanup
    }
  };

  const updateWallet = (amount: number) => {
    if (!user) return;
    setUser({ ...user, wallet_balance: Number(user.wallet_balance) + amount });
  };

  const register = async (data: Partial<User> & { password?: string }): Promise<boolean> => {
    try {
      const response = await api.post<{ user: User; token?: string }>('/auth/register', data);
      if (response.user) {
        if (response.token) setApiToken(response.token);
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateWallet, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
