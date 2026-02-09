import { pxToRem } from '@/util/font';
import { Box, Button, Typography } from '@mui/material';

import upIcon from '@/assets/icons/up-icon.svg';

export const DashboardHeader = () => {
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent='space-between'
      gap={2}
      mb={2}
    >
      <Typography
        fontWeight='bold'
        letterSpacing={-2}
        fontSize={{ xs: pxToRem(28), sm: pxToRem(34), md: pxToRem(40) }}
      >
        Welcome, chibueze
      </Typography>
      <Box display='flex' gap={1} flexShrink={0}>
        <Button variant='text' size='small'>
          Link New Meter
        </Button>
        <Button variant='contained' size='small' endIcon={<img src={upIcon} />}>
          Buy gas
        </Button>
      </Box>
    </Box>
  );
};
