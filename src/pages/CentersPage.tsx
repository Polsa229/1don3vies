import { useEffect } from 'react';
import { CentersSection } from '@/sections/CentersSection';

export function CentersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main-content" className="pt-16 lg:pt-20">
      <CentersSection compact />
    </main>
  );
}
