import { Box, Button, Typography } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { pxToRem } from '@/util/font';

export const HelpHeader = () => {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems={{ xs: 'flex-start', md: 'center' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={2}
      mb={2}
    >
      <Box>
        <Typography fontWeight='bold'
          letterSpacing={0}
          fontSize={{ xs: pxToRem(28), sm: pxToRem(34), md: pxToRem(32) }}
          textTransform='capitalize' lineHeight={1.15}>
          Help Center
        </Typography>
        <Typography mt={0.5} color='text.secondary' fontSize={pxToRem(16)}>
          Get answers and support for your gas account
        </Typography>
      </Box>

      <Button
        variant='contained'
        endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
        sx={{ px: 3, whiteSpace: 'nowrap' }}
      >
        Open A Case
      </Button>
    </Box>
  );
};
