import dashboardIcon from '@/assets/icons/dashboard-icon.svg';
import transactionIcon from '@/assets/icons/transaction-icon.svg';
import usageIcon from '@/assets/icons/usage-icon.svg';
import walletIcon from '@/assets/icons/wallet-icon.svg';
import settingsIcon from '@/assets/icons/settings-icon.svg';
import helpIcon from '@/assets/icons/help-icon.svg';
import logoutIcon from '@/assets/icons/logout-icon.svg';

import { Box, Typography } from '@mui/material';

const sideItems = {
  general: [
    {
      icon: dashboardIcon,
      title: 'Dashboard',
    },
    {
      icon: usageIcon,
      title: 'Usage',
    },
    {
      icon: walletIcon,
      title: 'Wallet',
    },
    {
      icon: transactionIcon,
      title: 'Transactions',
    },
  ],
  system: [
    {
      icon: helpIcon,
      title: 'Help Center',
    },
    {
      icon: settingsIcon,
      title: 'Settings',
    },
  ],
};

export const SideBar = () => {
  return (
    <Box borderRight='1px solid #ECECEC' height='100%' p={2}>
      <Box mb={3}>
        <Typography gutterBottom variant='h6' color='#669900'>
          Abitto Energy
        </Typography>
      </Box>
      <Typography variant='subtitle1' color='#414141' fontWeight='bold'>
        General
      </Typography>
      {sideItems['general'].map((item) => (
        <Box
          key={item.title}
          display='flex'
          alignItems='center'
          my={1}
          gap='12px'
          width='100%'
          p={1}
          sx={{
            '&:hover': {
              bgcolor: '#FAFAFA',
            },
          }}
        >
          <img src={item.icon} />
          <Typography variant='subtitle2' color='#414141'>
            {item.title}
          </Typography>
        </Box>
      ))}

      <Typography mt={3} variant='subtitle1' color='#414141' fontWeight='bold'>
        System
      </Typography>
      {sideItems['system'].map((item) => (
        <Box
          key={item.title}
          display='flex'
          alignItems='center'
          my={1}
          gap='12px'
          width='100%'
          p={1}
          sx={{
            '&:hover': {
              bgcolor: '#FAFAFA',
            },
          }}
        >
          <img src={item.icon} />
          <Typography variant='subtitle2' color='#414141'>
            {item.title}
          </Typography>
        </Box>
      ))}

      <Box
        bgcolor='#EA00001A'
        display='flex'
        p={1}
        px={3}
        gap='12px'
        borderRadius='12px'
        mt={3}
      >
        <img src={logoutIcon} />
        <Typography variant='subtitle2' color='#EA0000'>
          Logout
        </Typography>
      </Box>
    </Box>
  );
};
