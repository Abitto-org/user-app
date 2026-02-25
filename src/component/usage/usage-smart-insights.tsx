import { Box, Typography } from '@mui/material';

const insightCards = [
  {
    title: 'Higher Usage Detected',
    description: 'Your gas usage was higher than usual this week',
    bg: '#F5F1DF',
    dot: '#7A4E1D',
    icon: '!',
  },
  {
    title: 'Refill Suggestion',
    description: 'At this rate, you may need a refill on your gas in 3-5 days',
    bg: '#E8EEF8',
    dot: '#1C4A98',
    icon: 'i',
  },
  {
    title: 'Usage Spike',
    description: 'There was an unusual use of your gas recently',
    bg: '#F7EDEE',
    dot: '#8E1E1A',
    icon: '~',
  },
];

export const UsageSmartInsights = () => {
  return (
    <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2.5} mb={2}>
      <Typography variant='h6' fontWeight={700}>
        Smart Insights
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={2}>
        Helpful highlights based on your current usage pattern.
      </Typography>

      <Box
        display='grid'
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
        gap={1.5}
      >
        {insightCards.map((item) => (
          <Box key={item.title} bgcolor={item.bg} borderRadius='8px' p={1.5}>
            <Box
              width={20}
              height={20}
              borderRadius='50%'
              bgcolor={item.dot}
              color='white'
              display='flex'
              alignItems='center'
              justifyContent='center'
              fontSize={12}
              mb={1}
            >
              {item.icon}
            </Box>
            <Typography fontWeight={700} fontSize={14} mb={0.5}>
              {item.title}
            </Typography>
            <Typography fontSize={13} color='#545454'>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
