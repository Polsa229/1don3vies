import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InkBlot } from "@/components/shared/InkBlot";
import { Play, Heart, Users, Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useCountUp } from "@/lib/hooks/useCountUp";

const VIDEO_ID = "0aJ5x93pAvU";
const VIDEO_START = 3;
const VIDEO_END = 2 * 60 + 50; // 2:50

function formatCount(value: number, lang: string) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(value);
}

function StatNumber({
  to,
  lang,
  suffix = "",
  delay = 0,
}: {
  to: number;
  lang: string;
  suffix?: string;
  delay?: number;
}) {
  const { ref, value } = useCountUp(to, { duration: 1.65, delay });

  return (
    <div ref={ref}>
      <p className="font-display text-3xl text-primary-900 tabular-nums">
        {formatCount(value, lang)}
        {suffix}
      </p>
    </div>
  );
}

function InlineCount({
  to,
  lang,
  delay = 0.35,
}: {
  to: number;
  lang: string;
  delay?: number;
}) {
  const { ref, value } = useCountUp(to, { duration: 1.2, delay });

  return (
    <span ref={ref} className="inline-block font-bold text-primary-700 tabular-nums">
      {formatCount(value, lang)}
    </span>
  );
}

export function WhyDonateSection() {
  const { t, lang } = useI18n();
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!videoOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setVideoOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoOpen]);

  return (
    <section id="why" className="relative py-8 lg:py-24 overflow-hidden">
      <InkBlot
        variant={1}
        className="absolute -bottom-40 -right-32 w-[500px] h-[700px] opacity-[0.03] text-primary-800"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="why.eyebrow"
          titleKey="why.title"
          subtitleKey="why.subtitle"
        />

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            variants={fadeUp}
            className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary-600" fill="currentColor" />
            </div>
            <StatNumber to={1} lang={lang} delay={0.05} />
            <p className="text-sm text-warmgray-600 mt-1">
              {t("why.stats.donations")} <InlineCount to={3} lang={lang} />{" "}
              {t("why.stats.lives")}
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6"
          >
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-accent-600" />
            </div>
            <StatNumber to={10000} lang={lang} delay={0.12} />
            <p className="text-sm text-warmgray-600 mt-1">
              {t("why.stats.daily")}
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="text-center bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6"
          >
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <StatNumber to={100} lang={lang} suffix="%" delay={0.2} />
            <p className="text-sm text-warmgray-600 mt-1">
              {lang === "fr"
                ? "Sécurité du matériel à usage unique"
                : "Single-use equipment safety"}
            </p>
          </motion.div>
        </motion.div>

        {/* Body text */}
        <div className="max-w-2xl mx-auto text-center mb-6 lg:mb-12">
          <p className="text-base sm:text-lg text-warmgray-600 leading-relaxed">
            {t("why.body")}
          </p>
        </div>

        {/* Video + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Video (lite embed → modal) */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl shadow-primary-900/10 group">
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950"
              aria-label={t("why.video.play")}
            >
              <div className="absolute inset-0 opacity-20">
                <InkBlot
                  variant={3}
                  className="absolute top-0 right-0 w-48 h-64 text-warning-100"
                />
                <InkBlot
                  variant={4}
                  className="absolute bottom-0 left-0 w-40 h-52 text-warning-400"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-ivory-50/90 flex items-center justify-center shadow-2xl">
                  <Play
                    className="w-7 h-7 text-primary-700 ml-1"
                    fill="currentColor"
                  />
                </div>
                <span className="text-sm font-medium text-ivory-50/80">
                  {t("why.video.play")}
                </span>
              </div>
            </button>
          </div>

          {/* Text summary for accessibility */}
          <div className="bg-ivory-100 rounded-2xl p-6 sm:p-8 border border-warmgray-200/50">
            <h3 className="font-display text-lg text-primary-900 mb-3">
              {lang === "fr" ? "Résumé de la vidéo" : "Video summary"}
            </h3>
            <p className="text-sm text-warmgray-600 leading-relaxed">
              {t("why.video.summary")}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm"
              aria-label={lang === "fr" ? "Fermer la vidéo" : "Close video"}
              onClick={() => setVideoOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={
                lang === "fr"
                  ? "Pourquoi la diversité des donneurs de sang est cruciale"
                  : "Why blood donor diversity is crucial"
              }
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-primary-950"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-primary-900/80 text-ivory-50 flex items-center justify-center hover:bg-primary-800 transition-colors"
                aria-label={lang === "fr" ? "Fermer" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>

              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?start=${VIDEO_START}&end=${VIDEO_END}&autoplay=1&rel=0`}
                title="Pourquoi la diversité des donneurs de sang est cruciale"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
