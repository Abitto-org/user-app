import { pxToRem } from '@/util/font';
import { Box, Button, Typography } from '@mui/material';

import upIcon from '@/assets/icons/up-icon.svg';

export const DashboardHeader = () => {
  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
    >
      <Typography fontWeight='bold' letterSpacing={-2} fontSize={pxToRem(40)}>
        Welcome, chibueze
      </Typography>
      <Box>
        <Button variant='text'>Link New Meter</Button>
        <Button variant='contained' endIcon={<img src={upIcon} />}>
          Buy gas
        </Button>
      </Box>
    </Box>
  );
};
