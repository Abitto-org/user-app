import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { http } from '@/services/http';
import type { AxiosError } from 'axios';

interface ApiError {
  message?: string;
}

interface GiftGasPayload {
  sourceMeterId: string;
  recipientMeterNumber: string;
  amountKg: number;
  otp: string;
}

interface GiftGasResponse {
  status: string;
  message: string;
  data?: Record<string, unknown>;
}

interface SendGiftOtpPayload {
  email: string;
  type: 'gas_gifting_authorization';
}

interface SendGiftOtpResponse {
  status: string;
  message: string;
  data?: Record<string, unknown>;
}

export const useGiftGas = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<GiftGasResponse, AxiosError<ApiError>, GiftGasPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<GiftGasResponse>('/meter/gift', payload);
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'Gift transfer completed 🎉', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to complete gas gifting.',
        { variant: 'error' },
      );
    },
  });
};

export const useSendGiftGasOtp = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<SendGiftOtpResponse, AxiosError<ApiError>, SendGiftOtpPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<SendGiftOtpResponse>('/otp/generate', payload);
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'OTP sent for gift authorization ✅', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || 'OTP authorization failed. Please try again.',
        { variant: 'error' },
      );
    },
  });
};
