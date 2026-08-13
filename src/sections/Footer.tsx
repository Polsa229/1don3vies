import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/useI18n";
import { InkBlot } from "@/components/shared/InkBlot";
import { Droplet, ShieldAlert, Heart } from "lucide-react";
import { goToSection } from "@/lib/navigation";

export function Footer() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "eligibility", label: t("nav.eligibility" as never) },
    { id: "process", label: t("nav.process" as never) },
    { id: "centers", label: t("nav.centers" as never) },
    { id: "reserves", label: t("nav.reserves" as never) },
    { id: "why", label: t("nav.why" as never) },
    { id: "faq", label: t("nav.faq" as never) },
  ];

  return (
    <footer className="relative bg-primary-900 text-ivory-100 overflow-hidden">
      <InkBlot
        variant={1}
        color="#FDE8E6"
        className="absolute -top-20 -right-20 w-[400px] h-[560px] opacity-[0.04]"
      />

      <div className="container-hemo relative z-10 py-16">
        <div className="flex items-start gap-3 bg-primary-800/50 rounded-2xl p-5 mb-12 border border-primary-700/50">
          <ShieldAlert className="w-5 h-5 text-accent-300 shrink-0 mt-0.5" />
          <p className="text-sm text-primary-100 leading-relaxed">
            {t("footer.legal")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-600">
                <Droplet
                  className="w-5 h-5 text-ivory-50"
                  fill="currentColor"
                />
              </span>
              <span className="font-display text-xl font-medium text-ivory-50">
                HemoLink
              </span>
            </div>
            <p className="text-sm text-primary-200 leading-relaxed max-w-xs">
              {t("footer.madeWith")}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-300 mb-4">
              {t("footer.links")}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      goToSection(item.id, {
                        pathname: location.pathname,
                        navigate,
                      })
                    }
                    className="text-sm text-primary-200 hover:text-ivory-50 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent-300 mb-4">
              {lang === "fr" ? "À propos" : "About"}
            </h4>
            <p className="text-sm text-primary-200 leading-relaxed">
              {t("footer.inspiration")}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-300">{t("footer.credits.text")}</p>
          <div className="flex items-center gap-1.5 text-xs text-primary-300">
            <Heart className="w-3 h-3 text-accent-400" fill="currentColor" />
            <span>HemoLink &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
