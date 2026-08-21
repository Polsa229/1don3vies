import type { DonationType } from '@/features/eligibility/eligibility.types';
import type { TranslationKey } from '@/i18n/translations';

export function dayLabelsFor(lang: string): Record<string, string> {
  return {
    mon: lang === 'fr' ? 'Lun' : 'Mon',
    tue: lang === 'fr' ? 'Mar' : 'Tue',
    wed: lang === 'fr' ? 'Mer' : 'Wed',
    thu: lang === 'fr' ? 'Jeu' : 'Thu',
    fri: lang === 'fr' ? 'Ven' : 'Fri',
    sat: lang === 'fr' ? 'Sam' : 'Sat',
    sun: lang === 'fr' ? 'Dim' : 'Sun',
  };
}

export const DONATION_TYPE_LABEL_KEY: Record<DonationType, TranslationKey> = {
  whole: 'centers.filter.type.whole',
  plasma: 'centers.filter.type.plasma',
  platelets: 'centers.filter.type.platelets',
};
