import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';
import { haversineDistance, filterCentersList } from '@/features/centers/centers.logic';
import { PAGE_SIZE } from '@/features/centers/centers.constants';
import type { SharedFilters } from '@/features/centers/centers.types';
import { NoResults } from '@/components/shared/NoResults';
import { CenterCard } from '@/components/centers/CenterCard';
import { CenterDetailModal } from '@/components/centers/CenterDetailModal';
import { PaginationBar } from '@/components/centers/PaginationBar';
import { centers as allCenters } from '@/data/centers.data';
import type { Center } from '@/features/eligibility/eligibility.types';
import { staggerContainer } from '@/lib/motion';
import { ArrowRight } from 'lucide-react';

export function PermanentCenters({
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
        allCenters,
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
            className={`grid grid-cols-2 gap-3 sm:gap-5 ${
              dense ? '' : 'lg:grid-cols-3'
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
