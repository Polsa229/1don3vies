import type { EligibilityInput, EligibilityResult } from './eligibility.types';

export const MIN_AGE = 18;
export const MAX_AGE = 65;
const MIN_WEIGHT = 50;
const MALE_DELAY_MONTHS = 3;
const FEMALE_DELAY_MONTHS = 4;

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date: Date, lang: 'fr' | 'en' = 'fr'): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.DateTimeFormat(locale, opts).format(date);
}

export function checkEligibility(input: EligibilityInput, lang: 'fr' | 'en' = 'fr'): EligibilityResult {
  const { age, gender, weight, hasDonatedBefore, lastDonationDate } = input;

  // Age check
  if (age < MIN_AGE || age > MAX_AGE) {
    return {
      status: 'ineligible',
      message:
        lang === 'fr'
          ? 'L\'âge est un critère bloquant : il faut avoir entre 18 et 65 ans révolus.'
          : 'Age is a blocking criterion: you must be between 18 and 65 full years old.',
      blockingCriterion: 'age',
    };
  }

  // Weight check
  if (weight < MIN_WEIGHT) {
    return {
      status: 'ineligible',
      message:
        lang === 'fr'
          ? 'Ce critère semble actuellement bloquant : le poids (minimum 50 kg).'
          : 'This criterion currently seems blocking: weight (minimum 50 kg).',
      blockingCriterion: 'weight',
    };
  }

  // Delay check
  if (hasDonatedBefore && lastDonationDate) {
    const lastDate = new Date(lastDonationDate);
    const requiredDelay = gender === 'female' ? FEMALE_DELAY_MONTHS : MALE_DELAY_MONTHS;
    const nextEligibleDate = addMonths(lastDate, requiredDelay);
    const now = new Date();

    if (now < nextEligibleDate) {
      return {
        status: 'temporarily_ineligible',
        message:
          lang === 'fr'
            ? `Vous pourrez potentiellement donner à partir du ${formatDate(nextEligibleDate, 'fr')}.`
            : `You may potentially be able to donate from ${formatDate(nextEligibleDate, 'en')}.`,
        blockingCriterion: 'delay',
        nextEligibleDate: nextEligibleDate.toISOString(),
      };
    }
  }

  return {
    status: 'eligible',
    message:
      lang === 'fr'
        ? 'Selon les critères de ce guide, vous pouvez donner.'
        : 'According to this guide\'s criteria, you can donate.',
  };
}

export function formatDateForDisplay(isoDate: string, lang: 'fr' | 'en' = 'fr'): string {
  return formatDate(new Date(isoDate), lang);
}

export { formatDate };
