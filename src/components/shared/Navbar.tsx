import { useState } from 'react';
import { Menu, X, Droplet } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useScrollSpy } from '@/lib/hooks/useScrollSpy';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

const NAV_ITEMS = [
  { id: 'eligibility', key: 'nav.eligibility' },
  { id: 'process', key: 'nav.process' },
  { id: 'centers', key: 'nav.centers' },
  { id: 'reserves', key: 'nav.reserves' },
  { id: 'why', key: 'nav.why' },
  { id: 'faq', key: 'nav.faq' },
];

export function Navbar() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(NAV_ITEMS.map((n) => n.id));

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ivory-50/80 backdrop-blur-md border-b border-warmgray-200/50">
      <nav className="container-hemo flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
          aria-label="HemoLink — Home"
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-bordeaux-700 transition-transform group-hover:scale-105">
            <Droplet className="w-5 h-5 text-ivory-50" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-medium text-bordeaux-900">
            HemoLink
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeSection === item.id
                  ? 'text-bordeaux-700 bg-bordeaux-50'
                  : 'text-warmgray-600 hover:text-bordeaux-700 hover:bg-bordeaux-50/50'
              }`}
            >
              {t(item.key as never)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            className="lg:hidden p-2 rounded-full hover:bg-warmgray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-warmgray-200/50 bg-ivory-50 animate-fade-in">
          <div className="container-hemo py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'text-bordeaux-700 bg-bordeaux-50'
                    : 'text-warmgray-600 hover:bg-warmgray-50'
                }`}
              >
                {t(item.key as never)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
