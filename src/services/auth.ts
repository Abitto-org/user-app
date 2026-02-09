import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { http } from '@/services/http';
import type { AxiosError } from 'axios';

// ── Shared types ──

interface ApiError {
  message: string;
}

interface AuthResponse {
  status: string;
  message: string;
}

// ── Register ──

interface RegisterPayload {
  email: string;
  password: string;
}

export const useRegister = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<AuthResponse>('/auth/signup', payload);
      return data;
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      navigate('/verify-otp', {
        state: { email: variables.email, type: 'signup_verification' },
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

// ── Login ──

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<AuthResponse>('/auth/signin', payload);
      return data;
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      navigate('/verify-otp', {
        state: { email: variables.email, type: 'login_device_verification' },
      });
    },
    onError: (error, variables) => {
      const message =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';

      if (message.toLowerCase().includes('email is not verified')) {
        enqueueSnackbar(message, { variant: 'warning' });
        navigate('/verify-otp', {
          state: { email: variables.email, type: 'signup_verification' },
        });
        return;
      }

      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

// ── Verify OTP ──

interface VerifyOtpPayload {
  email: string;
  otp: string;
  type: string;
}

interface VerifyOtpResponse {
  status: string;
  message: string;
  data: {
    type: string;
    validated: boolean;
    token: string;
    onboardingCompleted: boolean;
  };
}

export const useVerifyOtp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation<VerifyOtpResponse, AxiosError<ApiError>, VerifyOtpPayload>(
    {
      mutationFn: async (payload) => {
        const { data } = await http.post<VerifyOtpResponse>(
          '/otp/verify',
          payload,
        );
        return data;
      },
      onSuccess: (data) => {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem(
          'onboardingCompleted',
          String(data.data.onboardingCompleted),
        );
        enqueueSnackbar(data.message, { variant: 'success' });

        if (!data.data.onboardingCompleted) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          'OTP verification failed. Please try again.';
        enqueueSnackbar(message, { variant: 'error' });
      },
    },
  );
};

// ── Resend OTP ──

interface ResendOtpPayload {
  email: string;
  type: string;
}

export const useResendOtp = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<AuthResponse, AxiosError<ApiError>, ResendOtpPayload>({
    mutationFn: async (payload) => {
      const { data } = await http.post<AuthResponse>('/otp/generate', payload);
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to resend OTP. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};

// ── Get Estates ──

export interface Estate {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface EstatesResponse {
  status: string;
  message: string;
  data: Estate[];
}

export const useGetEstates = () => {
  return useQuery<Estate[]>({
    queryKey: ['estates'],
    queryFn: async () => {
      const { data } = await http.get<EstatesResponse>('/estate');
      return data.data;
    },
  });
};

// ── Onboarding ──

interface OnboardingPayload {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  nin: string;
  estateId: string;
  houseNumber: string;
  estateName?: string;
}

interface OnboardingResponse {
  status: string;
  message: string;
  data: {
    user: Record<string, unknown>;
  };
}

// ── Get Profile ──

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  phoneNumber: string | null;
  avatar: string | null;
  country: string | null;
  referralCode: string | null;
  isActive: boolean;
  emailVerified: boolean;
  role: string;
  gender: string | null;
  nin: string | null;
  estateId: string | null;
  houseNumber: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  status: string;
  message: string;
  data: {
    user: UserProfile;
  };
}

export const useGetProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await http.get<ProfileResponse>('/user/profile');
      return data.data.user;
    },
    enabled: !!localStorage.getItem('token'),
  });
};

// ── Onboarding ──

export const useOnboarding = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation<
    OnboardingResponse,
    AxiosError<ApiError>,
    OnboardingPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await http.put<OnboardingResponse>(
        '/user/profile/onboarding',
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      navigate('/onboarding-success');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};
