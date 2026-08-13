import { useState, useMemo, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { Button } from '@/components/ui/Button';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { useMounted } from '@/lib/hooks/useMounted';
import { getCenterStatus, haversineDistance } from '@/features/centers/centers.logic';
import { centers as allCenters } from '@/data/centers.data';
import { campaigns as allCampaigns } from '@/data/campaigns.data';
import type { Center, Campaign, DonationType, BloodGroup } from '@/features/eligibility/eligibility.types';
import { Search, MapPin, Clock, Phone, Mail, Calendar, Users, Navigation, AlertCircle, Building2, Heart, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'permanent' | 'campaigns';

export function CentersSection({ limit }: { limit?: number } = {}) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>('permanent');

  return (
    <section id="centers" className="relative py-24 lg:py-32 overflow-hidden">
      <InkBlot
        variant={2}
        color="#6B1F35"
        className="absolute top-10 -left-40 w-[500px] h-[700px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="centers.eyebrow"
          titleKey="centers.title"
          subtitleKey="centers.subtitle"
        />

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 rounded-full bg-ivory-100 border border-warmgray-200 p-1">
            <button
              onClick={() => setTab('permanent')}
              aria-pressed={tab === 'permanent'}
              className={`px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                tab === 'permanent'
                  ? 'bg-bordeaux-700 text-ivory-50 shadow-md'
                  : 'text-warmgray-600 hover:text-bordeaux-700'
              }`}
            >
              {t('centers.tab.permanent')}
            </button>
            <button
              onClick={() => setTab('campaigns')}
              aria-pressed={tab === 'campaigns'}
              className={`px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                tab === 'campaigns'
                  ? 'bg-bordeaux-700 text-ivory-50 shadow-md'
                  : 'text-warmgray-600 hover:text-bordeaux-700'
              }`}
            >
              {t('centers.tab.campaigns')}
            </button>
          </div>
        </div>

        {tab === 'permanent' ? <PermanentCenters limit={limit} /> : <CampaignsView />}
      </div>
    </section>
  );
}

function PermanentCenters({ limit }: { limit?: number } = {}) {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();
  const geo = useGeolocation();

  // Simulate loading on mount
  useMemo(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  // When geolocation succeeds, find nearest center and update city filter
  useEffect(() => {
    if (geo.coords) {
      const nearest = allCenters
        .map((c) => ({
          city: c.city,
          dist: haversineDistance(geo.coords!.lat, geo.coords!.lng, c.lat, c.lng),
        }))
        .sort((a, b) => a.dist - b.dist)[0];
      if (nearest) {
        setCityFilter(nearest.city);
      }
    }
  }, [geo.coords]);

  const cities = useMemo(() => {
    return Array.from(new Set(allCenters.map((c) => c.city))).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = allCenters.filter((c) => {
      // Search
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
      // City filter
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      // Type filter
      if (typeFilter !== 'all' && !c.donationTypes.includes(typeFilter as DonationType)) return false;
      // Appointment filter
      if (appointmentFilter === 'yes' && !c.appointmentRequired) return false;
      if (appointmentFilter === 'no' && c.appointmentRequired) return false;
      return true;
    });

    // Sort by distance if geolocation available
    if (geo.coords) {
      result = result
        .map((c) => ({
          center: c,
          distance: haversineDistance(geo.coords!.lat, geo.coords!.lng, c.lat, c.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map((x) => x.center);
    }

    return result;
  }, [search, cityFilter, typeFilter, appointmentFilter, geo.coords]);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {/* Search & filters */}
      <div className="bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warmgray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('centers.search.placeholder')}
              className="w-full pl-12 pr-4 py-3 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-bordeaux-400 transition-colors outline-none"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-bordeaux-400 transition-colors outline-none cursor-pointer"
              aria-label={t('centers.filter.city')}
            >
              <option value="all">{t('centers.filter.city.all')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-bordeaux-400 transition-colors outline-none cursor-pointer"
              aria-label={t('centers.filter.type')}
            >
              <option value="all">{t('centers.filter.type.all')}</option>
              <option value="whole">{t('centers.filter.type.whole')}</option>
              <option value="plasma">{t('centers.filter.type.plasma')}</option>
              <option value="platelets">{t('centers.filter.type.platelets')}</option>
            </select>

            <select
              value={appointmentFilter}
              onChange={(e) => setAppointmentFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-ivory-50 border border-warmgray-200 rounded-xl text-sm focus:border-bordeaux-400 transition-colors outline-none cursor-pointer"
              aria-label={t('centers.filter.appointment')}
            >
              <option value="all">{t('centers.filter.appointment.all')}</option>
              <option value="yes">{t('centers.filter.appointment.yes')}</option>
              <option value="no">{t('centers.filter.appointment.no')}</option>
            </select>

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
          </div>

          {/* Geolocation error */}
          {geo.error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{t('centers.error.geolocation')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <CentersSkeleton />
      ) : displayed.length === 0 ? (
        <NoResults
          message={t('centers.noResults')}
          suggestion={t('centers.noResults.suggestion')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayed.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                distance={
                  geo.coords
                    ? haversineDistance(geo.coords.lat, geo.coords.lng, center.lat, center.lng)
                    : null
                }
              />
            ))}
          </div>
          {limit && filtered.length > limit && (
            <div className="text-center mt-10">
              <Link
                to="/centres"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bordeaux-700 text-ivory-50 font-medium text-sm hover:bg-bordeaux-800 transition-colors group"
              >
                {lang === 'fr' ? 'Voir tous les centres' : 'View all centers'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CenterCard({ center, distance }: { center: Center; distance: number | null }) {
  const { t, lang } = useI18n();
  const mounted = useMounted();
  const status = mounted ? getCenterStatus(center) : { isOpen: false, todayHours: '' };

  const dayLabels: Record<string, string> = {
    mon: lang === 'fr' ? 'Lun' : 'Mon',
    tue: lang === 'fr' ? 'Mar' : 'Tue',
    wed: lang === 'fr' ? 'Mer' : 'Wed',
    thu: lang === 'fr' ? 'Jeu' : 'Thu',
    fri: lang === 'fr' ? 'Ven' : 'Fri',
    sat: lang === 'fr' ? 'Sam' : 'Sat',
    sun: lang === 'fr' ? 'Dim' : 'Sun',
  };

  return (
    <div className="bg-white rounded-2xl border border-warmgray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-lg text-bordeaux-900 leading-tight">{center.name}</h3>
            <p className="text-xs text-warmgray-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {center.nature}
            </p>
          </div>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              status.isOpen
                ? 'bg-success-100 text-success-700'
                : 'bg-warmgray-100 text-warmgray-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-success-500' : 'bg-warmgray-400'}`} />
            {status.isOpen ? t('centers.open') : t('centers.closed')}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
          <span>{center.address}, {center.postalCode} {center.city}</span>
        </div>

        {/* Distance */}
        {distance !== null && (
          <div className="flex items-center gap-2 text-sm text-accent-600 font-medium mb-3">
            <Navigation className="w-4 h-4" />
            <span>{t('centers.distance')} {distance} km</span>
          </div>
        )}

        {/* Hours */}
        <div className="bg-ivory-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-warmgray-400" />
            <span className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide">
              {lang === 'fr' ? 'Horaires' : 'Hours'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-warmgray-600">
            {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
              <div key={day} className="flex justify-between">
                <span className="font-medium">{dayLabels[day]}</span>
                <span className={center.hours[day] === 'Fermé' ? 'text-warmgray-400' : ''}>
                  {center.hours[day] === 'Fermé' ? (lang === 'fr' ? 'Fermé' : 'Closed') : center.hours[day]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donation types */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide mb-2">
            {t('centers.types')}
          </p>
          <div className="flex flex-wrap gap-2">
            {center.donationTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-xs font-medium bg-bordeaux-50 text-bordeaux-700 border border-bordeaux-200"
              >
                {t(`centers.filter.type.${type}` as never)}
              </span>
            ))}
          </div>
        </div>

        {/* Appointment */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              center.appointmentRequired
                ? 'bg-accent-50 text-accent-700 border border-accent-200'
                : 'bg-success-50 text-success-700 border border-success-200'
            }`}
          >
            {center.appointmentRequired ? t('centers.appointment.yes') : t('centers.appointment.no')}
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1.5 pt-4 border-t border-warmgray-100">
          <a href={`tel:${center.phone}`} className="flex items-center gap-2 text-sm text-warmgray-600 hover:text-bordeaux-700 transition-colors">
            <Phone className="w-3.5 h-3.5 text-warmgray-400" />
            {center.phone}
          </a>
          <a href={`mailto:${center.email}`} className="flex items-center gap-2 text-sm text-warmgray-600 hover:text-bordeaux-700 transition-colors">
            <Mail className="w-3.5 h-3.5 text-warmgray-400" />
            {center.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function CentersSkeleton() {
  const { t } = useI18n();
  return (
    <div>
      <p className="text-center text-sm text-warmgray-400 mb-4">{t('centers.loading')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-warmgray-200/50 p-6 animate-pulse">
            <div className="h-5 w-3/4 bg-warmgray-100 rounded mb-3" />
            <div className="h-3 w-1/2 bg-warmgray-100 rounded mb-4" />
            <div className="h-16 bg-warmgray-100 rounded-xl mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-warmgray-100 rounded-full" />
              <div className="h-6 w-16 bg-warmgray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoResults({ message, suggestion }: { message: string; suggestion: string }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-warmgray-100 flex items-center justify-center mx-auto mb-4">
        <Search className="w-7 h-7 text-warmgray-400" />
      </div>
      <p className="text-lg font-display text-bordeaux-900 mb-2">{message}</p>
      <p className="text-sm text-warmgray-500 max-w-sm mx-auto">{suggestion}</p>
    </div>
  );
}

function CampaignsView() {
  const { t, lang } = useI18n();

  return (
    <div>
      <div className="flex items-start gap-2 text-sm text-warmgray-500 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 mb-6">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-accent-600" />
        <span>{t('campaigns.infoOnly')}</span>
      </div>

      {allCampaigns.length === 0 ? (
        <NoResults
          message={t('campaigns.noResults')}
          suggestion={t('campaigns.noResults.suggestion')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { t, lang } = useI18n();
  const countdown = useCountdown(campaign.endDate);

  const campaignDate = new Date(campaign.date);
  const dateStr = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(campaignDate);

  return (
    <div className="bg-white rounded-2xl border border-warmgray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Countdown banner */}
      <div className="bg-gradient-to-r from-bordeaux-700 to-plum-800 px-5 py-3">
        {countdown.isEnded ? (
          <span className="text-sm font-semibold text-bordeaux-200">{t('campaigns.ended')}</span>
        ) : (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-300" />
            <span className="text-xs font-medium text-bordeaux-200">{t('campaigns.endingIn')}</span>
            <div className="flex items-center gap-1.5 ml-auto">
              {countdown.days > 0 && (
                <span className="text-sm font-bold text-ivory-50 tabular-nums">{countdown.days}j</span>
              )}
              <span className="text-sm font-bold text-ivory-50 tabular-nums">
                {String(countdown.hours).padStart(2, '0')}h
              </span>
              <span className="text-sm font-bold text-ivory-50 tabular-nums">
                {String(countdown.minutes).padStart(2, '0')}m
              </span>
              <span className="text-sm font-bold text-accent-300 tabular-nums">
                {String(countdown.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="font-display text-lg text-bordeaux-900 leading-tight mb-3">
          {campaign.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
          <span>{campaign.location}, {campaign.city}</span>
        </div>

        {/* Date */}
        <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-2">
          <Calendar className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
          <span className="capitalize">{dateStr}</span>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-3">
          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
          <span>{t('campaigns.hours')}: {campaign.startTime} — {campaign.endTime}</span>
        </div>

        {/* Organizer */}
        <div className="flex items-start gap-2 text-sm text-warmgray-600 mb-4">
          <Users className="w-4 h-4 mt-0.5 shrink-0 text-warmgray-400" />
          <div>
            <span className="text-xs text-warmgray-400">{t('campaigns.organizer')}: </span>
            <span className="font-medium">{campaign.organizer}</span>
            <span className="text-warmgray-400"> × {campaign.partner}</span>
          </div>
        </div>

        {/* Sought groups */}
        <div className="mt-auto pt-4 border-t border-warmgray-100">
          <p className="text-xs font-semibold text-warmgray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-bordeaux-500" />
            {t('campaigns.soughtGroups')}
          </p>
          <div className="flex flex-wrap gap-2">
            {campaign.soughtGroups.map((group) => (
              <span
                key={group}
                className="px-3 py-1 rounded-full text-xs font-bold bg-bordeaux-700 text-ivory-50"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
