import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

interface GasPurchaseMetadata {
  meterId: string;
  kgPurchased: string;
  gasPricePerKg: string;
}

interface PaystackWebhookMetadata {
  amount: number;
  status: string;
  channel: string;
  currency: string;
  reference: string;
  gateway_response: string;
  paid_at: string;
  metadata: GasPurchaseMetadata;
  customer: Record<string, unknown>;
  authorization: Record<string, unknown>;
  [key: string]: unknown;
}

export type TransactionMetadata = GasPurchaseMetadata | PaystackWebhookMetadata;

export interface Transaction {
  id: string;
  userId: string;
  walletId: string | null;
  amount: string;
  type: string;
  status: string;
  reference: string;
  provider: string;
  description: string;
  metadata: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extracts kgPurchased from either metadata shape:
 *  - Simple:   { kgPurchased, meterId, gasPricePerKg }
 *  - Paystack: { metadata: { kgPurchased, ... }, ... }
 */
export const getKgPurchased = (metadata: TransactionMetadata): string | null => {
  if ('kgPurchased' in metadata && typeof metadata.kgPurchased === 'string') {
    return metadata.kgPurchased;
  }
  if ('metadata' in metadata && metadata.metadata && typeof metadata.metadata === 'object') {
    const nested = metadata.metadata as unknown as Record<string, unknown>;
    if (typeof nested.kgPurchased === 'string') return nested.kgPurchased;
  }
  return null;
};

interface TransactionsResponse {
  status: string;
  message: string;
  data: {
    transactions: Transaction[];
    total?: number;
    page?: number;
    limit?: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface TransactionStatsResponse {
  status: string;
  message: string;
  data: {
    totalSpentAllTime: string;
    totalSpentLast30d: string;
    totalTransactions: number;
    percentageIncreasePastMonth: number;
    totalGasPurchasedKgLast30d: string;
  };
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionStats {
  totalSpentAllTime: string;
  totalSpentLast30d: string;
  totalTransactions: number;
  percentageIncreasePastMonth: number;
  totalGasPurchasedKgLast30d: string;
}

export interface TransactionsData {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetTransactions = (filters: TransactionFilters = {}) => {
  const meterId = useMeterId();

  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.type) params.set('type', filters.type);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.minAmount) params.set('minAmount', String(filters.minAmount));
  if (filters.maxAmount) params.set('maxAmount', String(filters.maxAmount));

  return useQuery<TransactionsData>({
    queryKey: ['transactions', meterId, filters],
    queryFn: async () => {
      const { data } = await http.get<TransactionsResponse>(
        `/transactions/mine?${params.toString()}`,
      );
      const payload = data.data;
      const pagination = payload.pagination;
      const total = pagination?.total ?? payload.total ?? 0;
      const page = pagination?.page ?? payload.page ?? 1;
      const limit = pagination?.limit ?? payload.limit ?? filters.limit ?? 20;
      const totalPages =
        pagination?.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

      return {
        transactions: payload.transactions ?? [],
        total,
        page,
        limit,
        totalPages,
      };
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};

export const useGetTransactionsInfinite = (filters: TransactionFilters = {}) => {
  const meterId = useMeterId();

  const baseLimit = filters.limit ?? 20;

  return useInfiniteQuery<TransactionsData>({
    queryKey: ['transactions-infinite', meterId, { ...filters, page: undefined }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set('page', String(pageParam));
      params.set('limit', String(baseLimit));
      if (filters.status) params.set('status', filters.status);
      if (filters.type) params.set('type', filters.type);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.minAmount) params.set('minAmount', String(filters.minAmount));
      if (filters.maxAmount) params.set('maxAmount', String(filters.maxAmount));

      const { data } = await http.get<TransactionsResponse>(
        `/transactions/mine?${params.toString()}`,
      );

      const payload = data.data;
      const pagination = payload.pagination;
      const total = pagination?.total ?? payload.total ?? 0;
      const page = pagination?.page ?? Number(pageParam) ?? 1;
      const limit = pagination?.limit ?? payload.limit ?? baseLimit;
      const totalPages =
        pagination?.totalPages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

      return {
        transactions: payload.transactions ?? [],
        total,
        page,
        limit,
        totalPages,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};

export const useGetTransactionStats = () => {
  const meterId = useMeterId();

  return useQuery<TransactionStats>({
    queryKey: ['transactions-stats', meterId],
    queryFn: async () => {
      const { data } = await http.get<TransactionStatsResponse>('/transactions/stats');
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
