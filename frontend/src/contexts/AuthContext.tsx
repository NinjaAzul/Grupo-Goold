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

  // Buscar perfil do usuário apenas se houver token e estiver inicializado
  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetUsersProfile({
    query: {
      enabled: !!token && isInitialized,
      retry: false,
      refetchOnMount: true,
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

  // Forçar refetch do profile quando o token mudar (após inicialização)
  useEffect(() => {
    if (token && isInitialized) {
      // O React Query deve fazer a query automaticamente devido ao enabled: !!token && isInitialized
      // Mas vamos forçar um refetch para garantir
      const timer = setTimeout(() => {
        refetchProfile();
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isInitialized]);

  const login = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // O React Query vai automaticamente fazer a query quando token mudar
      // devido ao enabled: !!token
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setToken(null);
      router.push('/login');
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

