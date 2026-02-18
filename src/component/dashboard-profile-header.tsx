import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useGetProfile } from '@/services/profile';

interface DashboardProfileHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardProfileHeader = ({
  onMenuToggle,
}: DashboardProfileHeaderProps) => {
  const { data: user, isLoading } = useGetProfile();

  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  const username = user?.username ?? '';

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
      {onMenuToggle ? (
        <IconButton onClick={onMenuToggle} edge='start'>
          <MenuIcon />
        </IconButton>
      ) : (
        <Box />
      )}

      <Box display='flex' alignItems='center' gap={1}>
        {isLoading ? (
          <>
            <Skeleton variant='circular' width={40} height={40} />
            <Box>
              <Skeleton width={120} height={22} />
              <Skeleton width={100} height={18} />
            </Box>
          </>
        ) : (
          <>
            <Avatar sx={{ bgcolor: '#3266CC' }}>{initials}</Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                textTransform='capitalize'
              >
                {fullName}
              </Typography>
              {username && (
                <Box bgcolor='#6699001A' borderRadius='32px' px={2}>
                  <Typography
                    textTransform='uppercase'
                    fontWeight={600}
                    color='secondary'
                  >
                    {username}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
