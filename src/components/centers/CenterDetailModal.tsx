import { useI18n } from '@/i18n/useI18n';
import { getCenterStatus } from '@/features/centers/centers.logic';
import { dayLabelsFor, DONATION_TYPE_LABEL_KEY } from '@/features/centers/centers.ui-helpers';
import { DetailModalShell } from '@/components/centers/DetailModalShell';
import { useMounted } from '@/lib/hooks/useMounted';
import type { Center } from '@/features/eligibility/eligibility.types';
import { directionsUrl } from '@/lib/maps';
import { MapPin, Clock, Phone, Mail, Building2, Navigation } from 'lucide-react';

export function CenterDetailModal({
  center,
  distance,
  onClose,
}: {
  center: Center | null;
  distance: number | null;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  const mounted = useMounted();
  const status = center && mounted ? getCenterStatus(center) : { isOpen: false, todayHours: '' };
  const dayLabels = dayLabelsFor(lang);

  return (
    <DetailModalShell open={!!center} title={t('centers.details')} onClose={onClose}>
      {center && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display text-2xl text-primary-900 leading-tight mb-2">
              {center.name}
            </h3>
            <p className="text-sm text-warmgray-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {center.nature}
            </p>
            <span
              className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                status.isOpen
                  ? 'bg-success-100 text-success-700'
                  : 'bg-warmgray-100 text-warmgray-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-success-500' : 'bg-warmgray-400'}`}
              />
              {status.isOpen ? t('centers.open') : t('centers.closed')}
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-warmgray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
            <span>
              {center.postalCode
                ? `${center.address}, ${center.postalCode} ${center.city}`
                : `${center.address}`}
              {distance !== null && (
                <span className="block mt-1 font-medium text-accent-600">
                  {t('centers.distance')} {distance} km
                </span>
              )}
            </span>
          </div>

          <a
            href={directionsUrl(center.lat, center.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-100 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {t('centers.map.directions')}
          </a>

          <div className="bg-ivory-50 rounded-2xl p-4 border border-warmgray-100">
            <div className="flex items-center gap-1.5 mb-3">
              <Clock className="w-3.5 h-3.5 text-warmgray-400" />
              <span className="text-xs font-semibold text-warmgray-600 uppercase tracking-wide">
                {t('centers.hours')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-warmgray-600">
              {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                <div key={day} className="flex justify-between gap-2">
                  <span className="font-medium">{dayLabels[day]}</span>
                  <span className={center.hours[day] === 'Fermé' ? 'text-warmgray-400' : ''}>
                    {center.hours[day] === 'Fermé'
                      ? lang === 'fr'
                        ? 'Fermé'
                        : 'Closed'
                      : center.hours[day]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-warmgray-600 uppercase tracking-wide mb-2">
              {t('centers.types')}
            </p>
            <div className="flex flex-wrap gap-2">
              {center.donationTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                >
                  {t(DONATION_TYPE_LABEL_KEY[type])}
                </span>
              ))}
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              center.appointmentRequired
                ? 'bg-accent-50 text-accent-700 border border-accent-200'
                : 'bg-success-50 text-success-700 border border-success-200'
            }`}
          >
            {center.appointmentRequired ? t('centers.appointment.yes') : t('centers.appointment.no')}
          </span>

          <div className="flex flex-col gap-2 pt-2 border-t border-warmgray-100">
            <a
              href={`tel:${center.phone}`}
              className="flex items-center gap-2 text-sm text-warmgray-600 hover:text-primary-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-warmgray-400" />
              {center.phone}
            </a>
            <a
              href={`mailto:${center.email}`}
              className="flex items-center gap-2 text-sm text-warmgray-600 hover:text-primary-700 transition-colors"
            >
              <Mail className="w-4 h-4 text-warmgray-400" />
              {center.email}
            </a>
          </div>
        </div>
      )}
    </DetailModalShell>
  );
}
