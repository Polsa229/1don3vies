import { useGeolocation } from '@/lib/hooks/useGeolocation';

export type Tab = 'permanent' | 'campaigns';

export interface SharedFilters {
  search: string;
  cityFilter: string;
  typeFilter: string;
  appointmentFilter: string;
  statusFilter: string;
  geo: ReturnType<typeof useGeolocation>;
}

export interface FiltersState {
  search: string;
  cityFilter: string;
  typeFilter: string;
  appointmentFilter: string;
  statusFilter: string;
  cities: string[];
  resultCount: number;
  geo: ReturnType<typeof useGeolocation>;
  setSearch: (v: string) => void;
  setCityFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setAppointmentFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
}
