import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';

export interface Meter {
  id: string;
  deviceId: string;
  status: string;
  userId: string;
  valveStatus: boolean;
  meterNumber: string;
  estateId: string;
  houseNumber: string;
  estateName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MetersResponse {
  status: string;
  message: string;
  data: {
    meters: Meter[];
    count: number;
  };
}

export const useGetMeters = () => {
  return useQuery<Meter[]>({
    queryKey: ['meters'],
    queryFn: async () => {
      const { data } = await http.get<MetersResponse>('/meter');
      return data.data.meters;
    },
    enabled: !!localStorage.getItem('token'),
  });
};
