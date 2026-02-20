import { useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetMeters } from '@/services/meters';

export const useSelectedMeter = () => {
  const navigate = useNavigate();
  const { meterId } = useParams<{ meterId: string }>();
  const { pathname } = useLocation();
  const { data: meters = [], isLoading } = useGetMeters();

  const selectedMeter = meters.find((m) => m.id === meterId) ?? meters[0] ?? null;

  const setMeterId = useCallback(
    (id: string) => {
      // Replace the meterId segment in the current path
      const segments = pathname.split('/');
      // Path: /:meterId/page → segments = ['', meterId, 'page', ...]
      if (segments.length >= 3) {
        segments[1] = id;
      }
      navigate(segments.join('/'), { replace: true });
    },
    [pathname, navigate],
  );

  return {
    meterId: selectedMeter?.id ?? null,
    selectedMeter,
    meters,
    isLoading,
    setMeterId,
  };
};
