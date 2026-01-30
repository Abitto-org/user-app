import React from 'react';

import onboardingBg from '@/assets/Onboarding.png';
import { Box, Typography } from '@mui/material';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      width='100%'
      justifyContent='space-between'
      height='100vh'
    >
      <Box
        width='45%'
        height='95%'
        my='auto'
        m={2}
        p={6}
        borderRadius='24px'
        display='flex'
        alignItems='flex-end'
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
      <Box width='55%'>
        <p>hello</p>
      </Box>
    </Box>
  );
};
