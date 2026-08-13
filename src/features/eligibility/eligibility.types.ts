export type Gender = 'male' | 'female';

export type DonationType = 'whole' | 'plasma' | 'platelets';

export type NeedLevel = 'high' | 'moderate' | 'normal';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export interface Center {
  id: string;
  name: string;
  nature: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  phone: string;
  email: string;
  donationTypes: DonationType[];
  appointmentRequired: boolean;
}

export type CampaignLifecycle = 'upcoming' | 'ongoing' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  organizer: string;
  partner: string;
  soughtGroups: BloodGroup[];
  donationTypes: DonationType[];
  appointmentRequired: boolean;
  /** Poches collectées (renseigné surtout pour les campagnes terminées). */
  bagsCollected?: number;
}

export interface BloodReserve {
  group: BloodGroup;
  level: NeedLevel;
  description: { fr: string; en: string };
  rare: boolean;
}

export interface EligibilityInput {
  age: number;
  gender: Gender | null;
  weight: number;
  hasDonatedBefore: boolean | null;
  lastDonationDate: string | null;
}

export type EligibilityStatus = 'eligible' | 'ineligible' | 'temporarily_ineligible';

export interface EligibilityResult {
  status: EligibilityStatus;
  message: string;
  blockingCriterion?: 'age' | 'weight' | 'delay';
  nextEligibleDate?: string;
}

export interface FAQItem {
  qKey: string;
  aKey: string;
}
