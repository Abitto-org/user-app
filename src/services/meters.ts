import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';

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
  availableGasKg: string;
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

interface SingleMeterResponse {
  status: string;
  message: string;
  data: Meter;
}

/**
 * Fetch a single meter by ID.
 * If no `id` is passed, falls back to the meterId from the URL path.
 */
export const useGetMeter = (id?: string) => {
  const urlMeterId = useMeterId();
  const meterId = id ?? urlMeterId;

  return useQuery<Meter>({
    queryKey: ['meter', meterId],
    queryFn: async () => {
      const { data } = await http.get<SingleMeterResponse>(
        `/meter/details/${meterId}`,
      );
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
