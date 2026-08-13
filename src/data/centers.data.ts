/**
 * Données statiques des centres de don de sang — HemoLink
 *
 * Référence de structure (pour extension future, ex. mode "France") :
 * API Carto v3 de l'Établissement Français du Sang (EFS)
 * Documentation Swagger : https://oudonner.api.efs.sante.fr/carto-api/swagger/
 * Dataset pré-extrait (GeoJSON) : https://www.data.gouv.fr/datasets/dates-et-lieux-des-collectes-de-don-du-sang
 * → Utilisé ici uniquement comme modèle de champs, pas comme source de données réelles.
 *   Les centres ci-dessous sont fictifs mais crédibles, ancrés sur des villes réelles du Bénin.
 */

import type { Center, DonationType } from '@/features/eligibility/eligibility.types';

type Weekday =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche';

interface OpeningHours {
  day: Weekday;
  open: string;
  close: string;
}

const WEEKDAY_TO_KEY: Record<Weekday, keyof Center['hours']> = {
  lundi: 'mon',
  mardi: 'tue',
  mercredi: 'wed',
  jeudi: 'thu',
  vendredi: 'fri',
  samedi: 'sat',
  dimanche: 'sun',
};

const DONATION_TYPE_MAP = {
  sang_total: 'whole',
  plasma: 'plasma',
  plaquettes: 'platelets',
} as const satisfies Record<string, DonationType>;

function buildHours(slots: OpeningHours[]): Center['hours'] {
  const hours: Center['hours'] = {
    mon: 'Fermé',
    tue: 'Fermé',
    wed: 'Fermé',
    thu: 'Fermé',
    fri: 'Fermé',
    sat: 'Fermé',
    sun: 'Fermé',
  };

  for (const slot of slots) {
    hours[WEEKDAY_TO_KEY[slot.day]] = `${slot.open}-${slot.close}`;
  }

  return hours;
}

function mapDonationTypes(
  types: Array<keyof typeof DONATION_TYPE_MAP>,
): DonationType[] {
  return types.map((t) => DONATION_TYPE_MAP[t]);
}

interface BeninCenterSeed {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  hours: OpeningHours[];
  donationTypes: Array<keyof typeof DONATION_TYPE_MAP>;
  appointmentRequired: boolean;
  coordinates: { lat: number; lng: number };
}

function toCenter(seed: BeninCenterSeed): Center {
  return {
    id: seed.id,
    name: seed.name,
    nature: seed.type,
    city: seed.city,
    address: seed.address,
    postalCode: '',
    phone: seed.phone,
    email: seed.email ?? '',
    hours: buildHours(seed.hours),
    donationTypes: mapDonationTypes(seed.donationTypes),
    appointmentRequired: seed.appointmentRequired,
    lat: seed.coordinates.lat,
    lng: seed.coordinates.lng,
  };
}

