import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <Box bgcolor='white' borderRadius='8px' p={2} height='100%' width='100%'>
      <Stack direction='row' width='full' justifyContent='space-between'>
        <Typography
          textTransform='capitalize'
          variant='subtitle1'
          fontWeight={600}
        >
          recent activity
        </Typography>
        <Typography
          onClick={handleViewAll}
          sx={{ cursor: meterId ? 'pointer' : 'default' }}
          color='#669900'
          letterSpacing={-1}
          variant='subtitle1'
          fontWeight={600}
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
              alignItems='center'
              mt={2}
              justifyContent='space-between'
            >
              <Box display='flex' gap={1}>
                <img src={depositIcon} />
                <Box>
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    textTransform='capitalize'
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant='subtitle2'
                    letterSpacing={-1}
                    color='#414141'
                  >
                    {subtitle}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  variant='subtitle1'
                  textAlign='right'
                  fontWeight={600}
                  letterSpacing={-1}
                >
                  {primaryValue}
                </Typography>
                <Typography
                  variant='subtitle1'
                  color={secondaryColor}
                  fontWeight={500}
                  letterSpacing={-1}
                  textAlign='right'
                >
                  {secondaryValue}
                </Typography>
              </Box>
            </Box>
          );
        })}

      {!isLoading && activities.length === 0 && (
        <Box mt={3}>
          <Typography variant='body2' color='text.secondary'>
            No recent activity yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
