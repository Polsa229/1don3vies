import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';
import { haversineDistance, filterCampaignsList } from '@/features/centers/centers.logic';
import { PAGE_SIZE } from '@/features/centers/centers.constants';
import type { SharedFilters } from '@/features/centers/centers.types';
import { NoResults } from '@/components/shared/NoResults';
import { CampaignCard } from '@/components/centers/CampaignCard';
import { CampaignDetailModal } from '@/components/centers/CampaignDetailModal';
import { PaginationBar } from '@/components/centers/PaginationBar';
import { campaigns as allCampaigns } from '@/data/campaigns.data';
import type { Campaign } from '@/features/eligibility/eligibility.types';
import { staggerContainer } from '@/lib/motion';
import { Info, ArrowRight } from 'lucide-react';

export function CampaignsView({
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
        allCampaigns,
        shared.search,
        shared.cityFilter,
        shared.typeFilter,
        shared.appointmentFilter,
        shared.statusFilter,
        shared.geo.coords,
      );
    }
    return filterCampaignsList(allCampaigns, '', 'all', 'all', 'all', 'all', null);
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
            className={`grid grid-cols-2 gap-3 sm:gap-5 ${
              dense ? '' : 'lg:grid-cols-3'
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
