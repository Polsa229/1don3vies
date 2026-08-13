import { useI18n } from "@/i18n/useI18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-ivory-100 border border-warmgray-200 p-1"
      role="group"
      aria-label={t("lang.switch")}
    >
      <Globe
        className="w-4 h-4 text-warmgray-400 ml-2 mr-1"
        aria-hidden="true"
      />
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            lang === l
              ? "bg-primary-700 text-ivory-50 shadow-sm"
              : "text-warmgray-600 hover:text-primary-700 hover:bg-primary-50"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
