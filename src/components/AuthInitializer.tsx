import React, { useEffect } from 'react';
import { useGetMe } from '../api/hooks/auth.hooks';
import { useAuthStore } from '../store/authStore';

/**
 * AuthInitializer is responsible for checking if a session exists
 * on application load. It calls /auth/me and updates the store.
 */
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useGetMe();
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return <>{children}</>;
};

export default AuthInitializer;
