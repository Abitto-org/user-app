import dashboardIcon from '@/assets/icons/dashboard-icon.svg';
import transactionIcon from '@/assets/icons/transaction-icon.svg';
import usageIcon from '@/assets/icons/usage-icon.svg';
import walletIcon from '@/assets/icons/wallet-icon.svg';
import settingsIcon from '@/assets/icons/settings-icon.svg';
import helpIcon from '@/assets/icons/help-icon.svg';
import logoutIcon from '@/assets/icons/logout-icon.svg';

import abittoLogo from '@/assets/abitto-logo.png';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const sideItems = {
  general: [
    {
      icon: dashboardIcon,
      title: 'Dashboard',
      page: 'dashboard',
    },
    {
      icon: usageIcon,
      title: 'Usage',
      page: 'usage',
    },
    {
      icon: walletIcon,
      title: 'Wallet',
      page: 'wallet',
    },
    {
      icon: transactionIcon,
      title: 'Transactions',
      page: 'transactions',
    },
  ],
  system: [
    {
      icon: helpIcon,
      title: 'Help Center',
      page: 'help',
    },
    {
      icon: settingsIcon,
      title: 'Settings',
      page: 'settings',
    },
  ],
};

export const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { meterId } = useParams<{ meterId: string }>();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('onboardingCompleted');
    navigate('/login', { replace: true });
  };

  return (
    <Box borderRight='1px solid #ECECEC' height='100%' p={2}>
      <Box mb={3}>
        <img src={abittoLogo} alt='Abitto Energy' style={{ height: 40 }} />
      </Box>
      <Typography variant='subtitle1' color='#414141' fontWeight='bold'>
        General
      </Typography>
      {sideItems['general'].map((item) => {
        const fullPath = `/${meterId}/${item.page}`;
        const isActive = pathname.endsWith(`/${item.page}`);
        return (
          <Box
            key={item.title}
            display='flex'
            alignItems='center'
            my={1}
            gap='12px'
            width='100%'
            p={1}
            onClick={() => navigate(fullPath)}
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              bgcolor: isActive ? '#F0F7E0' : 'transparent',
              '&:hover': { bgcolor: isActive ? '#F0F7E0' : '#FAFAFA' },
            }}
          >
            <img src={item.icon} />
            <Typography
              variant='subtitle2'
              color={isActive ? '#669900' : '#414141'}
              fontWeight={isActive ? 600 : 400}
            >
              {item.title}
            </Typography>
          </Box>
        );
      })}

      <Typography mt={3} variant='subtitle1' color='#414141' fontWeight='bold'>
        System
      </Typography>
      {sideItems['system'].map((item) => {
        const fullPath = `/${meterId}/${item.page}`;
        const isActive = pathname.endsWith(`/${item.page}`);
        return (
          <Box
            key={item.title}
            display='flex'
            alignItems='center'
            my={1}
            gap='12px'
            width='100%'
            p={1}
            onClick={() => navigate(fullPath)}
            sx={{
              cursor: 'pointer',
              borderRadius: '8px',
              bgcolor: isActive ? '#F0F7E0' : 'transparent',
              '&:hover': { bgcolor: isActive ? '#F0F7E0' : '#FAFAFA' },
            }}
          >
            <img src={item.icon} />
            <Typography
              variant='subtitle2'
              color={isActive ? '#669900' : '#414141'}
              fontWeight={isActive ? 600 : 400}
            >
              {item.title}
            </Typography>
          </Box>
        );
      })}

      <Box
        bgcolor='#EA00001A'
        display='flex'
        p={1}
        px={3}
        gap='12px'
        borderRadius='12px'
        mt={3}
        onClick={handleLogout}
        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#EA00002A' } }}
      >
        <img src={logoutIcon} />
        <Typography variant='subtitle2' color='#EA0000'>
          Logout
        </Typography>
      </Box>
    </Box>
  );
};
