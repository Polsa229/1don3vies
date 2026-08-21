import { motion } from 'framer-motion';
import { CountdownBlocks } from '@/components/shared/CountdownBlocks';
import { useI18n } from '@/i18n/useI18n';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { getCampaignLifecycle } from '@/features/centers/campaign.logic';
import type { Campaign } from '@/features/eligibility/eligibility.types';
import { scaleIn } from '@/lib/motion';
import { MapPin, Clock, ArrowRight, Droplet } from 'lucide-react';

export function CampaignCard({
  campaign,
  distance,
  onOpen,
}: {
  campaign: Campaign;
  distance?: number | null;
  onOpen: () => void;
}) {
  const { t, lang } = useI18n();
  const lifecycle = getCampaignLifecycle(campaign);
  const countdownEnd = useCountdown(campaign.endDate);
  const countdownStart = useCountdown(campaign.date);
  const countdown = lifecycle === 'ongoing' ? countdownEnd : countdownStart;

  const campaignDate = new Date(campaign.date);
  const dateShort = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(campaignDate);

  const isEnded = lifecycle === 'ended';
  const isOngoing = lifecycle === 'ongoing';

  const accentBar =
    lifecycle === 'ongoing'
      ? 'bg-gradient-to-r from-accent-500 via-primary-600 to-primary-800'
      : lifecycle === 'upcoming'
        ? 'bg-gradient-to-r from-warmgray-300 via-warmgray-400 to-warmgray-500'
        : 'bg-gradient-to-r from-primary-200 via-primary-100 to-transparent';

  const statusBadge =
    lifecycle === 'ongoing'
      ? 'bg-success-50 text-success-700 border-success-200'
      : lifecycle === 'upcoming'
        ? 'bg-warmgray-100 text-warmgray-700 border-warmgray-200'
        : 'bg-primary-50 text-primary-700 border-primary-100';

  return (
    <motion.button
      type="button"
      variants={scaleIn}
      whileHover={isEnded ? undefined : { y: -5, transition: { duration: 0.22 } }}
      onClick={onOpen}
      className={`relative overflow-hidden rounded-2xl border bg-surface flex flex-col text-left w-full h-full transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        isEnded
          ? 'border-warmgray-200/70 shadow-none opacity-[0.92]'
          : 'border-warmgray-200/60 shadow-sm hover:shadow-xl hover:shadow-primary-900/[0.06]'
      }`}
    >
      <div className={`h-1.5 w-full ${accentBar}`} />

      <div className="p-3 sm:p-5 flex-1 flex flex-col">
        <span
          className={`self-start mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}
        >
          {isOngoing && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-success-500 animate-ping opacity-60" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-success-500" />
            </span>
          )}
          {t(
            lifecycle === 'ongoing'
              ? 'campaigns.status.ongoing'
              : lifecycle === 'upcoming'
                ? 'campaigns.status.upcoming'
                : 'campaigns.status.ended',
          )}
        </span>

        <h3
          className={`font-display text-[13px] sm:text-lg leading-snug mb-2 line-clamp-2 ${
            isEnded ? 'text-warmgray-700' : 'text-primary-900'
          }`}
        >
          {campaign.name}
        </h3>

        <div className="space-y-1 text-[11px] sm:text-sm text-warmgray-600 mb-2.5 sm:mb-4">
          <p className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-warmgray-400" />
            <span className="truncate">
              {campaign.city}
              {distance != null ? ` · ${distance} km` : ''}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0 text-warmgray-400" />
            <span className="truncate">
              {dateShort} · {campaign.startTime}–{campaign.endTime}
            </span>
          </p>
        </div>

        {!isEnded ? (
          <div className="mb-3 sm:mb-4">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-warmgray-400 font-semibold mb-1.5">
              {t(isOngoing ? 'campaigns.status.ongoingEndsIn' : 'campaigns.status.startsIn')}
            </p>
            <p className="sm:hidden font-display text-sm font-semibold text-primary-900 tabular-nums">
              {String(countdown.days).padStart(2, '0')}j{' '}
              {String(countdown.hours).padStart(2, '0')}h{' '}
              {String(countdown.minutes).padStart(2, '0')}min
            </p>
            <div className="hidden sm:block">
              <CountdownBlocks countdown={countdown} compact />
            </div>
          </div>
        ) : (
          campaign.bagsCollected != null && (
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-800 border border-primary-100 self-start">
              <Droplet className="w-3.5 h-3.5 text-primary-600" fill="currentColor" />
              {t('campaigns.status.bagsCollected').replace('{n}', String(campaign.bagsCollected))}
            </div>
          )
        )}

        <div className="mt-auto pt-2.5 border-t border-warmgray-100 flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap gap-1 min-w-0">
            {campaign.soughtGroups.slice(0, 2).map((group) => (
              <span
                key={group}
                className={`inline-flex min-w-[1.75rem] items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide border ${
                  isEnded
                    ? 'bg-warmgray-50 text-warmgray-600 border-warmgray-200'
                    : 'bg-primary-50 text-primary-800 border-primary-100'
                }`}
              >
                {group}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-primary-700 shrink-0">
            <span className="hidden sm:inline">{t('campaigns.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
