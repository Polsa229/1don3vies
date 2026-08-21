import { CountdownBlocks } from '@/components/shared/CountdownBlocks';
import { useI18n } from '@/i18n/useI18n';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { getCampaignLifecycle } from '@/features/centers/campaign.logic';
import { DetailModalShell } from '@/components/centers/DetailModalShell';
import type { Campaign } from '@/features/eligibility/eligibility.types';
import { directionsUrl } from '@/lib/maps';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Navigation,
  Heart,
  Droplet,
} from 'lucide-react';

export function CampaignDetailModal({
  campaign,
  onClose,
}: {
  campaign: Campaign | null;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  const lifecycle = campaign ? getCampaignLifecycle(campaign) : 'ended';
  const countdownEnd = useCountdown(campaign?.endDate ?? new Date().toISOString());
  const countdownStart = useCountdown(campaign?.date ?? new Date().toISOString());
  const countdown = lifecycle === 'ongoing' ? countdownEnd : countdownStart;

  const dateStr = campaign
    ? new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(campaign.date))
    : '';

  const isEnded = lifecycle === 'ended';
  const isOngoing = lifecycle === 'ongoing';

  return (
    <DetailModalShell open={!!campaign} title={t('campaigns.details')} onClose={onClose}>
      {campaign && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                isOngoing
                  ? 'bg-accent-50 text-accent-700 border-accent-200'
                  : lifecycle === 'upcoming'
                    ? 'bg-warmgray-100 text-warmgray-700 border-warmgray-200'
                    : 'bg-primary-50 text-primary-700 border-primary-100'
              }`}
            >
              {t(
                isOngoing
                  ? 'campaigns.status.ongoing'
                  : lifecycle === 'upcoming'
                    ? 'campaigns.status.upcoming'
                    : 'campaigns.status.ended',
              )}
            </span>
            {!isEnded && (
              <div className="w-full mt-1">
                <p className="text-[10px] uppercase tracking-wider text-warmgray-400 font-semibold mb-2">
                  {t(isOngoing ? 'campaigns.status.ongoingEndsIn' : 'campaigns.status.startsIn')}
                </p>
                <CountdownBlocks countdown={countdown} />
              </div>
            )}
            {isEnded && campaign.bagsCollected != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800 border border-primary-100">
                <Droplet className="w-3.5 h-3.5 text-primary-600" fill="currentColor" />
                {t('campaigns.status.bagsCollected').replace('{n}', String(campaign.bagsCollected))}
              </span>
            )}
          </div>

          <h3 className="font-display text-2xl text-primary-900 leading-tight">{campaign.name}</h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-warmgray-600">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory-50 border border-warmgray-100">
                <MapPin className="w-4 h-4 text-primary-500" />
              </span>
              <span className="pt-1.5">
                {campaign.location}, {campaign.city}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-warmgray-600">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory-50 border border-warmgray-100">
                <Calendar className="w-4 h-4 text-primary-500" />
              </span>
              <span className="pt-1.5 capitalize">{dateStr}</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-warmgray-600">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory-50 border border-warmgray-100">
                <Clock className="w-4 h-4 text-primary-500" />
              </span>
              <span className="pt-1.5">
                {t('campaigns.hours')}: {campaign.startTime} — {campaign.endTime}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-warmgray-600">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ivory-50 border border-warmgray-100">
                <Users className="w-4 h-4 text-primary-500" />
              </span>
              <span className="pt-1.5">
                <span className="text-xs text-warmgray-400">{t('campaigns.organizer')}: </span>
                <span className="font-medium text-warmgray-700">{campaign.organizer}</span>
                <span className="text-warmgray-400"> × {campaign.partner}</span>
              </span>
            </li>
          </ul>

          <a
            href={directionsUrl(campaign.lat, campaign.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-100 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {t('centers.map.directions')}
          </a>

          <div className="pt-4 border-t border-warmgray-100">
            <p className="text-[11px] font-semibold text-warmgray-400 uppercase tracking-[0.14em] mb-2.5 flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-accent-500" fill="currentColor" />
              {t('campaigns.soughtGroups')}
            </p>
            <div className="flex flex-wrap gap-2">
              {campaign.soughtGroups.map((group) => (
                <span
                  key={group}
                  className="inline-flex min-w-[2.5rem] items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border bg-primary-50 text-primary-800 border-primary-100"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </DetailModalShell>
  );
}
