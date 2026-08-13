import type { Campaign, CampaignLifecycle } from '@/features/eligibility/eligibility.types';

export function getCampaignLifecycle(campaign: Campaign, now = Date.now()): CampaignLifecycle {
  const start = new Date(campaign.date).getTime();
  const end = new Date(campaign.endDate).getTime();
  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'ongoing';
}
