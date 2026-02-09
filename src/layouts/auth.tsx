import onboardingBg from '@/assets/Onboarding.png';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <Box
      display='flex'
      flexDirection={{ xs: 'column', md: 'row' }}
      alignItems='center'
      width='100%'
      justifyContent='space-between'
      minHeight='100vh'
    >
      {/* Left panel — hidden on mobile, visible from md up */}
      <Box
        display={{ xs: 'none', md: 'flex' }}
        width={{ md: '45%' }}
        height='95vh'
        my='auto'
        m={2}
        p={6}
        borderRadius='24px'
        alignItems='flex-end'
        flexShrink={0}
        sx={{
          background: `url(${onboardingBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box color='white'>
          <Typography variant='caption'>👋 Welcome to abitto energy</Typography>
          <Typography variant='h2' fontWeight='bold' letterSpacing={-1}>
            Buy gas. Use gas. Track gas.
          </Typography>
          <Typography>
            Pay only for the gas you use. Get real-time updates and never run
            out unexpectedly.
          </Typography>
        </Box>
      </Box>

      {/* Right panel — form area */}
      <Box
        width={{ xs: '100%', md: '55%' }}
        minHeight={{ xs: '100vh', md: 'auto' }}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Outlet />
      </Box>
    </Box>
  );
};
