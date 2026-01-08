'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUsersProfile } from '@/api/generated/users/users';
import type { GetUsersProfile200User } from '@/api/generated/models';

interface AuthContextType {
  user: GetUsersProfile200User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Buscar perfil do usuário apenas se houver token
  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetUsersProfile({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  // Inicializar token do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsInitialized(true);
    }
  }, []);

  const login = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setToken(null);
      router.push('/admin/login');
    }
  };

  const refreshUser = () => {
    refetchProfile();
  };

  const value: AuthContextType = {
    user: profile?.user || null,
    token,
    isLoading: !isInitialized || (!!token && isLoadingProfile),
    isAuthenticated: !!token && !!profile?.user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

