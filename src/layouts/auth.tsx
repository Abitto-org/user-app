import onboardingBg from '@/assets/Onboarding.png';
import abittoLogo from '@/assets/abitto-logo.png';
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
      sx={{
        background: {
          xs: 'linear-gradient(180deg, #F7FBEF 0%, #FFFFFF 45%)',
          md: 'transparent',
        },
      }}
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
        py={{ xs: 3, sm: 4, md: 0 }}
        px={{ xs: 1.5, sm: 2.5, md: 0 }}
      >
        <Box
          width='100%'
          maxWidth={{ xs: 620, md: '100%' }}
          borderRadius={{ xs: '20px', md: 0 }}
          bgcolor={{ xs: '#FFFFFF', md: 'transparent' }}
          border={{ xs: '1px solid #EAECF0', md: 'none' }}
          boxShadow={{
            xs: '0px 12px 32px rgba(16, 24, 40, 0.08)',
            md: 'none',
          }}
          overflow='hidden'
          height='auto'
          py={5}
        >
          <Box
            display={{ xs: 'flex', md: 'none' }}
            flexDirection='column'
            alignItems='flex-start'
            textAlign='center'
            px={3}
            pt={3}
            pb={1}
            gap={1}
          >
            <Box
              component='img'
              src={abittoLogo}
              alt='Abitto Energy'
              sx={{ height: 34, width: 'auto' }}
            />
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
