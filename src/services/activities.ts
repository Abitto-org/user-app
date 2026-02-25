import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

interface GasUsageMetadata {
  timestamp: string;
  requestedUsage: string;
}

interface TransactionActivityMetadata {
  meterId: string;
  kgPurchased: string;
  gasPricePerKg: string;
}

export interface GasUsageActivity {
  id: string;
  type: 'GAS_USAGE';
  kgUsed: string;
  deviceId: string;
  previousBalance: string;
  newBalance: string;
  createdAt: string;
  metadata: GasUsageMetadata;
}

export interface TransactionActivity {
  id: string;
  type: 'TRANSACTION';
  activityType: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  metadata: TransactionActivityMetadata;
}

export type RecentActivity = GasUsageActivity | TransactionActivity;

export const isTransactionActivity = (
  activity: RecentActivity,
): activity is TransactionActivity => activity.type === 'TRANSACTION';

export const isGasUsageActivity = (
  activity: RecentActivity,
): activity is GasUsageActivity => activity.type === 'GAS_USAGE';

export const formatActivityType = (type: string) =>
  type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const formatActivityAmount = (amount: number) =>
  `₦${(amount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export const formatActivityDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (sameDay) return `Today, ${time}`;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}, ${time}`;
};

export const truncateId = (id: string) => `#${id.slice(0, 8)}`;

export const formatKg = (value: string, withSign = false) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  const formatted = `${numeric.toLocaleString('en-NG', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}kg`;
  if (!withSign) return formatted;
  return numeric > 0 ? `+${formatted}` : formatted;
};

export const getStatusColor = (status: string) => {
  const key = status.toUpperCase();
  if (key === 'SUCCESS') return '#217C38';
  if (key === 'FAILED') return '#D32F2F';
  if (key === 'PENDING') return '#F9A825';
  return '#6B7280';
};

export const getStatusLabel = (status: string) =>
  status
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface RecentActivitiesResponse {
  status: string;
  message: string;
  data: RecentActivity[];
}

/**
 * Fetch recent user activities for the currently selected meter.
 * meterId is read from the URL path param via useMeterId().
 */
export const useGetRecentActivities = () => {
  const meterId = useMeterId();

  return useQuery<RecentActivity[]>({
    queryKey: ['recent-activities', meterId],
    queryFn: async () => {
      const { data } = await http.get<RecentActivitiesResponse>(
        '/user/profile/activities',
        { params: { meterId } },
      );
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
