import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetMeters } from '@/services/meters';

const SELECTED_METER_STORAGE_KEY = 'selected-meter-id';

export const useSelectedMeter = () => {
  const navigate = useNavigate();
  const { meterId } = useParams<{ meterId: string }>();
  const { pathname } = useLocation();
  const { data: meters = [], isLoading } = useGetMeters();

  const selectedMeter = useMemo(() => {
    const byRoute = meters.find((m) => m.id === meterId);
    if (byRoute) return byRoute;

    const storedMeterId = localStorage.getItem(SELECTED_METER_STORAGE_KEY);
    const byStored = meters.find((m) => m.id === storedMeterId);
    if (byStored) return byStored;

    return meters[0] ?? null;
  }, [meters, meterId]);

  useEffect(() => {
    if (!selectedMeter) return;
    localStorage.setItem(SELECTED_METER_STORAGE_KEY, selectedMeter.id);
  }, [selectedMeter]);

  useEffect(() => {
    if (!selectedMeter || !pathname) return;

    const segments = pathname.split('/');
    if (segments.length < 3) return;

    if (segments[1] && segments[1] !== selectedMeter.id) {
      segments[1] = selectedMeter.id;
      navigate(segments.join('/'), { replace: true });
    }
  }, [selectedMeter, pathname, navigate]);

  const setMeterId = useCallback(
    (id: string) => {
      localStorage.setItem(SELECTED_METER_STORAGE_KEY, id);
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
