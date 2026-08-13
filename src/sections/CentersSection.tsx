import { useState, useMemo, useEffect, type ReactNode, lazy, Suspense } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CountdownBlocks } from '@/components/shared/CountdownBlocks';
import { useI18n } from '@/i18n/useI18n';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { Button } from '@/components/ui/Button';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { useMounted } from '@/lib/hooks/useMounted';
import { getCenterStatus, haversineDistance } from '@/features/centers/centers.logic';
import { getCampaignLifecycle } from '@/features/centers/campaign.logic';
import { centers as allCenters } from '@/data/centers.data';
import { campaigns as allCampaigns } from '@/data/campaigns.data';
import type { Center, Campaign, DonationType } from '@/features/eligibility/eligibility.types';
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion';
import { directionsUrl } from '@/lib/maps';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Users,
  Navigation,
  AlertCircle,
  Building2,
  Heart,
  Info,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  SlidersHorizontal,
  X,
  ListFilter,
  List,
  Map as MapIcon,
} from 'lucide-react';

const DonateMap = lazy(() =>
  import('@/components/shared/DonateMap').then((m) => ({ default: m.DonateMap })),
);

type Tab = 'permanent' | 'campaigns';

const PAGE_SIZE = 6;
const PREVIEW_CAMPAIGNS = 6;

interface SharedFilters {
  search: string;
  cityFilter: string;
  typeFilter: string;
  appointmentFilter: string;
  statusFilter: string;
  geo: ReturnType<typeof useGeolocation>;
}

