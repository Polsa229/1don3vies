import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { Droplet } from "lucide-react";

/**
 * Discrete sticky CTA bar under the navbar.
 * Hidden while the eligibility section is in view.
 */
export function StickyCta() {
  const { t, lang } = useI18n();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const section = document.getElementById("eligibility");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px -35% 0px",
        threshold: 0,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={`sticky top-16 lg:top-20 z-30 bg-primary/95 backdrop-blur-sm border-b border-primary-dark/40 transition-all duration-200 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="container-hemo flex items-center justify-between py-2.5 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Droplet
            className="w-4 h-4 text-white shrink-0"
            fill="currentColor"
          />
          <p className="text-sm text-white/90 truncate">
            {lang === "fr"
              ? "Prêt à sauver des vies ? Vérifiez votre éligibilité."
              : "Ready to save lives? Check your eligibility."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => scrollTo("eligibility")}
          className="shrink-0 px-3 py-1 text-[11px] sm:px-4 sm:py-1.5 sm:text-sm font-medium rounded-full bg-surface text-primary hover:bg-ivory-100 transition-colors"
        >
          {t("hero.cta" as never)}
        </button>
      </div>
    </div>
  );
}
