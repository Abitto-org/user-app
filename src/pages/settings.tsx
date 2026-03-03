import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { useGetProfile } from '@/services/profile';
import { useGetMeters, useGetMetersDetails } from '@/services/meters';

const ProfileValue = ({
  label,
  value,
  showEdit = true,
}: {
  label: string;
  value: string;
  showEdit?: boolean;
}) => (
  <Box>
    <Typography fontWeight={600} mb={0.6}>
      {label}
    </Typography>
    <Box
      border='1px solid #EAECF0'
      borderRadius='10px'
      px={1.8}
      py={1.3}
      display='flex'
      justifyContent='space-between'
      alignItems='center'
    >
      <Typography fontWeight={600}>{value}</Typography>
      {showEdit ? (
        <Typography color='primary' fontWeight={700} fontSize={13}>
          Edit
        </Typography>
      ) : (
        <Stack direction='row' alignItems='center' gap={0.6}>
          <VerifiedIcon sx={{ color: '#15803D', fontSize: 16 }} />
          <Typography color='#15803D' fontWeight={700} fontSize={13}>
            Verified
          </Typography>
        </Stack>
      )}
    </Box>
  </Box>
);

export const Settings = () => {
  const { data: user, isLoading: userLoading } = useGetProfile();
  const { data: meters = [], isLoading: metersLoading } = useGetMeters();
  const meterIds = meters.map((m) => m.id);
  const { data: meterDetails, isLoading: meterDetailsLoading } = useGetMetersDetails(meterIds);

  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  return (
    <Box>
      <Typography variant='h4' fontWeight={700}>
        Settings
      </Typography>
      <Typography color='text.secondary' mt={0.5} mb={2.5}>
        Get answers and support for your gas account
      </Typography>

      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='12px' p={2.2} mb={2}>
        <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} flexWrap='wrap'>
          <Box display='flex' alignItems='center' gap={1.6}>
            <Box
              width={44}
              height={44}
              borderRadius='50%'
              bgcolor='#3266CC'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Typography color='white' fontWeight={700}>
                {initials}
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={28 / 16 + 'rem'}>
                {userLoading ? 'Loading...' : fullName}
              </Typography>
              <Typography color='text.secondary'>{user?.email ?? '--'}</Typography>
            </Box>
          </Box>
          <Stack direction='row' gap={1}>
            <Button variant='text'>Change Password</Button>
            <Button variant='contained' endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}>
              Edit Profile
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='12px' p={2.2} mb={2}>
        <Typography variant='h6' fontWeight={700}>
          Connected Meters
        </Typography>
        <Typography color='text.secondary' mb={2}>
          Active meters linked to your account
        </Typography>

        {metersLoading || meterDetailsLoading ? (
          <Box display='grid' gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Box key={idx} border='1px solid #EAECF0' borderRadius='10px' p={1.6}>
                <Skeleton height={22} width='50%' />
                <Skeleton height={18} width='40%' />
                <Skeleton height={18} width='70%' />
                <Skeleton height={18} width='90%' />
              </Box>
            ))}
          </Box>
        ) : meterDetails.length === 0 ? (
          <Box
            py={4}
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
            gap={1}
            border='1px dashed #EAECF0'
            borderRadius='10px'
          >
            <InboxOutlinedIcon sx={{ color: '#98A2B3', fontSize: 26 }} />
            <Typography color='text.secondary'>No connected meters found.</Typography>
          </Box>
        ) : (
          <Box display='grid' gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            {meterDetails.map((item) => (
              <Box key={item.meter.id} border='1px solid #EAECF0' borderRadius='10px' p={1.6}>
                <Box bgcolor='#F9FAFB' borderRadius='8px' px={1.2} py={0.8} mb={1}>
                  <Typography fontWeight={700}>{item.meter.meterNumber}</Typography>
                </Box>
                <Typography variant='caption' color='text.secondary'>
                  User Name
                </Typography>
                <Typography fontWeight={600} mb={1}>
                  {`${item.user.firstName ?? ''} ${item.user.lastName ?? ''}`.trim() || 'N/A'}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Address
                </Typography>
                <Typography fontWeight={600}>
                  {[item.estate.address, item.estate.city, item.estate.state]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='12px' p={2.2}>
        <Typography variant='h6' fontWeight={700}>
          Personal Details
        </Typography>
        <Typography color='text.secondary' mb={2}>
          Manage your profile information
        </Typography>

        <Box display='grid' gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
          <ProfileValue label='First Name' value={user?.firstName ?? '--'} />
          <ProfileValue label='Last Name' value={user?.lastName ?? '--'} />
          <ProfileValue label='Email Address' value={user?.email ?? '--'} />
          <ProfileValue label='Phone Number' value={user?.phoneNumber ?? '--'} />
          <ProfileValue label='NIN' value={user?.nin ?? '--'} showEdit={false} />
        </Box>
      </Box>
    </Box>
  );
};
