import { describe, expect, it } from 'vitest';
import { getCampaignLifecycle } from './campaign.logic';
import type { Campaign } from '@/features/eligibility/eligibility.types';

const sampleCampaign: Campaign = {
  id: 'camp-1',
  name: 'Collecte test',
  location: 'Place publique',
  city: 'Cotonou',
  lat: 6.37,
  lng: 2.39,
  date: '2026-08-01',
  endDate: '2026-08-31',
  startTime: '08:00',
  endTime: '16:00',
  organizer: 'EFS',
  partner: 'Mairie',
  soughtGroups: ['O+'],
  donationTypes: ['whole'],
  appointmentRequired: false,
};

describe('getCampaignLifecycle', () => {
  it('retourne upcoming avant la date de début', () => {
    expect(getCampaignLifecycle(sampleCampaign, Date.parse('2026-07-15'))).toBe(
      'upcoming',
    );
  });

  it('retourne ongoing pendant la période', () => {
    expect(getCampaignLifecycle(sampleCampaign, Date.parse('2026-08-15'))).toBe(
      'ongoing',
    );
  });

  it('retourne ended après la date de fin', () => {
    expect(getCampaignLifecycle(sampleCampaign, Date.parse('2026-09-01'))).toBe(
      'ended',
    );
  });
});
