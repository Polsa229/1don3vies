import { describe, expect, it } from 'vitest';
import { centers } from './centers.data';

const EXPECTED_CITIES = [
  'Cotonou',
  'Porto-Novo',
  'Parakou',
  'Abomey-Calavi',
  'Bohicon',
  'Natitingou',
  'Lokossa',
  'Ouidah',
];

describe('centers.data', () => {
  it('contient au moins 8 centres', () => {
    expect(centers.length).toBeGreaterThanOrEqual(8);
  });

  it('répartit les centres sur 8 villes distinctes', () => {
    const cities = new Set(centers.map((c) => c.city));
    EXPECTED_CITIES.forEach((city) => expect(cities.has(city)).toBe(true));
    expect(cities.size).toBeGreaterThanOrEqual(8);
  });

  it('expose les champs obligatoires pour chaque centre', () => {
    centers.forEach((center) => {
      expect(center.id).toBeTruthy();
      expect(center.name).toBeTruthy();
      expect(center.nature).toBeTruthy();
      expect(center.address).toBeTruthy();
      expect(center.city).toBeTruthy();
      expect(center.phone).toBeTruthy();
      if (center.email) {
        expect(center.email).toMatch(/@/);
      }
      expect(center.donationTypes.length).toBeGreaterThan(0);
      expect(typeof center.appointmentRequired).toBe('boolean');
      expect(center.lat).not.toBe(0);
      expect(center.lng).not.toBe(0);
      expect(center.hours.mon).toBeTruthy();
    });
  });
});
