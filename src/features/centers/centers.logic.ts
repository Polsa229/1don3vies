import type {
  Campaign,
  Center,
  DonationType,
} from '@/features/eligibility/eligibility.types';
import { getCampaignLifecycle } from './campaign.logic';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
type DayKey = (typeof DAYS)[number];

/**
 * Calcule si un centre est ouvert à l'instant donné (par défaut : maintenant).
 * Purement client-side, aucune donnée dynamique/backend nécessaire.
 */
export function isCenterOpenNow(center: Center, now: Date = new Date()): boolean {
  return getCenterStatus(center, now).isOpen;
}

export function getCenterStatus(
  center: Center,
  now: Date = new Date(),
): { isOpen: boolean; todayHours: string } {
  const dayIdx = now.getDay();
  const dayKey = DAYS[dayIdx] as DayKey;
  const todayHours = center.hours[dayKey];

  if (todayHours === 'Fermé' || todayHours === 'Closed') {
    return { isOpen: false, todayHours };
  }

  const [start, end] = todayHours.split('-');
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return {
    isOpen: nowMinutes >= startMinutes && nowMinutes <= endMinutes,
    todayHours,
  };
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function filterCentersList(
  centers: Center[],
  search: string,
  cityFilter: string,
  typeFilter: string,
  appointmentFilter: string,
  coords: { lat: number; lng: number } | null,
): Center[] {
  let result = centers.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.city.toLowerCase().includes(q) &&
        !c.address.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (cityFilter !== 'all' && c.city !== cityFilter) return false;
    if (typeFilter !== 'all' && !c.donationTypes.includes(typeFilter as DonationType)) {
      return false;
    }
    if (appointmentFilter === 'yes' && !c.appointmentRequired) return false;
    if (appointmentFilter === 'no' && c.appointmentRequired) return false;
    return true;
  });

  if (coords) {
    result = result
      .map((c) => ({
        center: c,
        distance: haversineDistance(coords.lat, coords.lng, c.lat, c.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((x) => x.center);
  }

  return result;
}

export function filterCampaignsList(
  campaigns: Campaign[],
  search: string,
  cityFilter: string,
  typeFilter: string,
  appointmentFilter: string,
  statusFilter: string,
  coords: { lat: number; lng: number } | null,
): Campaign[] {
  let result = campaigns.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.city.toLowerCase().includes(q) &&
        !c.location.toLowerCase().includes(q) &&
        !c.organizer.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (cityFilter !== 'all' && c.city !== cityFilter) return false;
    if (typeFilter !== 'all' && !c.donationTypes.includes(typeFilter as DonationType)) {
      return false;
    }
    if (appointmentFilter === 'yes' && !c.appointmentRequired) return false;
    if (appointmentFilter === 'no' && c.appointmentRequired) return false;
    if (statusFilter !== 'all' && getCampaignLifecycle(c) !== statusFilter) return false;
    return true;
  });

  const rank = { ongoing: 0, upcoming: 1, ended: 2 } as const;

  if (coords) {
    result = result
      .map((c) => ({
        campaign: c,
        distance: haversineDistance(coords.lat, coords.lng, c.lat, c.lng),
      }))
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return rank[getCampaignLifecycle(a.campaign)] - rank[getCampaignLifecycle(b.campaign)];
      })
      .map((x) => x.campaign);
  } else {
    result = [...result].sort((a, b) => {
      const ra = rank[getCampaignLifecycle(a)];
      const rb = rank[getCampaignLifecycle(b)];
      if (ra !== rb) return ra - rb;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  return result;
}
