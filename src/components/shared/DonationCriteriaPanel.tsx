import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Biohazard,
  Weight,
  Scissors,
  Baby,
  Bug,
  Pill,
  WineOff,
  ShieldCheck,
  HeartPulse,
  UserRound,
  Droplets,
  CircleCheck,
  Coffee,
  Check,
  X,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/i18n/useI18n";

type Tab = "can" | "cannot";

const CAN_CRITERIA: { key: string; icon: LucideIcon }[] = [
  { key: "criteria.can.age", icon: Users },
  { key: "criteria.can.health", icon: ShieldCheck },
  { key: "criteria.can.weight", icon: Weight },
  { key: "criteria.can.surgery", icon: HeartPulse },
  { key: "criteria.can.pregnancy", icon: UserRound },
  { key: "criteria.can.malaria", icon: Droplets },
  { key: "criteria.can.medication", icon: CircleCheck },
  { key: "criteria.can.alcohol", icon: Coffee },
];

const CANNOT_CRITERIA: { key: string; icon: LucideIcon }[] = [
  { key: "ineligible.item.age", icon: Users },
  { key: "ineligible.item.infections", icon: Biohazard },
  { key: "ineligible.item.weight", icon: Weight },
  { key: "ineligible.item.surgery", icon: Scissors },
  { key: "ineligible.item.pregnancy", icon: Baby },
  { key: "ineligible.item.malaria", icon: Bug },
  { key: "ineligible.item.medication", icon: Pill },
  { key: "ineligible.item.alcohol", icon: WineOff },
];

function CriteriaGrid({
  items,
  variant,
}: {
  items: { key: string; icon: LucideIcon }[];
  variant: Tab;
}) {
  const { t } = useI18n();
  const isCan = variant === "can";

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.li
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.32 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ivory-50"
          >
            <span
              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                isCan
                  ? "bg-success-50 text-success-700"
                  : "bg-primary-50 text-primary-600"
              }`}
              aria-hidden
            >
              <Icon className="w-4 h-4" strokeWidth={2.25} />
            </span>
            <span className="text-sm text-warmgray-700 leading-snug">
              {t(item.key as never)}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}

function CriteriaExportPoster({
  variant,
  items,
}: {
  variant: Tab;
  items: { key: string; icon: LucideIcon }[];
}) {
  const { t } = useI18n();
  const isCan = variant === "can";

  return (
    <div
      className="w-[1080px] p-12"
      style={{
        backgroundColor: "#FAF8F5",
        color: "#241C20",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        className="rounded-[28px] border p-10"
        style={{
          borderColor: isCan
            ? "rgba(38, 122, 90, 0.28)"
            : "rgba(143, 35, 70, 0.28)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: isCan ? "#267A5A" : "#8F2346" }}
          >
            {isCan ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </span>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "#8F2346" }}
            >
              1Don3Vies
            </p>
            <h2 className="text-2xl font-semibold" style={{ color: "#691735" }}>
              {t(isCan ? "criteria.tab.can" : "criteria.tab.cannot")}
            </h2>
          </div>
        </div>

        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "#6F6669" }}
        >
          {t(isCan ? "criteria.can.intro" : "ineligible.subtitle")}
        </p>

        <ul className="grid grid-cols-2 gap-3" role="list">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#F8F5F2" }}
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isCan
                      ? "rgba(38, 122, 90, 0.12)"
                      : "rgba(143, 35, 70, 0.1)",
                    color: isCan ? "#267A5A" : "#8F2346",
                  }}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.25} />
                </span>
                <p
                  className="text-[15px] leading-snug"
                  style={{ color: "#3F383A" }}
                >
                  {t(item.key as never)}
                </p>
              </li>
            );
          })}
        </ul>

        {!isCan && (
          <p
            className="mt-8 text-sm leading-relaxed"
            style={{ color: "#6F6669" }}
          >
            {t("ineligible.footer")}
          </p>
        )}

        <p
          className="mt-6 text-xs leading-relaxed"
          style={{ color: "#8A8284" }}
        >
          {t("ineligible.disclaimer")}
        </p>
      </div>
    </div>
  );
}

export function DonationCriteriaPanel() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("can");
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const items = tab === "can" ? CAN_CRITERIA : CANNOT_CRITERIA;
  const isCan = tab === "can";

  async function handleExport() {
    const node = posterRef.current;
    if (!node || exporting) return;

    setExporting(true);
    try {
      const { toJpeg } = await import("html-to-image");
      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#FAF8F5",
      });

      const slug = tab === "can" ? "qui-peut-donner" : "qui-ne-peut-pas-donner";
      const link = document.createElement("a");
      link.download = `1Don3Vies-${slug}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch {
      window.alert(t("criteria.export.error"));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div id="criteria" className="max-w-3xl mx-auto mb-4 sm:mb-6">
      <div className="flex justify-center mb-5">
        <div className="relative inline-flex items-center gap-1 rounded-full bg-ivory-100 border border-warmgray-200 p-1">
          {(["can", "cannot"] as const).map((id) => (
            <button
              type="button"
              key={id}
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`relative z-10 px-3 sm:px-6 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-full transition-colors duration-200 ${
                tab === id
                  ? "text-ivory-50"
                  : "text-warmgray-600 hover:text-primary-700"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="criteria-tab-pill"
                  className="absolute inset-0 rounded-full bg-primary-700 shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">
                {t(id === "can" ? "criteria.tab.can" : "criteria.tab.cannot")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-warmgray-200/50 shadow-lg shadow-primary-900/5 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="font-display text-xl text-primary-900">
            {t(isCan ? "criteria.tab.can" : "criteria.tab.cannot")}
          </h3>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            aria-label={
              exporting ? t("criteria.export.exporting") : t("criteria.export")
            }
            title={
              exporting ? t("criteria.export.exporting") : t("criteria.export")
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-warmgray-200/90 bg-white text-primary-800 hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <CriteriaGrid variant={tab} items={items} />
          </motion.div>
        </AnimatePresence>

        {!isCan && (
          <p className="mt-5 text-center text-xs text-warmgray-600 leading-relaxed">
            {t("ineligible.footer")}
          </p>
        )}

        <p className="mt-5 text-center text-xs text-warmgray-600 italic">
          {t("ineligible.disclaimer")}
        </p>
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed top-0 z-[-1]"
        style={{ left: -12000, width: 1080 }}
      >
        <div ref={posterRef} lang={lang}>
          <CriteriaExportPoster variant={tab} items={items} />
        </div>
      </div>
    </div>
  );
}
