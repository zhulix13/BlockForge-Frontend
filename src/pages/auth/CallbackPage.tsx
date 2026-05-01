import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../api/types/shared.types';
import LogoLoader from '../../components/ui/LogoLoader';

/**
 * CallbackPage — Post-OAuth landing point.
 *
 * The backend handles the full X OAuth exchange server-side and sets the JWT
 * cookie, then redirects the browser here. AuthInitializer (already mounted
 * in App.tsx) calls /user/profile and populates the store. We simply wait for
 * isLoading to settle, then navigate to the role-appropriate dashboard.
 */
const CallbackPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait until AuthInitializer has finished the /user/profile check
    if (!isLoading) {
      if (isAuthenticated && user) {
        const dest = user.role === Role.USER ? '/hunter' : '/admin';
        navigate(dest, { replace: true });
      } else {
        // Cookie missing or invalid — send back to login
        navigate('/login', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Show the branded loader while the session resolves
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0f1117 50%, #0a0c14 100%)',
      }}
    >
      <LogoLoader />
    </div>
  );
};

export default CallbackPage;
