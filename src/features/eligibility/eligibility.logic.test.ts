import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkEligibility, MIN_AGE, MAX_AGE } from './eligibility.logic';
import type { EligibilityInput } from './eligibility.types';

const baseInput: EligibilityInput = {
  age: 30,
  gender: 'male',
  weight: 70,
  hasDonatedBefore: false,
  lastDonationDate: null,
};

describe('checkEligibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-18T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('expose les bornes d’âge du brief', () => {
    expect(MIN_AGE).toBe(18);
    expect(MAX_AGE).toBe(65);
  });

  it('retourne éligible pour un primo-donneur valide', () => {
    const result = checkEligibility(baseInput);
    expect(result.status).toBe('eligible');
    expect(result.message).toMatch(/vous pouvez donner/i);
  });

  it('ignore le délai post-don si aucun don antérieur', () => {
    const result = checkEligibility({
      ...baseInput,
      hasDonatedBefore: false,
      lastDonationDate: null,
    });
    expect(result.status).toBe('eligible');
  });

  it('refuse si l’âge est inférieur à 18 ans', () => {
    const result = checkEligibility({ ...baseInput, age: 17 });
    expect(result.status).toBe('ineligible');
    expect(result.blockingCriterion).toBe('age');
  });

  it('refuse si l’âge dépasse 65 ans', () => {
    const result = checkEligibility({ ...baseInput, age: 66 });
    expect(result.status).toBe('ineligible');
    expect(result.blockingCriterion).toBe('age');
  });

  it('refuse si le poids est inférieur à 50 kg', () => {
    const result = checkEligibility({ ...baseInput, weight: 49 });
    expect(result.status).toBe('ineligible');
    expect(result.blockingCriterion).toBe('weight');
  });

  it('retourne temporairement inéligible si le délai homme (3 mois) n’est pas écoulé', () => {
    const result = checkEligibility({
      ...baseInput,
      gender: 'male',
      hasDonatedBefore: true,
      lastDonationDate: '2026-06-20',
    });
    expect(result.status).toBe('temporarily_ineligible');
    expect(result.blockingCriterion).toBe('delay');
    expect(result.nextEligibleDate).toBeDefined();
    expect(result.message).toMatch(/septembre 2026/i);
  });

  it('retourne temporairement inéligible si le délai femme (4 mois) n’est pas écoulé', () => {
    const result = checkEligibility({
      ...baseInput,
      gender: 'female',
      hasDonatedBefore: true,
      lastDonationDate: '2026-05-20',
    });
    expect(result.status).toBe('temporarily_ineligible');
    expect(result.blockingCriterion).toBe('delay');
    expect(result.message).toMatch(/septembre 2026/i);
  });

  it('retourne éligible si le délai homme est écoulé', () => {
    const result = checkEligibility({
      ...baseInput,
      gender: 'male',
      hasDonatedBefore: true,
      lastDonationDate: '2026-04-01',
    });
    expect(result.status).toBe('eligible');
  });

  it('formate le message en anglais', () => {
    const result = checkEligibility(baseInput, 'en');
    expect(result.message).toMatch(/you can donate/i);
  });
});
