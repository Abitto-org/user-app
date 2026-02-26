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

export interface MeterEstate {
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

export interface MeterUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
}

export interface MeterDetails {
  meter: Meter;
  estate: MeterEstate;
  user: MeterUser;
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
  data: MeterDetails;
}

/**
 * Fetch a single meter by ID.
 * If no `id` is passed, falls back to the meterId from the URL path.
 */
export const useGetMeter = (id?: string) => {
  const urlMeterId = useMeterId();
  const meterId = id ?? urlMeterId;

  return useQuery<MeterDetails>({
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

export interface MeterStats {
  remainingKg: number;
  usedToday: number;
  usedThisWeek: number;
  weeklyChangePercentage: number;
  weeklyGraphData: Array<{
    date: string;
    total: number;
  }>;
}

interface MeterStatsResponse {
  status: string;
  message: string;
  data: MeterStats;
}

/**
 * Fetch meter stats by meter ID.
 * If no `id` is passed, falls back to the meterId from the URL path.
 */
export const useGetMeterStats = (id?: string) => {
  const urlMeterId = useMeterId();
  const meterId = id ?? urlMeterId;

  return useQuery<MeterStats>({
    queryKey: ['meter-stats', meterId],
    queryFn: async () => {
      const { data } = await http.get<MeterStatsResponse>(`/meter/stats/${meterId}`);
      return data.data;
    },
    enabled: !!localStorage.getItem('token') && !!meterId,
  });
};
