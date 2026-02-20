import { Navigate, Outlet } from 'react-router-dom';
import { useGetMeters } from '@/services/meters';
import { Box, CircularProgress } from '@mui/material';

export const AuthGuard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

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

/**
 * Redirects bare paths like /dashboard to /:meterId/dashboard
 * by fetching the user's meters and using the first one.
 */
export const MeterRedirect = ({ page }: { page: string }) => {
  const { data: meters = [], isLoading } = useGetMeters();

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  if (meters.length > 0) {
    return <Navigate to={`/${meters[0].id}/${page}`} replace />;
  }

  return <Navigate to={`/no-meter/${page}`} replace />;
};
