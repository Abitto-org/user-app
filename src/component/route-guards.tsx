import { Navigate, Outlet } from 'react-router-dom';

/**
 * Requires a valid token in localStorage.
 * Redirects to /login if not authenticated.
 */
export const AuthGuard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

/**
 * Requires a valid token AND completed onboarding.
 * - No token → /login
 * - Token but onboarding not completed → /onboarding
 * - Both present → render child routes
 */
export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (onboardingCompleted !== 'true') {
    return <Navigate to='/onboarding' replace />;
  }

  return <Outlet />;
};
