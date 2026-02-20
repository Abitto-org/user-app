import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { http } from '@/services/http';
import { useMeterId } from '@/hooks/use-meter-id';
import type { AxiosError } from 'axios';

interface ApiError {
  message: string;
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
  referredBy: string | null;
  isActive: boolean;
  isAmbassador: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  failedLoginAttempts: number;
  lockoutUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deleteRequestedAt: string | null;
  deleteEffectiveAt: string | null;
  isArchived: boolean;
  archivedAt: string | null;
  archiveReason: string | null;
  pushNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  telegramNotificationEnabled: boolean;
  role: string;
  telegramChatId: string | null;
  telegramLinkedAt: string | null;
  adminRoleId: string | null;
  adminGroupId: string | null;
  gender: string | null;
  nin: string | null;
  estateId: string | null;
  houseNumber: string | null;
  onboardingEstateName: string | null;
  onboardingCompleted: boolean;
  availableGasKg: string | null;
}

interface ProfileResponse {
  status: string;
  message: string;
  data: {
    user: UserProfile;
  };
}

export const useGetProfile = () => {
  const meterId = useMeterId();

  return useQuery<UserProfile>({
    queryKey: ['profile', meterId],
    queryFn: async () => {
      const { data } = await http.get<ProfileResponse>('/user/profile');
      return data.data.user;
    },
    enabled: !!localStorage.getItem('token'),
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
