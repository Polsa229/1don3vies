import { describe, expect, it } from 'vitest';
import {
  filterCentersList,
  getCenterStatus,
  haversineDistance,
  isCenterOpenNow,
} from './centers.logic';
import { centers } from '@/data/centers.data';
import type { Center } from '@/features/eligibility/eligibility.types';

const sampleCenter: Center = {
  id: 'test',
  name: 'Centre test',
  nature: 'Test',
  address: '1 rue Test',
  city: 'Cotonou',
  postalCode: '00229',
  lat: 6.37,
  lng: 2.39,
  hours: {
    mon: '08:00-17:00',
    tue: '08:00-17:00',
    wed: '08:00-17:00',
    thu: '08:00-17:00',
    fri: '08:00-17:00',
    sat: 'Fermé',
    sun: 'Fermé',
  },
  phone: '+229 00 00 00 00',
  email: 'test@example.com',
  donationTypes: ['whole'],
  appointmentRequired: false,
};

describe('getCenterStatus', () => {
  it('indique ouvert pendant les horaires du jour', () => {
    const mondayMorning = new Date('2026-08-17T10:00:00'); // lundi
    const status = getCenterStatus(sampleCenter, mondayMorning);
    expect(status.isOpen).toBe(true);
    expect(status.todayHours).toBe('08:00-17:00');
  });

  it('indique fermé en dehors des horaires', () => {
    const mondayEvening = new Date('2026-08-17T19:00:00');
    expect(getCenterStatus(sampleCenter, mondayEvening).isOpen).toBe(false);
  });

  it('indique fermé les jours marqués Fermé', () => {
    const saturday = new Date('2026-08-22T10:00:00');
    const status = getCenterStatus(sampleCenter, saturday);
    expect(status.isOpen).toBe(false);
    expect(status.todayHours).toBe('Fermé');
  });
});

describe('isCenterOpenNow', () => {
  it('délègue à getCenterStatus', () => {
    const now = new Date('2026-08-17T10:00:00');
    expect(isCenterOpenNow(sampleCenter, now)).toBe(true);
  });
});

describe('haversineDistance', () => {
  it('retourne 0 km pour deux points identiques', () => {
    expect(haversineDistance(6.37, 2.39, 6.37, 2.39)).toBe(0);
  });

  it('calcule une distance positive entre deux villes', () => {
    const cotonouToPortoNovo = haversineDistance(6.3703, 2.3912, 6.4969, 2.6289);
    expect(cotonouToPortoNovo).toBeGreaterThan(0);
    expect(cotonouToPortoNovo).toBeLessThan(50);
  });
});

describe('filterCentersList', () => {
  it('retourne tous les centres sans filtre', () => {
    expect(filterCentersList(centers, '', 'all', 'all', 'all', null)).toHaveLength(
      centers.length,
    );
  });

  it('retourne un tableau vide si la recherche ne correspond à rien', () => {
    expect(
      filterCentersList(centers, '___aucun_resultat___', 'all', 'all', 'all', null),
    ).toEqual([]);
  });

  it('filtre par ville', () => {
    const result = filterCentersList(centers, '', 'Cotonou', 'all', 'all', null);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.city === 'Cotonou')).toBe(true);
  });
});
