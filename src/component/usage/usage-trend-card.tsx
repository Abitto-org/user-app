import { Box, Button, Stack, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetMeterStats } from '@/services/meters';

const dayName = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });

const formatUnits = (value: number | undefined) =>
  `${(value ?? 0).toLocaleString('en-NG', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  })} Kg`;

export const UsageTrendCard = () => {
  const { data: meterStats } = useGetMeterStats();
  const chartData =
    meterStats?.weeklyGraphData?.map((item) => ({
      day: dayName(item.date),
      units: item.total,
    })) ?? [];

  return (
    <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2.5} mb={2}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        mb={2}
      >
        <Box>
          <Typography variant='h6' fontWeight={700}>
            Usage Trend
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Daily gas consumption in units
          </Typography>
        </Box>

        <Stack direction='row' alignItems='center' gap={2}>
          <Stack direction='row' spacing={0.5}>
            <Button variant='contained' size='small' sx={{ borderRadius: '4px' }}>
              Month
            </Button>
            <Button variant='text' size='small' sx={{ borderRadius: '4px' }}>
              Week
            </Button>
            <Button variant='text' size='small' sx={{ borderRadius: '4px' }}>
              Day
            </Button>
          </Stack>
          <Box textAlign='right'>
            <Typography fontWeight={700}>{formatUnits(meterStats?.usedThisWeek)}</Typography>
            <Typography variant='caption' color='text.secondary'>
              This Week
            </Typography>
          </Box>
          <Box textAlign='right'>
            <Typography fontWeight={700}>{formatUnits(meterStats?.usedToday)}</Typography>
            <Typography variant='caption' color='text.secondary'>
              Today
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box height={270}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id='usageTrendFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#669900' stopOpacity={0.2} />
                <stop offset='95%' stopColor='#669900' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#F0F0F0' vertical={false} />
            <XAxis dataKey='day' axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
            <Tooltip
              formatter={(value: number | string | undefined) => [
                `${Number(value ?? 0).toLocaleString('en-NG', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 3,
                })} Kg`,
                'Usage',
              ]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #E4E7EC',
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}
            />
            <Area
              type='monotone'
              dataKey='units'
              stroke='#669900'
              strokeWidth={2}
              fill='url(#usageTrendFill)'
            />
            <Line type='monotone' dataKey='units' stroke='#669900' strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
