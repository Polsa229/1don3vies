import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/useI18n';
import { getCenterStatus } from '@/features/centers/centers.logic';
import { DONATION_TYPE_LABEL_KEY } from '@/features/centers/centers.ui-helpers';
import { useMounted } from '@/lib/hooks/useMounted';
import type { Center } from '@/features/eligibility/eligibility.types';
import { fadeUp } from '@/lib/motion';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

export function CenterCard({
  center,
  distance,
  onOpen,
}: {
  center: Center;
  distance: number | null;
  onOpen: () => void;
}) {
  const { t } = useI18n();
  const mounted = useMounted();
  const status = mounted ? getCenterStatus(center) : { isOpen: false, todayHours: '' };

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onOpen}
      className="text-left bg-white rounded-2xl border border-warmgray-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group p-3 sm:p-5 flex flex-col h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span
        className={`self-start mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${
          status.isOpen
            ? 'bg-success-100 text-success-700'
            : 'bg-warmgray-100 text-warmgray-600'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-success-500' : 'bg-warmgray-400'}`}
        />
        <span className="sm:hidden">
          {status.isOpen ? t('centers.open.short') : t('centers.closed.short')}
        </span>
        <span className="hidden sm:inline">
          {status.isOpen ? t('centers.open') : t('centers.closed')}
        </span>
      </span>

      <h3 className="font-display text-[13px] sm:text-lg text-primary-900 leading-snug line-clamp-2 mb-1.5">
        {center.name}
      </h3>

      <p className="hidden sm:flex text-xs text-warmgray-600 mb-2 items-center gap-1.5 truncate">
        <Building2 className="w-3 h-3 shrink-0" />
        <span className="truncate">{center.nature}</span>
      </p>

      <div className="flex items-center gap-1.5 text-[11px] sm:text-sm text-warmgray-600 mb-3 min-w-0">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-warmgray-400" />
        <span className="truncate">
          {center.city}
          {distance !== null ? ` · ${distance} km` : ''}
        </span>
      </div>

      <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
        {center.donationTypes.slice(0, 3).map((type) => (
          <span
            key={type}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
          >
            {t(DONATION_TYPE_LABEL_KEY[type])}
          </span>
        ))}
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
        {t('centers.viewDetails')}
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </span>
    </motion.button>
  );
}
