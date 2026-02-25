import { useMemo, type UIEventHandler } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationsUnreadCount,
  type NotificationItem,
} from '@/services/notifications';
import { pxToRem } from '@/util/font';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const getTitle = (item: NotificationItem) => {
  if (item.title?.trim()) return item.title;
  if (String(item.category).toUpperCase().includes('PAYMENT')) {
    return 'Payment Successful';
  }
  if (String(item.category).toUpperCase().includes('GAS')) return 'Gas Update';
  return 'Notification';
};

const getMessage = (item: NotificationItem) => {
  if (typeof item.description === 'string' && item.description.trim()) {
    return item.description;
  }
  if (typeof item.message === 'string' && item.message.trim()) return item.message;
  return 'You have a new account update.';
};

const getVisual = (item: NotificationItem) => {
  const title = getTitle(item).toUpperCase();
  const category = String(item.category ?? '').toUpperCase();

  if (title.includes('EXHAUSTED')) {
    return {
      icon: <WarningAmberRoundedIcon sx={{ color: '#DC6803', fontSize: 20 }} />,
      emoji: '⛔',
      bg: '#FFFAEB',
    };
  }

  if (title.includes('SUCCESS') || title.includes('CREDIT')) {
    return {
      icon: <PaymentsOutlinedIcon sx={{ color: '#15803D', fontSize: 20 }} />,
      emoji: '✅',
      bg: '#ECFDF3',
    };
  }

  if (category.includes('GAS')) {
    return {
      icon: <LocalGasStationOutlinedIcon sx={{ color: '#669900', fontSize: 20 }} />,
      emoji: '🔥',
      bg: '#F7FBEF',
    };
  }

  return {
    icon: <InboxOutlinedIcon sx={{ color: '#667085', fontSize: 20 }} />,
    emoji: '🔔',
    bg: '#F2F4F7',
  };
};

export const NotificationsDrawer = ({ open, onClose }: NotificationsDrawerProps) => {
  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useNotifications({ initialLimit: 10, initialIsRead: false, enabled: open });
  const { data: unreadCount = 0 } = useNotificationsUnreadCount();
  const { mutate: markAllRead, isPending: markAllPending } =
    useMarkAllNotificationsRead();
  const { mutate: markOneRead } = useMarkNotificationRead();
  const items = useMemo(() => notifications, [notifications]);

  const hasMore = useMemo(
    () => Boolean(hasNextPage),
    [hasNextPage],
  );

  const handleMarkAllRead = () => {
    markAllRead(undefined, {
      onSuccess: () => {
        // Query invalidation in hook refreshes the first page.
      },
    });
  };

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const el = event.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120 && hasMore && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 440 } } }}
    >
      <Box display='flex' flexDirection='column' height='100%'>
        <Box display='flex' justifyContent='flex-end' p={2}>
          <IconButton onClick={onClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Box px={3} pb={2} borderBottom='1px solid #EFEFEF'>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                Notification
              </Typography>
              <Typography variant='body2' color='text.secondary' mt={0.5}>
                Stay updated with your account activities
              </Typography>
            </Box>
            {unreadCount > 0 && (
              <Button
                size='small'
                variant='text'
                onClick={handleMarkAllRead}
                disabled={markAllPending}
                sx={{ fontWeight: 700 }}
              >
                {markAllPending ? 'Marking...' : 'Mark all read'}
              </Button>
            )}
          </Box>
        </Box>

        <Box flex={1} overflow='auto' onScroll={handleScroll}>
          {isLoading ? (
            <Box p={2.5}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Box key={`notif-skeleton-${index}`} display='flex' gap={1.5} mb={2.5}>
                  <Skeleton variant='circular' width={36} height={36} />
                  <Box width='100%'>
                    <Skeleton width='50%' height={24} />
                    <Skeleton width='95%' height={18} />
                    <Skeleton width='80%' height={18} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : items.length === 0 ? (
            <Box
              height='100%'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap={1}
              p={3}
            >
              <InboxOutlinedIcon sx={{ color: '#98A2B3', fontSize: 28 }} />
              <Typography color='text.secondary'>No notifications yet.</Typography>
            </Box>
          ) : (
            <Box>
              {items.map((item) => (
                (() => {
                  const visual = getVisual(item);
                  return (
                    <Box
                      key={item.id}
                      display='flex'
                      alignItems='flex-start'
                      gap={1.5}
                      px={3}
                      py={2.25}
                      borderBottom='1px solid #F2F4F7'
                      sx={{
                        cursor: item.isRead ? 'default' : 'pointer',
                        bgcolor: item.isRead ? 'transparent' : '#FCFCFD',
                      }}
                      onClick={() => {
                        if (item.isRead) return;
                        markOneRead(
                          { id: item.id },
                          undefined,
                        );
                      }}
                    >
                      <Box
                        mt={0.25}
                        width={34}
                        height={34}
                        borderRadius='50%'
                        bgcolor={visual.bg}
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                      >
                        {visual.icon}
                      </Box>
                      <Box>
                        <Typography fontWeight={700} fontSize={pxToRem(16)}>
                          {getTitle(item)} {visual.emoji}
                        </Typography>
                        <Typography
                          color='#535862'
                          fontSize={pxToRem(14)}
                          lineHeight={1.35}
                        >
                          {getMessage(item)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()
              ))}

              {isFetchingNextPage && hasMore && (
                <Box display='flex' justifyContent='center' py={2}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
