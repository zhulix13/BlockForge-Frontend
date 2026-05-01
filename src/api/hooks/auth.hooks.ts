import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../endpoints/auth.api';
import { useAuthStore } from '../../store/authStore';

export const useGetMe = (enabled = true) => {
  const { setUser, setLoading } = useAuthStore();
  
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.data);
        }
        return response.data;
      } catch (error) {
        setUser(null);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled,
    retry: false,
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      window.location.href = '/login';
    },
  });
};

export const useXCallback = () => {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: ({ code, state }: { code: string, state: string }) => 
      authApi.handleXCallback(code, state),
    onSuccess: async () => {
      // After callback success, the session cookie is set. Fetch profile.
      const response = await authApi.getMe();
      if (response.success) {
        setUser(response.data);
      }
    }
  });
};
