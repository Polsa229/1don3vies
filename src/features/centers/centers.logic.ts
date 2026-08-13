import type { Center } from '@/features/eligibility/eligibility.types';

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
