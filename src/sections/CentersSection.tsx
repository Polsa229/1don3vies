import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { Button } from '@/components/ui/Button';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { haversineDistance, filterCentersList, filterCampaignsList } from '@/features/centers/centers.logic';
import { PREVIEW_CAMPAIGNS } from '@/features/centers/centers.constants';
import type { Tab, SharedFilters, FiltersState } from '@/features/centers/centers.types';
import { CentersFilters } from '@/components/centers/CentersFilters';
import { PermanentCenters } from '@/components/centers/PermanentCenters';
import { CampaignsView } from '@/components/centers/CampaignsView';
import { CenterDetailModal } from '@/components/centers/CenterDetailModal';
import { CampaignDetailModal } from '@/components/centers/CampaignDetailModal';
import { centers as allCenters } from '@/data/centers.data';
import { campaigns as allCampaigns } from '@/data/campaigns.data';
import type { Center, Campaign } from '@/features/eligibility/eligibility.types';
import { viewportOnce } from '@/lib/motion';
import { Search, ListFilter, X, List, Map as MapIcon } from 'lucide-react';

const DonateMap = lazy(() =>
  import('@/components/shared/DonateMap').then((m) => ({ default: m.DonateMap })),
);

export function CentersSection({
  limit,
  compact = false,
}: { limit?: number; compact?: boolean } = {}) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localTab, setLocalTab] = useState<Tab>('permanent');

  const isPage = compact && limit == null;
  const isPreview = typeof limit === 'number';

  const tab: Tab = isPage
    ? searchParams.get('tab') === 'campaigns'
      ? 'campaigns'
      : 'permanent'
    : localTab;

  function setTab(next: Tab) {
    if (isPage) {
      if (next === 'campaigns') {
        setSearchParams({ tab: 'campaigns' }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
      return;
    }
    setLocalTab(next);
  }

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mapCenter, setMapCenter] = useState<Center | null>(null);
  const [mapCampaign, setMapCampaign] = useState<Campaign | null>(null);
  const geo = useGeolocation();

  const cities = useMemo(
    () =>
      Array.from(
        new Set([...allCenters.map((c) => c.city), ...allCampaigns.map((c) => c.city)]),
      ).sort(),
    [],
  );

  useEffect(() => {
    if (!isPage || !geo.coords) return;
    const pool = [...allCenters, ...allCampaigns];
    const nearest = pool
      .map((c) => ({
        city: c.city,
        dist: haversineDistance(geo.coords!.lat, geo.coords!.lng, c.lat, c.lng),
      }))
      .sort((a, b) => a.dist - b.dist)[0];
    if (nearest) setCityFilter(nearest.city);
  }, [geo.coords, isPage]);

  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  const shared: SharedFilters = {
    search,
    cityFilter,
    typeFilter,
    appointmentFilter,
    statusFilter,
    geo,
  };

  const centersFiltered = useMemo(
    () =>
      filterCentersList(allCenters, search, cityFilter, typeFilter, appointmentFilter, geo.coords),
    [search, cityFilter, typeFilter, appointmentFilter, geo.coords],
  );

  const campaignsFiltered = useMemo(
    () =>
      filterCampaignsList(
        allCampaigns,
        search,
        cityFilter,
        typeFilter,
        appointmentFilter,
        statusFilter,
        geo.coords,
      ),
    [search, cityFilter, typeFilter, appointmentFilter, statusFilter, geo.coords],
  );

  const resultCount = tab === 'permanent' ? centersFiltered.length : campaignsFiltered.length;

  const filterState: FiltersState = {
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
  };

  const activeFilterCount = [
    cityFilter,
    typeFilter,
    appointmentFilter,
    ...(tab === 'campaigns' ? [statusFilter] : []),
  ].filter((v) => v !== 'all').length;

  function resetFilters() {
    setCityFilter('all');
    setTypeFilter('all');
    setAppointmentFilter('all');
    setStatusFilter('all');
  }

  const filterMode = tab === 'campaigns' ? 'campaigns' : 'centers';

  const mapMarkers = useMemo(() => {
    if (tab === 'permanent') {
      return centersFiltered.map((c) => ({
        id: c.id,
        name: c.name,
        city: c.city,
        lat: c.lat,
        lng: c.lng,
        subtitle: c.nature,
      }));
    }
    return campaignsFiltered.map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      lat: c.lat,
      lng: c.lng,
      subtitle: c.location,
    }));
  }, [tab, centersFiltered, campaignsFiltered]);

  useEffect(() => {
    setMapCenter(null);
    setMapCampaign(null);
  }, [tab]);

  function handleMapSelect(id: string) {
    if (tab === 'permanent') {
      setMapCenter(allCenters.find((c) => c.id === id) ?? null);
      return;
    }
    setMapCampaign(allCampaigns.find((c) => c.id === id) ?? null);
  }

  return (
    <section
      id="centers"
      className={`relative ${compact ? 'py-6 lg:py-12' : 'py-8 lg:py-24'}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <InkBlot
          variant={2}
          className="absolute top-10 -left-40 w-[500px] h-[700px] opacity-[0.03] text-primary"
        />
      </div>

      <div className="container-hemo relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrowKey="centers.eyebrow"
            titleKey="centers.title"
            subtitleKey="centers.subtitle"
            className={compact ? '!mb-6' : ''}
          />
        </motion.div>

        <LayoutGroup>
          <div
            className={`flex flex-col gap-4 mb-6 lg:mb-8 ${
              isPage
                ? 'sm:flex-row sm:items-center sm:justify-between'
                : 'items-center'
            }`}
          >
            <div
              className={`flex ${
                isPage ? 'justify-center sm:justify-start flex-1' : 'justify-center'
              }`}
            >
              <div className="relative inline-flex items-center gap-1 rounded-full bg-ivory-100 border border-warmgray-200 p-1">
                {(['permanent', 'campaigns'] as const).map((id) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setTab(id)}
                    aria-pressed={tab === id}
                    className={`relative z-10 px-3 sm:px-6 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
                      tab === id ? 'text-ivory-50' : 'text-warmgray-600 hover:text-primary-700'
                    }`}
                  >
                    {tab === id && (
                      <motion.span
                        layoutId="centers-tab-pill"
                        className="absolute inset-0 rounded-full bg-primary-700 shadow-md"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">
                      {t(id === 'permanent' ? 'centers.tab.permanent' : 'centers.tab.campaigns')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isPage && (
              <div className="inline-flex self-center sm:self-auto items-center gap-1 rounded-full bg-ivory-100 border border-warmgray-200 p-1">
                {(
                  [
                    { id: 'list' as const, icon: List, label: t('centers.view.list') },
                    { id: 'map' as const, icon: MapIcon, label: t('centers.view.map') },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setViewMode(id)}
                    aria-pressed={viewMode === id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      viewMode === id
                        ? 'bg-primary-700 text-ivory-50 shadow-sm'
                        : 'text-warmgray-600 hover:text-primary-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </LayoutGroup>

        {isPage ? (
          <div className="lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
            <aside className="hidden lg:block lg:sticky lg:top-24 z-20 self-start">
              <div className="lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:overscroll-contain">
                <CentersFilters state={filterState} layout="sidebar" mode={filterMode} />
              </div>
            </aside>

            <div className="min-w-0 flex flex-col">
              <div className="lg:hidden sticky top-20 z-20 mb-5 -mx-1 px-1">
                <div className="flex items-center gap-2 rounded-2xl bg-surface/95 backdrop-blur-md border border-warmgray-200/80 p-2 shadow-sm">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('centers.search.placeholder')}
                      className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-primary-400 transition-colors outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-warmgray-200 bg-ivory-50 text-sm font-semibold text-foreground hover:border-primary-300 hover:text-primary-800 transition-colors"
                  >
                    <ListFilter className="w-4 h-4" />
                    <span>{t('centers.filters.title')}</span>
                    {activeFilterCount > 0 && (
                      <span className="inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white px-1.5">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tab}-${viewMode}`}
                  className={viewMode === 'map' ? 'flex-1 min-h-[min(70vh,560px)]' : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {viewMode === 'map' ? (
                    <Suspense
                      fallback={
                        <div className="h-[min(70vh,560px)] rounded-2xl border border-warmgray-200 bg-ivory-50 animate-pulse" />
                      }
                    >
                      <DonateMap
                        markers={mapMarkers}
                        userCoords={geo.coords}
                        onSelect={handleMapSelect}
                      />
                    </Suspense>
                  ) : tab === 'permanent' ? (
                    <PermanentCenters shared={shared} dense prefiltered={centersFiltered} />
                  ) : (
                    <CampaignsView shared={shared} dense prefiltered={campaignsFiltered} />
                  )}
                </motion.div>
              </AnimatePresence>

              <CenterDetailModal
                center={mapCenter}
                distance={
                  mapCenter && geo.coords
                    ? haversineDistance(
                        geo.coords.lat,
                        geo.coords.lng,
                        mapCenter.lat,
                        mapCenter.lng,
                      )
                    : null
                }
                onClose={() => setMapCenter(null)}
              />
              <CampaignDetailModal
                campaign={mapCampaign}
                onClose={() => setMapCampaign(null)}
              />
            </div>

            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-end lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    type="button"
                    className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm"
                    aria-label={t('centers.close')}
                    onClick={() => setFiltersOpen(false)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('centers.filters.title')}
                    className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface shadow-2xl border-t border-warmgray-200"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  >
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 bg-surface/95 backdrop-blur-md border-b border-warmgray-100">
                      <div className="flex items-center gap-2">
                        <ListFilter className="w-4 h-4 text-primary-600" />
                        <p className="text-sm font-semibold text-primary-900">
                          {t('centers.filters.title')}
                        </p>
                        {activeFilterCount > 0 && (
                          <span className="inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white px-1.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiltersOpen(false)}
                        className="w-9 h-9 rounded-full bg-ivory-50 border border-warmgray-200 text-warmgray-600 flex items-center justify-center"
                        aria-label={t('centers.close')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 pb-8 space-y-5">
                      <CentersFilters
                        state={filterState}
                        layout="sheet"
                        hideSearch
                        mode={filterMode}
                      />
                      <p className="text-xs text-warmgray-600 tabular-nums">
                        {t('centers.filters.results').replace('{n}', String(resultCount))}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button size="md" className="w-full" onClick={() => setFiltersOpen(false)}>
                          {t('centers.filters.apply')}
                        </Button>
                        {activeFilterCount > 0 && (
                          <button
                            type="button"
                            onClick={resetFilters}
                            className="w-full py-2.5 text-sm font-semibold text-warmgray-600 hover:text-primary-700 transition-colors"
                          >
                            {t('centers.filters.reset')}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === 'permanent' ? (
                <PermanentCenters limit={isPreview ? limit : undefined} />
              ) : (
                <CampaignsView
                  limit={isPreview ? PREVIEW_CAMPAIGNS : undefined}
                  showAllLink={isPreview}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
