import { useEffect } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { CentersSection } from '@/sections/CentersSection';

export function CentersPage() {
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-16 lg:pt-20">
      <CentersSection />
    </main>
  );
}
