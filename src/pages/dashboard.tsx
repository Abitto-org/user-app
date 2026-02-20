import { useState } from 'react';
import { DashboardHeader } from '@/shared/dashboard-header';
import { BuyGasDrawer } from '@/component/buy-gas-drawer';

import onIcon from '@/assets/icons/on-icon.svg';
import flowIcon from '@/assets/icons/flow-icon.svg';
import upIcon from '@/assets/icons/up-icon.svg';
import { Typography, Box, Button } from '@mui/material';
import { RecentActivity } from '@/component/recent-activity';
import { WeeklyUsage } from '@/component/weekly-usage';
import { RecentActivityTable } from '@/component/recent-activity-table';
import { useGetMeter } from '@/services/meters';

export const Dashboard = () => {
  const [buyGasOpen, setBuyGasOpen] = useState(false);

  const { data: meter } = useGetMeter()

  console.log('Single meter', meter)

  const Stats = [
    {
      title: 'remaining kg',
      value: meter?.availableGasKg
        ? Number(meter.availableGasKg).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 3 })
        : '0.00',
      leftComponent: (
        <Box
          display='flex'
          alignItems='center'
          bgcolor='#F2FCF5'
          borderRadius='32px'
          gap='4px'
          px={1}
        >
          <img src={onIcon} />
          <Typography
            fontWeight='600'
            textTransform='capitalize'
            variant='body1'
            color='#217C38'
          >
            on
          </Typography>
        </Box>
      ),
    },
    {
      title: 'kg used today',
      value: '3.2 kg',
      below: 'View Usage',
      leftComponent: (
        <Box
          display='flex'
          alignItems='center'
          bgcolor='#F2FCF5'
          borderRadius='32px'
          gap='4px'
          px={1}
        >
          <img src={flowIcon} />
          <Typography
            fontWeight='600'
            textTransform='capitalize'
            variant='body1'
            color='#217C38'
          >
            flow: active
          </Typography>
        </Box>
      ),
    },
    {
      title: 'wallet balance',
      value: '₦12,000.44 ',
      below: 'view wallet',
    },
  ];

  return (
    <>
      <DashboardHeader onBuyGas={() => setBuyGasOpen(true)} />
      <BuyGasDrawer open={buyGasOpen} onClose={() => setBuyGasOpen(false)} />
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        gap={1}
        justifyContent='space-between'
      >
        {Stats.map((item) => (
          <Box
            bgcolor='white'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            key={item.title}
            width='100%'
            p={2}
            borderRadius='8px'
            border='1px solid #F8F8F8'
          >
            <Box>
              <Typography
                textTransform='capitalize'
                color='#414141'
                variant='subtitle2'
              >
                {item.title}
              </Typography>
              <Typography variant='h5' fontWeight='bold' my={1}>
                {item.value}
              </Typography>
              <Typography
                variant='subtitle2'
                textTransform='capitalize'
                fontWeight='bold'
              >
                {item.below}
              </Typography>
            </Box>
            {item.leftComponent}
          </Box>
        ))}
      </Box>

      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        mt={2}
        width='100%'
        gap={2}
        mb={4}
        alignItems='stretch'
      >
        <Box flex={1} display='flex'>
          <WeeklyUsage />
        </Box>
        <Box width={{ xs: '100%', md: '40%' }} flexShrink={0} display='flex'>
          <RecentActivity />
        </Box>
      </Box>
      <RecentActivityTable />
      <Box display='flex' alignItems='center' justifyContent='flex-end' mt={2}>
        <Button sx={{
          alignItems: 'flex-end',
        }} variant='contained' endIcon={<img src={upIcon} />}>
          View all transactions
        </Button>
      </Box>
    </>
  );
};
