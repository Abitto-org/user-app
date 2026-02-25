import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useGetProfile } from '@/services/profile';
import { pxToRem } from '@/util/font';
import { useGetMeter } from '@/services/meters';
import copyIcon from '@/assets/icons/copy-icon.svg';
import { useSnackbar } from 'notistack';

interface DashboardProfileHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardProfileHeader = ({
  onMenuToggle,
}: DashboardProfileHeaderProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: user, isLoading } = useGetProfile();
  const { data } = useGetMeter();

  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  const username = user?.username ?? '';
  const meterNumber = data?.meterNumber ?? '';

  const handleCopyMeter = async () => {
    if (!meterNumber) return;
    try {
      await navigator.clipboard.writeText(meterNumber);
      enqueueSnackbar('Meter number copied', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to copy meter number', { variant: 'error' });
    }
  };

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
            <Avatar sx={{ bgcolor: '#3266CC', fontWeight: 'bold' }}>{initials}</Avatar>
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
              <Box
                bgcolor='#6699001A'
                width='fit-content'
                px={pxToRem(16)}
                py={pxToRem(6)}
                borderRadius='32px'
                display='flex'
                alignItems='center'
                gap={1}
              >
                <Typography fontWeight={600} fontSize={pxToRem(14)} color='primary'>
                  {meterNumber || '--'}
                </Typography>
                <IconButton
                  size='small'
                  onClick={handleCopyMeter}
                  disabled={!meterNumber}
                  sx={{ p: 0, borderRadius: 1 }}
                >
                  <img src={copyIcon} alt='Copy meter number' />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
