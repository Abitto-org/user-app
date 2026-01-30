import { Avatar, Box, Typography } from '@mui/material';

export const DashboardProfileHeader = () => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      width='100%'
      bgcolor='white'
      p={2}
      position='sticky'

    >
      <Box display='flex' alignItems='center' gap={1}>
        <Avatar
          sx={{
            bgcolor: '#3266CC',
          }}
        >
          CS
        </Avatar>
        <Box>
          <Typography
            variant='subtitle1'
            fontWeight={600}
            textTransform='capitalize'
          >
            chibueze samuel
          </Typography>
          <Box bgcolor='#6699001A' borderRadius='32px' px={2}>
            <Typography
              textTransform='uppercase'
              fontWeight={600}
              color='secondary'
            >
              msw123456967
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
