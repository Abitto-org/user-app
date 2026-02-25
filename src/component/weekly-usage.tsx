import { Box, Stack, Typography } from '@mui/material';
import {
  Line,
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import upIcon from '@/assets/icons/up-icon.svg';
import { useGetMeterStats } from '@/services/meters';

const dayName = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-NG', { weekday: 'short' });

const formatUnits = (value: number | undefined) =>
  `${(value ?? 0).toLocaleString('en-NG', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  })} kg`;

export const WeeklyUsage = () => {
  const { data: meterStats } = useGetMeterStats();
  const chartData =
    meterStats?.weeklyGraphData?.map((item) => ({
      day: dayName(item.date),
      units: item.total,
    })) ?? [];
  return (
    <Box
      bgcolor='white'
      borderRadius='8px'
      p={3}
      height='100%'
      width='100%'
      display='flex'
      flexDirection='column'
    >
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        mb={2}
      >
        <Box>
          <Typography
            variant='h6'
            fontWeight={600}
            sx={{
              mb: 0.5,
            }}
          >
            Weekly Usage
          </Typography>
          <Stack direction='row' alignItems='center' gap={0.5} mt={0.5}>
            <img src={upIcon} alt='up' />
            <Typography variant='body2' color='text.secondary'>
              {(meterStats?.weeklyChangePercentage ?? 0).toLocaleString('en-NG', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
              % VS Last Week
            </Typography>
          </Stack>
        </Box>
        <Stack direction='row' alignItems='center' gap={2}>
          <Box>
            <Typography
              variant='body2'
              color='text.secondary'
              textAlign='right'
            >
              {formatUnits(meterStats?.usedThisWeek)}
            </Typography>
            <Typography
              variant='caption'
              color='text.secondary'
              textAlign='right'
            >
              This Week
            </Typography>
          </Box>
          <Box width='1px' height='30px' bgcolor='#E0E0E0' />
          <Box>
            <Typography
              variant='body2'
              color='text.secondary'
              textAlign='right'
            >
              {formatUnits(meterStats?.usedToday)}
            </Typography>
            <Typography
              variant='caption'
              color='text.secondary'
              textAlign='right'
            >
              Today
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box width='100%' flex={1} height={250} mt={2}>
        <ResponsiveContainer width='100%' height={250}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id='colorUnits' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#669900' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#669900' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#F0F0F0'
              vertical={false}
            />
            <XAxis
              dataKey='day'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              width={40}
            />
            <Tooltip
              formatter={(value: number | string | undefined) => [
                `${Number(value ?? 0).toLocaleString('en-NG', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 3,
                })} Units`,
                'Usage',
              ]}
              labelFormatter={(label) => `Day: ${label}`}
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
              fill='url(#colorUnits)'
            />
            <Line
              type='monotone'
              dataKey='units'
              stroke='#669900'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#669900' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
