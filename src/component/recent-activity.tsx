import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

import depositIcon from '@/assets/icons/deposit-icon.svg';
import { useMeterId } from '@/hooks/use-meter-id';
import {
  formatActivityAmount,
  formatActivityDateTime,
  formatActivityType,
  formatKg,
  getStatusColor,
  getStatusLabel,
  isTransactionActivity,
  truncateId,
  useGetRecentActivities,
} from '@/services/activities';

export const RecentActivity = () => {
  const navigate = useNavigate();
  const meterId = useMeterId();
  const { data: recentActivity = [], isLoading } = useGetRecentActivities();
  const activities = recentActivity.slice(0, 5);

  const handleViewAll = () => {
    if (meterId) {
      navigate(`/${meterId}/transactions`);
    }
  };

  return (
    <Box
      bgcolor='white'
      borderRadius='12px'
      border='1px solid #EBECEF'
      p={2.5}
      height='100%'
      width='100%'
    >
      <Stack direction='row' width='full' justifyContent='space-between'>
        <Typography
          textTransform='capitalize'
          variant='subtitle1'
          fontWeight={700}
        >
          recent activity
        </Typography>
        <Typography
          onClick={handleViewAll}
          sx={{ cursor: meterId ? 'pointer' : 'default' }}
          color='#669900'
          letterSpacing={-1}
          variant='subtitle1'
          fontWeight={700}
        >
          View all
        </Typography>
      </Stack>

      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={`skeleton-${index}`}
            display='flex'
            alignItems='center'
            mt={2}
            justifyContent='space-between'
          >
            <Box display='flex' gap={1} alignItems='center'>
              <Skeleton variant='circular' width={20} height={20} />
              <Box>
                <Skeleton width={140} height={22} />
                <Skeleton width={180} height={18} />
              </Box>
            </Box>
            <Box>
              <Skeleton width={90} height={22} />
              <Skeleton width={70} height={18} />
            </Box>
          </Box>
        ))}

      {!isLoading &&
        activities.map((activity) => {
          const title = isTransactionActivity(activity)
            ? formatActivityType(activity.activityType)
            : 'Gas Usage';

          const subtitle = `${formatActivityDateTime(activity.createdAt)} - ${truncateId(
            activity.id,
          )}`;

          const primaryValue = isTransactionActivity(activity)
            ? formatActivityAmount(activity.amount)
            : formatKg(activity.kgUsed, true);

          const secondaryValue = isTransactionActivity(activity)
            ? getStatusLabel(activity.status)
            : `Bal: ${formatKg(activity.newBalance)}`;

          const secondaryColor = isTransactionActivity(activity)
            ? getStatusColor(activity.status)
            : '#217C38';

          return (
            <Box
              key={activity.id}
              display='flex'
              alignItems='flex-start'
              mt={2}
              justifyContent='space-between'
              pb={1.5}
              borderBottom='1px solid #F2F4F7'
            >
              <Box display='flex' gap={1.25}>
                <Box
                  mt={0.25}
                  width={28}
                  height={28}
                  borderRadius='50%'
                  bgcolor='#F2F4F7'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <img src={depositIcon} />
                </Box>
                <Box>
                  <Typography
                    variant='body1'
                    fontWeight={700}
                    textTransform='capitalize'
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant='caption'
                    letterSpacing={0}
                    color='#667085'
                  >
                    {subtitle}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant='body2'
                  textAlign='right'
                  fontWeight={700}
                  letterSpacing={0}
                >
                  {primaryValue}
                </Typography>
                <Typography
                  variant='caption'
                  color={secondaryColor}
                  fontWeight={600}
                  letterSpacing={0}
                  textAlign='right'
                >
                  {secondaryValue}
                </Typography>
              </Box>
            </Box>
          );
        })}

      {!isLoading && activities.length === 0 && (
        <Box
          mt={3}
          display='flex'
          flexDirection='column'
          alignItems='center'
          gap={1}
          py={2}
        >
          <InboxOutlinedIcon sx={{ color: '#98A2B3', fontSize: 24 }} />
          <Typography variant='body2' color='text.secondary'>
            No recent activity yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
