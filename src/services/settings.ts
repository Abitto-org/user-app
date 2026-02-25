import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

interface PricePerKgResponse {
  status: string;
  message: string;
  data: {
    gasPricePerKg: string;
    currency: string;
  };
}

export interface PricePerKg {
  gasPricePerKg: string;
  currency: string;
}

export const useGetPricePerKg = () => {
  const meterId = useMeterId();

  return useQuery<PricePerKg>({
    queryKey: ['price-per-kg', meterId],
    queryFn: async () => {
      const { data } = await http.get<PricePerKgResponse>('/settings/price-per-kg');
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