const BENIN_CENTERS: BeninCenterSeed[] = [
  {
    id: 'cnts-cotonou',
    name: 'Centre National de Transfusion Sanguine',
    type: 'Centre national de référence',
    city: 'Cotonou',
    address: 'Avenue Jean-Paul II, Cotonou',
    phone: '+229 21 30 01 12',
    email: 'contact@cnts-benin.bj',
    hours: [
      { day: 'lundi', open: '08:00', close: '17:00' },
      { day: 'mardi', open: '08:00', close: '17:00' },
      { day: 'mercredi', open: '08:00', close: '17:00' },
      { day: 'jeudi', open: '08:00', close: '17:00' },
      { day: 'vendredi', open: '08:00', close: '17:00' },
      { day: 'samedi', open: '08:00', close: '13:00' },
    ],
    donationTypes: ['sang_total', 'plasma', 'plaquettes'],
    appointmentRequired: false,
    coordinates: { lat: 6.3703, lng: 2.3912 },
  },
  {
    id: 'crts-porto-novo',
    name: 'Centre Régional de Transfusion Sanguine de Porto-Novo',
    type: 'Centre régional',
    city: 'Porto-Novo',
    address: 'Quartier Houinmè, Porto-Novo',
    phone: '+229 20 21 45 30',
    hours: [
      { day: 'lundi', open: '08:00', close: '16:00' },
      { day: 'mardi', open: '08:00', close: '16:00' },
      { day: 'mercredi', open: '08:00', close: '16:00' },
      { day: 'jeudi', open: '08:00', close: '16:00' },
      { day: 'vendredi', open: '08:00', close: '16:00' },
    ],
    donationTypes: ['sang_total', 'plasma'],
    appointmentRequired: false,
    coordinates: { lat: 6.4969, lng: 2.6289 },
  },
  {
    id: 'crts-parakou',
    name: 'Centre Régional de Transfusion Sanguine de Parakou',
    type: 'Centre régional',
    city: 'Parakou',
    address: "Route de l'Hôpital, Parakou",
    phone: '+229 23 61 02 88',
    hours: [
      { day: 'lundi', open: '08:00', close: '16:00' },
      { day: 'mardi', open: '08:00', close: '16:00' },
      { day: 'mercredi', open: '08:00', close: '16:00' },
      { day: 'jeudi', open: '08:00', close: '16:00' },
      { day: 'vendredi', open: '08:00', close: '16:00' },
      { day: 'samedi', open: '08:00', close: '12:00' },
    ],
    donationTypes: ['sang_total', 'plasma', 'plaquettes'],
    appointmentRequired: true,
    coordinates: { lat: 9.3372, lng: 2.6303 },
  },
  {
    id: 'cdts-abomey-calavi',
    name: 'Centre Départemental de Transfusion Sanguine',
    type: 'Centre départemental',
    city: 'Abomey-Calavi',
    address: 'Carrefour Zogbo, Abomey-Calavi',
    phone: '+229 21 36 14 09',
    hours: [
      { day: 'lundi', open: '08:00', close: '16:00' },
      { day: 'mardi', open: '08:00', close: '16:00' },
      { day: 'mercredi', open: '08:00', close: '16:00' },
      { day: 'jeudi', open: '08:00', close: '16:00' },
      { day: 'vendredi', open: '08:00', close: '16:00' },
    ],
    donationTypes: ['sang_total'],
    appointmentRequired: false,
    coordinates: { lat: 6.4489, lng: 2.3554 },
  },
  {
    id: 'hopital-bohicon',
    name: 'Centre de Santé Communal de Bohicon',
    type: 'Centre de santé communal',
    city: 'Bohicon',
    address: 'Route Nationale RNIE2, Bohicon',
    phone: '+229 22 51 03 27',
    hours: [
      { day: 'lundi', open: '08:00', close: '15:30' },
      { day: 'mardi', open: '08:00', close: '15:30' },
      { day: 'mercredi', open: '08:00', close: '15:30' },
      { day: 'jeudi', open: '08:00', close: '15:30' },
      { day: 'vendredi', open: '08:00', close: '15:30' },
    ],
    donationTypes: ['sang_total'],
    appointmentRequired: true,
    coordinates: { lat: 7.1781, lng: 2.0667 },
  },
  {
    id: 'hopital-natitingou',
    name: 'Hôpital de Zone de Natitingou',
    type: 'Hôpital de zone',
    city: 'Natitingou',
    address: 'Quartier Kandi-Kandi, Natitingou',
    phone: '+229 23 82 11 06',
    hours: [
      { day: 'lundi', open: '08:00', close: '15:00' },
      { day: 'mardi', open: '08:00', close: '15:00' },
      { day: 'mercredi', open: '08:00', close: '15:00' },
      { day: 'jeudi', open: '08:00', close: '15:00' },
      { day: 'vendredi', open: '08:00', close: '15:00' },
    ],
    donationTypes: ['sang_total', 'plasma'],
    appointmentRequired: true,
    coordinates: { lat: 10.3042, lng: 1.3792 },
  },
  {
    id: 'centre-lokossa',
    name: 'Centre de Santé de Lokossa',
    type: 'Centre de santé départemental',
    city: 'Lokossa',
    address: 'Avenue de la Préfecture, Lokossa',
    phone: '+229 22 41 07 15',
    hours: [
      { day: 'lundi', open: '08:00', close: '15:30' },
      { day: 'mardi', open: '08:00', close: '15:30' },
      { day: 'mercredi', open: '08:00', close: '15:30' },
      { day: 'jeudi', open: '08:00', close: '15:30' },
      { day: 'vendredi', open: '08:00', close: '15:30' },
    ],
    donationTypes: ['sang_total'],
    appointmentRequired: false,
    coordinates: { lat: 6.6389, lng: 1.7167 },
  },
  {
    id: 'centre-ouidah',
    name: 'Centre de Collecte de Ouidah',
    type: 'Centre de collecte',
    city: 'Ouidah',
    address: 'Rue des Musées, Ouidah',
    phone: '+229 21 34 12 40',
    hours: [
      { day: 'mardi', open: '08:00', close: '14:00' },
      { day: 'jeudi', open: '08:00', close: '14:00' },
      { day: 'samedi', open: '08:00', close: '12:00' },
    ],
    donationTypes: ['sang_total'],
    appointmentRequired: false,
    coordinates: { lat: 6.3628, lng: 2.0852 },
  },
];

export const centers: Center[] = BENIN_CENTERS.map(toCenter);
