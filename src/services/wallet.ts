import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

interface WalletBalanceResponse {
  status: string;
  message: string;
  data: {
    balance: string;
    currency: string;
  };
}

export interface WalletBalance {
  balance: string;
  currency: string;
}

export const useGetWalletBalance = () => {
  const meterId = useMeterId();

  return useQuery<WalletBalance>({
    queryKey: ['wallet-balance', meterId],
    queryFn: async () => {
      const { data } = await http.get<WalletBalanceResponse>('/wallet/balance');
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
