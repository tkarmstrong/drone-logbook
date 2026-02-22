import { useQuery } from '@tanstack/react-query';
import { api } from './client';

export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: () => api.get<unknown[]>('/flights/view'),
    retry: false,
  });
}
