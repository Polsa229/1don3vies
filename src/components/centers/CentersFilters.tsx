import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/components/ui/Button';
import type { FiltersState } from '@/features/centers/centers.types';
import { Search, Navigation, AlertCircle, SlidersHorizontal } from 'lucide-react';

export function CentersFilters({
  state,
  layout,
  hideSearch = false,
  mode = 'centers',
}: {
  state: FiltersState;
  layout: 'sidebar' | 'bar' | 'sheet';
  hideSearch?: boolean;
  mode?: 'centers' | 'campaigns';
}) {
  const { t } = useI18n();
  const {
    search,
    cityFilter,
    typeFilter,
    appointmentFilter,
    statusFilter,
    cities,
    resultCount,
    geo,
    setSearch,
    setCityFilter,
    setTypeFilter,
    setAppointmentFilter,
    setStatusFilter,
  } = state;

  const fieldClass =
    'w-full px-3.5 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-primary-400 transition-colors outline-none cursor-pointer';

  const showHeader = layout === 'sidebar';
  const stacked = layout === 'sidebar' || layout === 'sheet';

  return (
    <div
      className={`bg-surface/95 backdrop-blur-md border border-warmgray-200/70 shadow-sm shadow-primary-900/[0.03] ${
        layout === 'sheet' ? 'rounded-none border-0 shadow-none bg-transparent p-0' : 'rounded-2xl p-5 sm:p-6'
      }`}
    >
      {showHeader && (
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-warmgray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-600" />
            <p className="text-sm font-semibold text-primary-900">{t('centers.filters.title')}</p>
          </div>
          <p className="text-xs text-warmgray-600 tabular-nums">
            {t('centers.filters.results').replace('{n}', String(resultCount))}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('centers.search.placeholder')}
              className="w-full pl-10 pr-3.5 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-primary-400 transition-colors outline-none"
            />
          </div>
        )}

        <div className={stacked ? 'flex flex-col gap-3' : 'flex flex-col sm:flex-row gap-3'}>
          <label className={stacked ? 'block space-y-1.5' : 'flex-1'}>
            {stacked && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-warmgray-400">
                {t('centers.filter.city')}
              </span>
            )}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className={fieldClass}
              aria-label={t('centers.filter.city')}
            >
              <option value="all">{t('centers.filter.city.all')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className={stacked ? 'block space-y-1.5' : 'flex-1'}>
            {stacked && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-warmgray-400">
                {t('centers.filter.type')}
              </span>
            )}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={fieldClass}
              aria-label={t('centers.filter.type')}
            >
              <option value="all">{t('centers.filter.type.all')}</option>
              <option value="whole">{t('centers.filter.type.whole')}</option>
              <option value="plasma">{t('centers.filter.type.plasma')}</option>
              <option value="platelets">{t('centers.filter.type.platelets')}</option>
            </select>
          </label>

          <label className={stacked ? 'block space-y-1.5' : 'flex-1'}>
            {stacked && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-warmgray-400">
                {t('centers.filter.appointment')}
              </span>
            )}
            <select
              value={appointmentFilter}
              onChange={(e) => setAppointmentFilter(e.target.value)}
              className={fieldClass}
              aria-label={t('centers.filter.appointment')}
            >
              <option value="all">{t('centers.filter.appointment.all')}</option>
              <option value="yes">{t('centers.filter.appointment.yes')}</option>
              <option value="no">{t('centers.filter.appointment.no')}</option>
            </select>
          </label>

          <AnimatePresence initial={false}>
            {mode === 'campaigns' && (
              <motion.label
                key="status-filter"
                className={stacked ? 'block space-y-1.5 overflow-hidden' : 'flex-1 overflow-hidden'}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {stacked && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-warmgray-400">
                    {t('campaigns.filter.status')}
                  </span>
                )}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={fieldClass}
                  aria-label={t('campaigns.filter.status')}
                >
                  <option value="all">{t('campaigns.filter.status.all')}</option>
                  <option value="ongoing">{t('campaigns.filter.status.ongoing')}</option>
                  <option value="upcoming">{t('campaigns.filter.status.upcoming')}</option>
                  <option value="ended">{t('campaigns.filter.status.ended')}</option>
                </select>
              </motion.label>
            )}
          </AnimatePresence>

          {!stacked && (
            <Button
              variant="outline"
              size="sm"
              onClick={geo.requestLocation}
              disabled={geo.loading}
              className="whitespace-nowrap"
            >
              <Navigation className="w-4 h-4" />
              {geo.loading ? t('centers.geolocate.loading') : t('centers.geolocate')}
            </Button>
          )}
        </div>

        {stacked && (
          <Button
            variant="outline"
            size="sm"
            onClick={geo.requestLocation}
            disabled={geo.loading}
            className="w-full"
          >
            <Navigation className="w-4 h-4" />
            {geo.loading ? t('centers.geolocate.loading') : t('centers.geolocate')}
          </Button>
        )}

        {geo.error && (
          <div className="flex items-start gap-2 text-sm text-error-700 bg-error-50 border border-error-200 rounded-xl px-3.5 py-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t('centers.error.geolocation')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
