import { useI18n } from '@/i18n/I18nContext';
import { Droplet } from 'lucide-react';

/**
 * Discrete sticky CTA bar that stays visible while scrolling.
 * Appears below the navbar and links to the eligibility simulator.
 */
export function StickyCta() {
  const { t, lang } = useI18n();

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="sticky top-16 lg:top-20 z-30 bg-bordeaux-700/95 backdrop-blur-sm border-b border-bordeaux-600/50">
      <div className="container-hemo flex items-center justify-between py-2.5 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Droplet className="w-4 h-4 text-ivory-50 shrink-0" fill="currentColor" />
          <p className="text-sm text-ivory-100 truncate">
            {lang === 'fr'
              ? 'Prêt à sauver des vies ? Vérifiez votre éligibilité.'
              : 'Ready to save lives? Check your eligibility.'}
          </p>
        </div>
        <button
          onClick={() => scrollTo('eligibility')}
          className="shrink-0 px-4 py-1.5 text-sm font-medium rounded-full bg-ivory-50 text-bordeaux-700 hover:bg-ivory-100 transition-colors"
        >
          {t('hero.cta' as never)}
        </button>
      </div>
    </div>
  );
}
