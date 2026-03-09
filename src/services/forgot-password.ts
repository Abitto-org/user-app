import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { http } from '@/services/http';
import type { AxiosError } from 'axios';

export const OTP_TYPES = {
  SIGNUP_VERIFICATION: 'signup_verification',
  LOGIN_DEVICE_VERIFICATION: 'login_device_verification',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_TRANSACTION_PIN: 'reset_transaction_pin',
  UPDATE_TRANSACTION_PIN: 'update_transaction_pin',
  DISABLE_MFA: 'disable_mfa',
  ADMIN_UPDATE_ASSET_FEES: 'admin_update_asset_fees',
  UPDATE_USER_PROFILE: 'update_user_profile',
  GAS_GIFTING_AUTHORIZATION: 'gas_gifting_authorization',
} as const;

export type OtpType = (typeof OTP_TYPES)[keyof typeof OTP_TYPES];

interface ApiError {
  message: string;
}

interface AuthResponse {
  status: string;
  message: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordVerifyPayload {
  email: string;
  otp: string;
  type: OtpType;
}

interface ForgotPasswordVerifyResponse {
  status: string;
  message: string;
  data: {
    type: string;
    validated: boolean;
    token: string;
  };
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const useForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<AuthResponse, AxiosError<ApiError>, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<AuthResponse>('/auth/forgot-password', payload);
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to initiate password reset. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

export const useVerifyForgotPasswordOtp = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<
    ForgotPasswordVerifyResponse,
    AxiosError<ApiError>,
    ForgotPasswordVerifyPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await http.post<ForgotPasswordVerifyResponse>(
        '/otp/verify',
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'OTP verification failed. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

export const useResetPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation<AuthResponse, AxiosError<ApiError>, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<AuthResponse>('/auth/reset-password', payload);
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to reset password. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

