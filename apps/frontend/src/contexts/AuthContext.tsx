import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '@/types';
import { getCurrentUser, isAuthenticated, removeAuthToken, setCurrentUser } from '@/lib/auth';
import { useQuery } from 'urql';
import { CURRENT_USER_QUERY } from '@/lib/gql';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (role: typeof UserRole[keyof typeof UserRole]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  const [{ data, fetching, error }] = useQuery({
    query: CURRENT_USER_QUERY,
    pause: !isAuthenticated(),
  });

  useEffect(() => {
    if (data?.currentUser) {
      setUser(data.currentUser);
      setCurrentUser(data.currentUser);
    } else if (error && !fetching) {
      logout();
    }
    setIsLoading(fetching);
  }, [data, error, fetching]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = (userData: User, _token: string) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeAuthToken();
    window.location.href = '/login';
  };

  const hasRole = (role: typeof UserRole[keyof typeof UserRole]): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
