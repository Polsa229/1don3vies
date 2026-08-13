import type { BloodReserve } from '@/features/eligibility/eligibility.types';

export const bloodReserves: BloodReserve[] = [
  {
    group: 'O-',
    level: 'high',
    description: {
      fr: 'Donneur universel, essentiel pour les urgences. Toujours en demande forte.',
      en: 'Universal donor, essential for emergencies. Always in high demand.',
    },
    rare: false,
  },
  {
    group: 'A-',
    level: 'high',
    description: {
      fr: 'Compatible avec tous les groupes négatifs. Besoin élevé et constant.',
      en: 'Compatible with all negative groups. High and constant need.',
    },
    rare: false,
  },
  {
    group: 'B-',
    level: 'high',
    description: {
      fr: 'Groupe rare, particulièrement recherché pour les transfusions spécifiques.',
      en: 'Rare group, particularly sought for specific transfusions.',
    },
    rare: true,
  },
  {
    group: 'AB-',
    level: 'high',
    description: {
      fr: 'Le groupe le plus rare. Les réserves sont presque toujours tendues.',
      en: 'The rarest group. Reserves are almost always strained.',
    },
    rare: true,
  },
  {
    group: 'O+',
    level: 'moderate',
    description: {
      fr: 'Groupe le plus répandu. Les besoins sont réguliers mais mieux couverts.',
      en: 'Most common group. Needs are regular but better covered.',
    },
    rare: false,
  },
  {
    group: 'A+',
    level: 'moderate',
    description: {
      fr: 'Très répandu, besoins stables. Les réserves sont généralement suffisantes.',
      en: 'Very common, stable needs. Reserves are generally sufficient.',
    },
    rare: false,
  },
  {
    group: 'B+',
    level: 'moderate',
    description: {
      fr: 'Moins fréquent, besoins modérés selon les régions.',
      en: 'Less frequent, moderate needs depending on regions.',
    },
    rare: false,
  },
  {
    group: 'AB+',
    level: 'normal',
    description: {
      fr: 'Receveur universel. Les besoins sont plus faibles en volume.',
      en: 'Universal recipient. Needs are lower in volume.',
    },
    rare: false,
  },
];