function filterCentersList(
  search: string,
  cityFilter: string,
  typeFilter: string,
  appointmentFilter: string,
  coords: { lat: number; lng: number } | null,
) {
  let result = allCenters.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.city.toLowerCase().includes(q) &&
        !c.address.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (cityFilter !== 'all' && c.city !== cityFilter) return false;
    if (typeFilter !== 'all' && !c.donationTypes.includes(typeFilter as DonationType)) return false;
    if (appointmentFilter === 'yes' && !c.appointmentRequired) return false;
    if (appointmentFilter === 'no' && c.appointmentRequired) return false;
    return true;
  });

  if (coords) {
    result = result
      .map((c) => ({
        center: c,
        distance: haversineDistance(coords.lat, coords.lng, c.lat, c.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((x) => x.center);
  }

  return result;
}

function filterCampaignsList(
  search: string,
  cityFilter: string,
  typeFilter: string,
  appointmentFilter: string,
  statusFilter: string,
  coords: { lat: number; lng: number } | null,
) {
  let result = allCampaigns.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.city.toLowerCase().includes(q) &&
        !c.location.toLowerCase().includes(q) &&
        !c.organizer.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (cityFilter !== 'all' && c.city !== cityFilter) return false;
    if (typeFilter !== 'all' && !c.donationTypes.includes(typeFilter as DonationType)) return false;
    if (appointmentFilter === 'yes' && !c.appointmentRequired) return false;
    if (appointmentFilter === 'no' && c.appointmentRequired) return false;
    if (statusFilter !== 'all' && getCampaignLifecycle(c) !== statusFilter) return false;
    return true;
  });

  const rank = { ongoing: 0, upcoming: 1, ended: 2 } as const;

  if (coords) {
    result = result
      .map((c) => ({
        campaign: c,
        distance: haversineDistance(coords.lat, coords.lng, c.lat, c.lng),
      }))
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return rank[getCampaignLifecycle(a.campaign)] - rank[getCampaignLifecycle(b.campaign)];
      })
      .map((x) => x.campaign);
  } else {
    result = [...result].sort((a, b) => {
      const ra = rank[getCampaignLifecycle(a)];
      const rb = rank[getCampaignLifecycle(b)];
      if (ra !== rb) return ra - rb;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  return result;
}

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
      filterCentersList(search, cityFilter, typeFilter, appointmentFilter, geo.coords),
    [search, cityFilter, typeFilter, appointmentFilter, geo.coords],
  );

  const campaignsFiltered = useMemo(
    () =>
      filterCampaignsList(
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
      className={`relative ${compact ? 'py-10 lg:py-12' : 'py-24 lg:py-32'}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <InkBlot
          variant={2}
          color="#8F2346"
          className="absolute top-10 -left-40 w-[500px] h-[700px] opacity-[0.03]"
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
                    className={`relative z-10 px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
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
                      <p className="text-xs text-warmgray-500 tabular-nums">
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

interface FiltersState {
  search: string;
  cityFilter: string;
  typeFilter: string;
  appointmentFilter: string;
  statusFilter: string;
  cities: string[];
  resultCount: number;
  geo: ReturnType<typeof useGeolocation>;
  setSearch: (v: string) => void;
  setCityFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setAppointmentFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
}

function CentersFilters({
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
          <p className="text-xs text-warmgray-500 tabular-nums">
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

function PermanentCenters({
  limit,
  shared,
  dense = false,
  prefiltered,
}: {
  limit?: number;
  shared?: SharedFilters;
  dense?: boolean;
  prefiltered?: Center[];
} = {}) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Center | null>(null);
  const isPreview = typeof limit === 'number';

  const filtered = useMemo(() => {
    if (prefiltered) return prefiltered;
    if (shared) {
      return filterCentersList(
        shared.search,
        shared.cityFilter,
        shared.typeFilter,
        shared.appointmentFilter,
        shared.geo.coords,
      );
    }
    return allCenters;
  }, [prefiltered, shared]);

  const geo = shared?.geo;

  useEffect(() => {
    setPage(1);
  }, [
    shared?.search,
    shared?.cityFilter,
    shared?.typeFilter,
    shared?.appointmentFilter,
    filtered.length,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const displayed = isPreview
    ? filtered.slice(0, limit)
    : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      {displayed.length === 0 ? (
        <NoResults
          message={t('centers.noResults')}
          suggestion={t('centers.noResults.suggestion')}
        />
      ) : (
        <>
          <motion.div
            className={`grid grid-cols-1 gap-5 ${
              dense ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {displayed.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                distance={
                  geo?.coords
                    ? haversineDistance(geo.coords.lat, geo.coords.lng, center.lat, center.lng)
                    : null
                }
                onOpen={() => setSelected(center)}
              />
            ))}
          </motion.div>

          {isPreview && (
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Link
                to="/centres"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-700 text-ivory-50 font-medium text-sm hover:bg-primary-800 transition-colors group"
              >
                {t('centers.viewAll')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}

          {!isPreview && totalPages > 1 && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          )}
        </>
      )}

      <CenterDetailModal
        center={selected}
        distance={
          selected && geo?.coords
            ? haversineDistance(geo.coords.lat, geo.coords.lng, selected.lat, selected.lng)
            : null
        }
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function dayLabelsFor(lang: string): Record<string, string> {
  return {
    mon: lang === 'fr' ? 'Lun' : 'Mon',
    tue: lang === 'fr' ? 'Mar' : 'Tue',
    wed: lang === 'fr' ? 'Mer' : 'Wed',
    thu: lang === 'fr' ? 'Jeu' : 'Thu',
    fri: lang === 'fr' ? 'Ven' : 'Fri',
    sat: lang === 'fr' ? 'Sam' : 'Sat',
    sun: lang === 'fr' ? 'Dim' : 'Sun',
  };
}

function DetailModalShell({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-primary-950/70 backdrop-blur-sm"
            aria-label={t('centers.close')}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface shadow-2xl border border-warmgray-200/60"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 bg-surface/95 backdrop-blur-md border-b border-warmgray-100">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">
                {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-ivory-50 border border-warmgray-200 text-warmgray-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-700 transition-colors"
                aria-label={t('centers.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CenterCard({
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
      className="text-left bg-white rounded-2xl border border-warmgray-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group p-5 flex flex-col h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg text-primary-900 leading-tight line-clamp-2">
            {center.name}
          </h3>
          <p className="text-xs text-warmgray-500 mt-1 flex items-center gap-1.5 truncate">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{center.nature}</span>
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            status.isOpen
              ? 'bg-success-100 text-success-700'
              : 'bg-warmgray-100 text-warmgray-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-success-500' : 'bg-warmgray-400'}`}
          />
          {status.isOpen ? t('centers.open') : t('centers.closed')}
        </span>
      </div>

      <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-3">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
        <span className="line-clamp-2">
          {center.city}
          {distance !== null ? ` · ${distance} km` : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {center.donationTypes.slice(0, 3).map((type) => (
          <span
            key={type}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
          >
            {t(`centers.filter.type.${type}` as never)}
          </span>
        ))}
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
        {t('centers.viewDetails')}
        <ArrowRight className="w-4 h-4" />
      </span>
    </motion.button>
  );
}

function CenterDetailModal({
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
            <p className="text-sm text-warmgray-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {center.nature}
            </p>
            <span
              className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                status.isOpen
                  ? 'bg-success-100 text-success-700'
                  : 'bg-warmgray-100 text-warmgray-500'
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
              <span className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide">
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
            <p className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide mb-2">
              {t('centers.types')}
            </p>
            <div className="flex flex-wrap gap-2">
              {center.donationTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                >
                  {t(`centers.filter.type.${type}` as never)}
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

function NoResults({ message, suggestion }: { message: string; suggestion: string }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-warmgray-100 flex items-center justify-center mx-auto mb-4">
        <Search className="w-7 h-7 text-warmgray-400" />
      </div>
      <p className="text-lg font-display text-primary-900 mb-2">{message}</p>
      <p className="text-sm text-warmgray-500 max-w-sm mx-auto">{suggestion}</p>
    </div>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { t } = useI18n();
  const btnClass =
    'inline-flex items-center justify-center gap-1.5 min-h-11 px-3 sm:px-4 rounded-full text-sm font-semibold border border-warmgray-200 bg-surface text-primary-800 hover:bg-primary-50 hover:border-primary-200 disabled:opacity-35 disabled:pointer-events-none disabled:hover:bg-surface disabled:hover:border-warmgray-200 transition-colors';

  return (
    <motion.nav
      className="mt-8 sm:mt-10 flex items-center justify-between gap-2 sm:gap-4 max-w-md mx-auto"
      aria-label="Pagination"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      <button type="button" onClick={onPrev} disabled={currentPage <= 1} className={`${btnClass} flex-1`}>
        <ChevronLeft className="w-4 h-4 shrink-0" />
        <span className="truncate">{t('centers.pagination.prev')}</span>
      </button>
      <p className="shrink-0 px-2 text-sm font-medium text-warmgray-600 tabular-nums text-center min-w-[4.5rem]">
        {currentPage} {t('centers.pagination.of')} {totalPages}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className={`${btnClass} flex-1`}
      >
        <span className="truncate">{t('centers.pagination.next')}</span>
        <ChevronRight className="w-4 h-4 shrink-0" />
      </button>
    </motion.nav>
  );
}

function CampaignsView({
  limit,
  showAllLink = false,
  shared,
  dense = false,
  prefiltered,
}: {
  limit?: number;
  showAllLink?: boolean;
  shared?: SharedFilters;
  dense?: boolean;
  prefiltered?: Campaign[];
} = {}) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const isPreview = typeof limit === 'number';

  const filtered = useMemo(() => {
    if (prefiltered) return prefiltered;
    if (shared) {
      return filterCampaignsList(
        shared.search,
        shared.cityFilter,
        shared.typeFilter,
        shared.appointmentFilter,
        shared.statusFilter,
        shared.geo.coords,
      );
    }
    return filterCampaignsList('', 'all', 'all', 'all', 'all', null);
  }, [prefiltered, shared]);

  const geo = shared?.geo;

  useEffect(() => {
    setPage(1);
  }, [
    shared?.search,
    shared?.cityFilter,
    shared?.typeFilter,
    shared?.appointmentFilter,
    shared?.statusFilter,
    filtered.length,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const displayed = isPreview
    ? filtered.slice(0, limit)
    : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <motion.div
        className="flex items-start gap-2.5 text-sm text-warmgray-600 bg-surface border border-warmgray-200/80 rounded-2xl px-4 py-3.5 mb-6 shadow-sm shadow-primary-900/[0.03]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-accent-600" />
        <span>{t('campaigns.infoOnly')}</span>
      </motion.div>

      {displayed.length === 0 ? (
        <NoResults
          message={t('campaigns.noResults')}
          suggestion={t('campaigns.noResults.suggestion')}
        />
      ) : (
        <>
          <motion.div
            className={`grid grid-cols-1 gap-5 ${
              dense ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {displayed.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                distance={
                  geo?.coords
                    ? haversineDistance(geo.coords.lat, geo.coords.lng, campaign.lat, campaign.lng)
                    : null
                }
                onOpen={() => setSelected(campaign)}
              />
            ))}
          </motion.div>

          {showAllLink && (
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Link
                to="/centres?tab=campaigns"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-700 text-ivory-50 font-medium text-sm hover:bg-primary-800 transition-colors group"
              >
                {t('campaigns.viewAll')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}

          {!isPreview && totalPages > 1 && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          )}
        </>
      )}

      <CampaignDetailModal campaign={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function CampaignCard({
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

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusBadge}`}
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
        </div>

        <h3
          className={`font-display text-lg leading-snug mb-3 line-clamp-2 text-balance ${
            isEnded ? 'text-warmgray-700' : 'text-primary-900'
          }`}
        >
          {campaign.name}
        </h3>

        <div className="space-y-1.5 text-sm text-warmgray-600 mb-4">
          <p className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-warmgray-400" />
            <span className="truncate">
              {campaign.city} · {dateShort}
              {distance != null ? ` · ${distance} km` : ''}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0 text-warmgray-400" />
            {campaign.startTime} — {campaign.endTime}
          </p>
        </div>

        {!isEnded ? (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-warmgray-400 font-semibold mb-2">
              {t(isOngoing ? 'campaigns.status.ongoingEndsIn' : 'campaigns.status.startsIn')}
            </p>
            <CountdownBlocks countdown={countdown} compact />
          </div>
        ) : (
          campaign.bagsCollected != null && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800 border border-primary-100 self-start">
              <Droplet className="w-3.5 h-3.5 text-primary-600" fill="currentColor" />
              {t('campaigns.status.bagsCollected').replace('{n}', String(campaign.bagsCollected))}
            </div>
          )
        )}

        <div className="mt-auto pt-3 border-t border-warmgray-100 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {campaign.soughtGroups.slice(0, 3).map((group) => (
              <span
                key={group}
                className={`inline-flex min-w-[2.25rem] items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${
                  isEnded
                    ? 'bg-warmgray-50 text-warmgray-500 border-warmgray-200'
                    : 'bg-primary-50 text-primary-800 border-primary-100'
                }`}
              >
                {group}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 shrink-0">
            {t('campaigns.viewDetails')}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function CampaignDetailModal({
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
