import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetMeters } from '@/services/meters';
import { useGetProfile } from '@/services/profile';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import linkMeterImg from '@/assets/link-meter.png';
import { LinkMeterDrawer } from '@/component/link-meter-drawer';

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
 * or shows a "meter not linked" view when user has no meters.
 */
export const MeterRedirect = ({ page }: { page: string }) => {
  const { data: meters = [], isLoading } = useGetMeters();
  const { data: user } = useGetProfile();
  const [linkDrawerOpen, setLinkDrawerOpen] = useState(false);

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

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      bgcolor='#F5F7FA'
      px={{ xs: 2, md: 6 }}
      py={{ xs: 3, md: 5 }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={6}
        flexWrap='wrap'
        gap={2}
      >
        <Box>
          <Typography
            variant='h4'
            fontWeight={700}
            textTransform='capitalize'
          >
            Welcome, {firstName}
          </Typography>
          <Typography color='text.secondary'>
            Live status &amp; quick actions
          </Typography>
        </Box>
        {/* Buy Gas button intentionally left inactive when no meters */}
      </Box>

      <Box
        flex={1}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Stack spacing={3} alignItems='center' textAlign='center'>
          <Box
            width={180}
            height={180}
            borderRadius='50%'
            bgcolor='white'
            boxShadow='0 10px 30px rgba(15, 23, 42, 0.08)'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <img
              src={linkMeterImg}
              alt='Meter not linked'
              style={{ maxWidth: '70%', height: 'auto' }}
            />
          </Box>
          <Box>
            <Typography variant='h6' fontWeight={700}>
              Meter Not Linked
            </Typography>
            <Typography color='text.secondary' maxWidth={420} mt={0.5}>
              To start using gas, you need to link your smart gas meter.
            </Typography>
          </Box>
          <Button
            variant='contained'
            sx={{ borderRadius: '999px', px: 4, py: 1.4 }}
            onClick={() => setLinkDrawerOpen(true)}
          >
            Request Connection
          </Button>
        </Stack>
      </Box>
      <LinkMeterDrawer
        open={linkDrawerOpen}
        onClose={() => setLinkDrawerOpen(false)}
      />
    </Box>
  );
};
