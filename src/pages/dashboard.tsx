import { useState } from 'react';
import { DashboardHeader } from '@/shared/dashboard-header';
import { BuyGasDrawer } from '@/component/buy-gas-drawer';
import { GiftGasDrawer } from '@/component/gift-gas-drawer';

import onIcon from '@/assets/icons/on-icon.svg';
import flowIcon from '@/assets/icons/flow-icon.svg';
import upIcon from '@/assets/icons/up-icon.svg';
import { Typography, Box, Button } from '@mui/material';
import { RecentActivity } from '@/component/recent-activity';
import { WeeklyUsage } from '@/component/weekly-usage';
import { RecentActivityTable } from '@/component/recent-activity-table';
import { useGetMeter, useGetMeterStats } from '@/services/meters';
import { useGetWalletBalance } from '@/services/wallet';
import { pxToRem } from '@/util/font';
import { useMeterId } from '@/hooks/use-meter-id';
import { Link, useNavigate } from 'react-router-dom';


export const Dashboard = () => {
  const [buyGasOpen, setBuyGasOpen] = useState(false);
  const [giftGasOpen, setGiftGasOpen] = useState(false);
  const navigate = useNavigate();
  const meterId = useMeterId();

  const { data: meter } = useGetMeter();
  const { data: walletBalance } = useGetWalletBalance();

  const { data: meterStats } = useGetMeterStats();

  const formatKgValue = (value: number | string | undefined) =>
    `${Number(value ?? 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    })} kg`;

  const Stats = [
    {
      title: 'remaining kg',
      value: formatKgValue(meter?.meter?.availableGasKg || 0),
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
      value: formatKgValue(meterStats?.usedToday || 0),
      below: 'View Usage',
      belowRoute: '/usage',
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
      value: `₦${Number(walletBalance?.balance || 0).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      below: 'view wallet',
      belowRoute: '/wallet'
    },
  ];

  return (
    <>
      <DashboardHeader
        onBuyGas={() => setBuyGasOpen(true)}
        onGiftGas={() => setGiftGasOpen(true)}
      />
      <BuyGasDrawer open={buyGasOpen} onClose={() => setBuyGasOpen(false)} />
      <GiftGasDrawer open={giftGasOpen} onClose={() => setGiftGasOpen(false)} />
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        gap={1.5}
        justifyContent='space-between'
        mt={2}
      >
        {Stats.map((item) => (
          <Box
            bgcolor='white'
            display='flex'
            alignItems='flex-start'
            justifyContent='space-between'
            key={item.title}
            width='100%'
            p={2.25}
            borderRadius='12px'
            border='1px solid #EBECEF'
            minHeight={132}
            sx={{
              transition: 'box-shadow 160ms ease, transform 160ms ease',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
              '&:hover': {
                boxShadow: '0 8px 18px rgba(16, 24, 40, 0.08)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Box>
              <Typography
                textTransform='capitalize'
                color='#414141'
                variant='body2'
                fontWeight={500}
              >
                {item.title}
              </Typography>
              <Typography variant='h5' fontWeight={700} my={1}>
                {item.value}
              </Typography>
              {item.below ? (
                item.belowRoute ? (
                  <Typography
                    variant='caption'
                    textTransform='capitalize'
                    fontWeight={500}
                    color='primary'
                    component={Link}
                    to={item.belowRoute}
                    sx={{
                      ':hover': {
                        textDecoration: 'underline',
                        color: 'inherit',
                      },
                    }}
                  >
                    {item.below}
                  </Typography>
                ) : (
                  <Typography
                    variant='caption'
                    textTransform='capitalize'
                    fontWeight={500}
                    color='text.secondary'
                  >
                    {item.below}
                  </Typography>
                )
              ) : null}
            </Box>
            {item.leftComponent}
          </Box>
        ))}
      </Box >

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
      <Box bgcolor='white' borderRadius={2} p={2.5} border='1px solid #EBECEF'>
        <Box>
          <Box>
            <Typography fontSize={pxToRem(16)} fontWeight='bold'>
              Transactions
            </Typography>
            <Typography
              mb={3}
              fontSize={pxToRem(14)}
              textTransform='capitalize'
              color='#667085'
            >
              view all your transactions
            </Typography>
          </Box>
        </Box>
        <RecentActivityTable />
        <Box display='flex' alignItems='center' justifyContent='flex-end' mt={2}>
          <Button
            sx={{
              alignItems: 'flex-end',
              px: 3,
            }}
            variant='contained'
            endIcon={<img src={upIcon} />}
            onClick={() => {
              if (meterId) navigate(`/${meterId}/transactions`);
            }}
          >
            View all transactions
          </Button>
        </Box>
      </Box>
    </>
  );
};
