import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface DashboardProfileHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardProfileHeader = ({
  onMenuToggle,
}: DashboardProfileHeaderProps) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      width='100%'
      bgcolor='white'
      p={2}
      position='sticky'
      top={0}
      zIndex={10}
    >
      {/* Hamburger — only rendered when onMenuToggle is provided (mobile) */}
      {onMenuToggle ? (
        <IconButton onClick={onMenuToggle} edge='start'>
          <MenuIcon />
        </IconButton>
      ) : (
        <Box />
      )}

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
