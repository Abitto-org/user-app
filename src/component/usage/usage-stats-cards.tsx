import { Box, Typography } from '@mui/material';
import { useGetMeter, useGetMeterStats } from '@/services/meters';

const formatKg = (value: number | string | undefined) => {
  const n = Number(value ?? 0);
  return `${n.toLocaleString('en-NG', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  })} Kg`;
};

export const UsageStatsCards = () => {
  const { data: meter } = useGetMeter();
  const { data: stats } = useGetMeterStats();

  const remaining = Number(meter?.meter?.availableGasKg ?? stats?.remainingKg ?? 0);
  const usedToday = Number(stats?.usedToday ?? 0);
  const usedThisWeek = Number(stats?.usedThisWeek ?? 0);

  return (
    <Box
      display='grid'
      gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
      gap={2}
      mb={2}
    >
      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
        <Typography color='text.secondary' fontSize={13} mb={1}>
          Current Gas Level
        </Typography>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography fontWeight={700} fontSize={28 / 16 + 'rem'}>
            {formatKg(remaining)}
          </Typography>
          <Typography color='#217C38' fontSize={13} fontWeight={600}>
            ● Online
          </Typography>
        </Box>
        <Typography mt={1} color='#E65A4F' fontSize={12} fontWeight={600}>
          Estimate ~2 days remaining
        </Typography>
      </Box>

      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
        <Typography color='text.secondary' fontSize={13} mb={1}>
          Average Gas Usage
        </Typography>
        <Typography fontWeight={700} fontSize={28 / 16 + 'rem'}>
          {formatKg(usedToday)}
        </Typography>
        <Typography mt={1} color='text.secondary' fontSize={12} fontWeight={600}>
          Today
        </Typography>
      </Box>

      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
        <Typography color='text.secondary' fontSize={13} mb={1}>
          Usage Change
        </Typography>
        <Typography fontWeight={700} fontSize={28 / 16 + 'rem'}>
          +{(stats?.weeklyChangePercentage ?? 0).toLocaleString('en-NG', {
            maximumFractionDigits: 2,
          })}
          %
        </Typography>
        <Typography mt={1} color='text.secondary' fontSize={12} fontWeight={600}>
          Compared to last week ({formatKg(usedThisWeek)})
        </Typography>
      </Box>
    </Box>
  );
};
