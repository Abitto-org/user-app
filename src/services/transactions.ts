import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';

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
  metadata: {
    metdata: {
      meterId: string;
      kgPurchased: string;
      gasPricePerKg: string;
    };
    meterId: string;
    kgPurchased: string;
    gasPricePerKg: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TransactionsResponse {
  status: string;
  message: string;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
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

export const useGetTransactions = (filters: TransactionFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.type) params.set('type', filters.type);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.minAmount) params.set('minAmount', String(filters.minAmount));
  if (filters.maxAmount) params.set('maxAmount', String(filters.maxAmount));

  return useQuery<TransactionsResponse['data']>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await http.get<TransactionsResponse>(
        `/transactions/mine?${params.toString()}`,
      );
      return data.data;
    },
    enabled: !!localStorage.getItem('token'),
  });
};
