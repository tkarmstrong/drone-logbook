import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export interface MaintenanceRecord {
  date: string;
  type: string;
  description?: string;
  partNumbers?: string;
  batteryCycles?: number;
  firmwareVersion?: string;
  performedBy?: string;
  notes?: string;
}

export interface Aircraft {
  _id: string;
  make: string;
  model: string;
  registrationNumber?: string;
  registrationExpiration?: string;
  aircraftSerialNumber: string;
  flightControllerSerialNumber: string;
  propNumber: number;
  dateActivated: string;
  maintenance?: MaintenanceRecord[];
  notes?: string;
}

export interface AircraftPayload {
  dateActivated: string;
  make: string;
  model: string;
  registrationNumber?: string;
  registrationExpiration?: string;
  flightControllerSerialNumber: string;
  aircraftSerialNumber: string;
  propNumber: number;
  notes?: string;
}

export function useAircraft() {
  return useQuery({
    queryKey: ['aircraft'],
    queryFn: () => api.get<Aircraft[]>('/aircraft/view/user-assignments'),
    retry: false,
  });
}

export function useAddAircraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AircraftPayload) => api.post<Aircraft>('/aircraft/add-new', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
    },
  });
}
