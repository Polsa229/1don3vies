import { Home, MapPin, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';
import { goHome, goToSection } from '@/lib/navigation';

const ITEMS = [
  { id: 'home', icon: Home, labelKey: 'mobileNav.home' as const },
  { id: 'centers', icon: MapPin, labelKey: 'mobileNav.centers' as const },
  { id: 'faq', icon: HelpCircle, labelKey: 'mobileNav.faq' as const },
] as const;

/**
 * Moodboard-inspired bottom navigation for small screens.
 */
export function MobileBottomNav() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const onCentres = location.pathname === '/centres';

  function handle(id: (typeof ITEMS)[number]['id']) {
    if (id === 'home') {
      goHome({ pathname: location.pathname, navigate });
      return;
    }
    if (id === 'centers') {
      if (onCentres) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      navigate('/centres');
      return;
    }
    goToSection('faq', { pathname: location.pathname, navigate });
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-warmgray-200/80 bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigation mobile"
    >
      <div className="grid grid-cols-3 max-w-lg mx-auto">
        {ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const active =
            (id === 'home' && location.pathname === '/' && !location.hash) ||
            (id === 'centers' && onCentres) ||
            (id === 'faq' && location.hash === '#faq');

          return (
            <button
              key={id}
              type="button"
              onClick={() => handle(id)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                active ? 'text-primary' : 'text-warmgray-500 hover:text-primary-700'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.7} />
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
