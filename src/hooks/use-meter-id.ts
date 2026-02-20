import { useParams } from 'react-router-dom';

/**
 * Reads the current meterId from the URL path parameter.
 * Route must include `:meterId` segment (e.g. /:meterId/dashboard).
 */
export const useMeterId = (): string | null => {
  const { meterId } = useParams<{ meterId: string }>();
  return meterId ?? null;
};
