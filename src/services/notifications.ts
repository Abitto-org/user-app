import { useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'GAS_PURCHASE' | 'PAYMENT' | 'SYSTEM' | string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface NotificationsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface NotificationsResponse {
  status: string;
  message: string;
  data: {
    notifications: NotificationItem[];
    pagination: NotificationsPagination;
  };
}

interface ApiResponse {
  status: string;
  message: string;
}

interface UnreadCountResponse {
  status: string;
  message: string;
  data: {
    count: number;
  };
}

interface MarkAllReadResponse {
  status: string;
  message: string;
  data: {
    count: number;
  };
}

interface UseNotificationsOptions {
  initialLimit?: number;
  initialIsRead?: boolean;
  enabled?: boolean;
}

const buildNotificationsQueryKey = (
  meterId: string | null,
  limit: number,
  isRead: boolean,
) => ['notifications', meterId, limit, isRead] as const;

/**
 * Notifications hook with built-in pagination state + setters.
 * Endpoint: /notifications?page=1&limit=10&isRead=true
 */
export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const meterId = useMeterId();
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [isRead, setIsRead] = useState<boolean>(options.initialIsRead ?? false);
  const isEnabled =
    (options.enabled ?? true) && !!localStorage.getItem('token') && !!meterId;

  const query = useInfiniteQuery<NotificationsResponse['data']>({
    queryKey: buildNotificationsQueryKey(meterId, limit, isRead),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await http.get<NotificationsResponse>('/notifications', {
        params: { page: pageParam, limit, isRead },
      });
      return data.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: isEnabled,
  });

  const setPagination = (next: {
    limit?: number;
    isRead?: boolean;
  }) => {
    if (typeof next.limit === 'number') setLimit(next.limit);
    if (typeof next.isRead === 'boolean') setIsRead(next.isRead);
  };

  const notifications =
    query.data?.pages.flatMap((entry) => entry.notifications) ?? [];
  const pagination = query.data?.pages.at(-1)?.pagination;

  return {
    ...query,
    notifications,
    pagination,
    limit,
    isRead,
    setLimit,
    setIsRead,
    setPagination,
  };
};

export const useNotificationsUnreadCount = () => {
  const meterId = useMeterId();

  return useQuery<number>({
    queryKey: ['notifications-unread-count', meterId],
    queryFn: async () => {
      const { data } = await http.get<UnreadCountResponse>(
        '/notifications/unread-count',
      );
      return data.data.count;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};

export const useMarkAllNotificationsRead = () => {
  const meterId = useMeterId();
  const queryClient = useQueryClient();

  return useMutation<MarkAllReadResponse, Error>({
    mutationFn: async () => {
      const { data } = await http.patch<MarkAllReadResponse>(
        '/notifications/mark-all-read',
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', meterId] });
      queryClient.invalidateQueries({
        queryKey: ['notifications-unread-count', meterId],
      });
    },
  });
};

export const useMarkNotificationRead = () => {
  const meterId = useMeterId();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const { data } = await http.patch<ApiResponse>(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', meterId] });
      queryClient.invalidateQueries({
        queryKey: ['notifications-unread-count', meterId],
      });
    },
  });
};
