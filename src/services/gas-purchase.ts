import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { http } from '@/services/http';
import type { AxiosError } from 'axios';

interface ApiError {
  message: string;
}

// ── Initialize Gas Purchase ──

interface InitializeGasPurchasePayload {
  amount: string | number;
  meterId: string;
}

export interface InitializeGasPurchaseData {
  authorizationUrl: string;
  reference: string;
  kgPurchased: number;
}

interface InitializeGasPurchaseResponse {
  status: string;
  message: string;
  data: InitializeGasPurchaseData;
}

export const useInitializeGasPurchase = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<
    InitializeGasPurchaseResponse,
    AxiosError<ApiError>,
    InitializeGasPurchasePayload
  >({
    mutationFn: async (payload) => {
      const { data } = await http.post<InitializeGasPurchaseResponse>(
        '/gas-purchase/initialize',
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to initialize purchase. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

// ── Gas Purchase Status ──

export interface GasPurchaseStatus {
  reference: string;
  paymentStatus: string;
  purchaseStatus: string;
  amount: number;
  kgPurchased: string;
  meterNumber: string;
  mqttCommandSent: boolean;
  refillStartedAt: string | null;
  refillCompletedAt: string | null;
  kgDispensed: string | null;
  createdAt: string;
}

interface GasPurchaseStatusResponse {
  status: string;
  message: string;
  data: GasPurchaseStatus;
}

export const useGetPurchaseStatus = (reference: string) => {
  return useQuery<GasPurchaseStatus>({
    queryKey: ['purchase-status', reference],
    queryFn: async () => {
      const { data } = await http.get<GasPurchaseStatusResponse>(
        `/gas-purchase/status/${reference}`,
      );
      return data.data;
    },
    enabled: !!reference,
    refetchInterval: (query) => {
      const status = query.state.data?.paymentStatus;
      if (status === 'SUCCESS' || status === 'FAILED') return false;
      return 5000;
    },
  });
};
