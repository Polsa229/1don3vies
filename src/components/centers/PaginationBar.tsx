import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/useI18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationBar({
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
