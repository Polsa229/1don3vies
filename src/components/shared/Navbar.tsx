import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Droplet } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { goHome, goToSection } from "@/lib/navigation";

const NAV_ITEMS = [
  { id: "eligibility", key: "nav.eligibility" },
  { id: "process", key: "nav.process" },
  { id: "centers", key: "nav.centers" },
  { id: "reserves", key: "nav.reserves" },
  { id: "why", key: "nav.why" },
  { id: "faq", key: "nav.faq" },
] as const;

const NAV_IDS = NAV_ITEMS.map((n) => n.id);

export function Navbar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(NAV_IDS);
  const onCentresPage = location.pathname === "/centres";

  function handleHome() {
    setMobileOpen(false);
    goHome({ pathname: location.pathname, navigate });
  }

  function handleSection(id: string) {
    setMobileOpen(false);
    goToSection(id, { pathname: location.pathname, navigate });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/80">
      <nav className="container-hemo flex items-center justify-between h-16 lg:h-20">
        <button
          type="button"
          onClick={handleHome}
          className="flex items-center gap-2.5 group"
          aria-label={t("nav.home.label")}
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary transition-transform group-hover:scale-105">
            <Droplet className="w-5 h-5 text-white" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-medium text-primary-900">
            1Don3Vies
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleSection(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeSection === item.id ||
                (item.id === "centers" && onCentresPage)
                  ? "text-primary-700 bg-primary-50"
                  : "text-warmgray-600 hover:text-primary-700 hover:bg-primary-50/50"
              }`}
            >
              {t(item.key)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            className="lg:hidden p-2 rounded-full hover:bg-warmgray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t(mobileOpen ? "nav.menu.close" : "nav.menu.open")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden border-t border-warmgray-200/50 bg-ivory-50 animate-fade-in"
        >
          <div className="container-hemo py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleSection(item.id)}
                className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.id ||
                  (item.id === "centers" && onCentresPage)
                    ? "text-primary-700 bg-primary-50"
                    : "text-warmgray-600 hover:bg-warmgray-50"
                }`}
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
