import { Box, Stack, Typography } from '@mui/material';

import depositIcon from '@/assets/icons/deposit-icon.svg';

export const RecentActivity = () => {
  return (
    <Box bgcolor='white' borderRadius='8px' p={2} height='100%' width='100%'>
      <Stack direction='row' width='full' justifyContent='space-between'>
        <Typography
          textTransform='capitalize'
          variant='subtitle1'
          fontWeight={600}
        >
          recent activity
        </Typography>
        <Typography
          color='#669900'
          letterSpacing={-1}
          variant='subtitle1'
          fontWeight={600}
        >
          View all
        </Typography>
      </Stack>

      {[1, 2, 3, 4, 5].map((_, index) => (
        <Box
          key={index}
          display='flex'
          alignItems='center'
          mt={2}
          justifyContent='space-between'
        >
          <Box display='flex' gap={1}>
            <img src={depositIcon} />
            <Box>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                textTransform='capitalize'
              >
                gas purchase
              </Typography>
              <Typography
                variant='subtitle2'
                letterSpacing={-0}
                textTransform='capitalize'
              >
                today, 2:34pm - TXN-78234
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              variant='subtitle1'
              textAlign='right'
              fontWeight={600}
              letterSpacing={-1}
            >
              ₦50.00
            </Typography>
            <Typography
              variant='subtitle1'
              color='#217C38'
              fontWeight={500}
              letterSpacing={-1}
              textAlign='right'
            >
              +25kg
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
