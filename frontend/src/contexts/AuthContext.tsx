'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUsersProfile } from '@/api/generated/users/users';
import type { GetUsersProfile200User } from '@/api/generated/models';
import { ROLES, LOGIN_ROUTES, TOKEN_KEY } from '@/constants';

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

const PROFILE_REFETCH_DELAY = 50;

const isBrowser = () => typeof window !== 'undefined';

const getStoredToken = (): string | null => {
  return isBrowser() ? localStorage.getItem(TOKEN_KEY) : null;
};

const setStoredToken = (token: string): void => {
  if (isBrowser()) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const removeStoredToken = (): void => {
  if (isBrowser()) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

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

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!token || !isInitialized) return;

    const timer = setTimeout(() => {
      refetchProfile();
    }, PROFILE_REFETCH_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isInitialized]);

  const login = (newToken: string) => {
    setStoredToken(newToken);
    setToken(newToken);
    if (isInitialized) {
      refetchProfile();
    }
  };

  const logout = () => {
    const userRoleId = profile?.user?.roleId;
    const redirectPath = userRoleId && userRoleId in LOGIN_ROUTES 
      ? LOGIN_ROUTES[userRoleId as keyof typeof LOGIN_ROUTES]
      : LOGIN_ROUTES[ROLES.USER]; 

    removeStoredToken();
    setToken(null);
    router.push(redirectPath);
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

