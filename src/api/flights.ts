import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export interface FlightLeg {
  takeoffTime: string;
  landTime: string;
  flightTime: number;
  nightTime?: number;
  picTime?: number;
  flightMalfunction: boolean;
  nightFlight: boolean;
  legNotes?: string;
}

export interface FlightPayload {
  userData: {
    pilotExemptionNumber: string;
    spotterName?: string;
  };
  aircraftData: {
    aircraftId: string;
  };
  missionData: {
    dateOfFlight: string;
    location: string;
    flightLat: number;
    flightLong: number;
    totalFlightTime: number;
    totalNightTime?: number;
    totalPicTime?: number;
    totalTakeoffs?: number;
    totalLands?: number;
    maxAltitude?: number;
    airspaceClass?: string;
    authorization?: string;
    preflightChecklistComplete?: boolean;
    batterySerials?: string[];
    preFlightVoltage?: number;
    postFlightVoltage?: number;
    missionExperience: string;
    missionNotes?: string;
    otherNotes?: string;
  };
  flightData: {
    flightLegs: FlightLeg[];
  };
  weatherData: {
    weatherNotes?: string;
  };
}

export interface Flight {
  _id: string;
  userData: { pilot: { firstName?: string; lastName?: string }; pilotExemptionNumber: string; spotterName?: string };
  aircraftData: { aircraftId: AircraftRef };
  missionData: {
    dateOfFlight: string;
    location: string;
    totalFlightTime: number;
    missionExperience: string;
    maxAltitude?: number;
    preflightChecklistComplete?: boolean;
    [key: string]: unknown;
  };
  weatherData?: { weatherNotes?: string };
}

interface AircraftRef {
  _id: string;
  make?: string;
  model?: string;
  aircraftSerialNumber?: string;
  registrationNumber?: string;
}

export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: () => api.get<Flight[]>('/flights/view'),
    retry: false,
  });
}

export function useAddFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FlightPayload) => api.post<Flight>('/flight/add-new', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
}
