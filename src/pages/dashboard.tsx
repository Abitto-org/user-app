import { DashboardLayout } from '@/layouts/dashboard';
import { DashboardHeader } from '@/shared/dashboard-header';

import onIcon from '@/assets/icons/on-icon.svg';
import flowIcon from '@/assets/icons/flow-icon.svg';
import { Typography, Box } from '@mui/material';
import { RecentActivity } from '@/component/recent-activity';
import { WeeklyUsage } from '@/component/weekly-usage';
import { RecentActivityTable } from '@/component/recent-activity-table';

export const Dashboard = () => {
  const Stats = [
    {
      title: 'remaining units',
      value: '12.4 units',
      below: (
        <Typography variant='subtitle2' fontWeight='bold' color='error'>
          Estimated ~2 days remaining
        </Typography>
      ),
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
      title: 'units used today',
      value: '3.2 units',
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
    <DashboardLayout>
      <DashboardHeader />
      <Box
        display='flex'
        alignItems='center'
        gap='8px'
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

      <Box display='flex' mt={2} width='100%' gap={2} mb={4} alignItems='stretch'>
        <Box flex={1} display='flex'>
          <WeeklyUsage />
        </Box>
        <Box width='40%' flexShrink={0} display='flex'>
          <RecentActivity />
        </Box>
      </Box>
      <RecentActivityTable/>
    </DashboardLayout>
  );
};
