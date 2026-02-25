import { Box, Button, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { MeterSelector } from '@/shared/meter-selector';

export const UsageHeader = () => {
  return (
    <Box
      display='flex'
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent='space-between'
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={2}
      mb={2}
    >
      <Box>
        <Typography variant='h4' fontWeight={700} mb={1}>
          Gas Usage
        </Typography>
        <MeterSelector />
      </Box>

      <Box display='flex' gap={1.5} width={{ xs: '100%', md: 'auto' }}>
        <Button
          variant='outlined'
          startIcon={<TuneIcon />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            color: '#555',
            borderColor: '#DDD',
          }}
        >
          Filter
        </Button>
        <Button
          variant='contained'
          endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
          sx={{ whiteSpace: 'nowrap', px: 3 }}
        >
          Export Report
        </Button>
      </Box>
    </Box>
  );
};
