import type { Campaign } from '@/features/eligibility/eligibility.types';

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const campaigns: Campaign[] = [
  {
    id: 'camp1',
    name: 'Collecte de Rentrée Universitaire',
    location: 'Campus Universitaire de la Doua',
    city: 'Lyon',
    date: daysFromNow(7),
    endDate: daysFromNow(10),
    startTime: '10:00',
    endTime: '18:00',
    organizer: 'Université de Lyon',
    partner: 'HemoLink',
    soughtGroups: ['O-', 'A-', 'B-'],
  },
  {
    id: 'camp2',
    name: 'Don de Sang Solidaire — Forum',
    location: 'Forum des Associations',
    city: 'Bordeaux',
    date: daysFromNow(14),
    endDate: daysFromNow(15),
    startTime: '09:00',
    endTime: '17:00',
    organizer: 'Ville de Bordeaux',
    partner: 'HemoLink',
    soughtGroups: ['AB-', 'B-', 'O-'],
  },
  {
    id: 'camp3',
    name: 'Marathon du Don',
    location: 'Stade Vélodrome — Espace Accueil',
    city: 'Marseille',
    date: daysFromNow(21),
    endDate: daysFromNow(22),
    startTime: '08:00',
    endTime: '20:00',
    organizer: 'Club Sportif Marseillais',
    partner: 'HemoLink',
    soughtGroups: ['A-', 'B+', 'AB-'],
  },
  {
    id: 'camp4',
    name: 'Journée Entreprises du Don',
    location: 'Tour Saint-Charles — Hall Principal',
    city: 'Paris',
    date: daysFromNow(3),
    endDate: daysFromNow(4),
    startTime: '10:00',
    endTime: '19:00',
    organizer: 'Réseau Entreprises Solidaires',
    partner: 'HemoLink',
    soughtGroups: ['O-', 'O+', 'A-'],
  },
  {
    id: 'camp5',
    name: 'Collecte de Quartier — Bellecour',
    location: 'Place Bellecour — Chapiteau',
    city: 'Lyon',
    date: daysFromNow(1),
    endDate: daysFromNow(2),
    startTime: '09:00',
    endTime: '16:00',
    organizer: 'Comité de Quartier Bellecour',
    partner: 'HemoLink',
    soughtGroups: ['B-', 'AB-', 'O-'],
  },
];
