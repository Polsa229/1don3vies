import { useI18n } from '@/i18n/useI18n';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { bloodReserves } from '@/data/bloodReserves.data';
import type { NeedLevel } from '@/features/eligibility/eligibility.types';
import type { TranslationKey } from '@/i18n/translations';
import { Info, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const BLOCKS = 5;

const levelConfig: Record<
  NeedLevel,
  {
    bg: string;
    fill: string;
    empty: string;
    text: string;
    labelKey: TranslationKey;
    /** How many of 5 blocks are filled (stock metaphor: high need = low stock). */
    filled: number;
  }
> = {
  high: {
    bg: 'bg-primary-50',
    fill: 'bg-primary-700',
    empty: 'bg-primary-100',
    text: 'text-primary-700',
    labelKey: 'reserves.level.high',
    filled: 2,
  },
  moderate: {
    bg: 'bg-accent-50',
    fill: 'bg-accent-500',
    empty: 'bg-accent-100',
    text: 'text-accent-700',
    labelKey: 'reserves.level.moderate',
    filled: 3,
  },
  normal: {
    bg: 'bg-success-50',
    fill: 'bg-success-500',
    empty: 'bg-success-100',
    text: 'text-success-700',
    labelKey: 'reserves.level.normal',
    filled: 5,
  },
};

function NeedBlocks({
  filled,
  fillClass,
  emptyClass,
  textClass,
  label,
  delay = 0,
}: {
  filled: number;
  fillClass: string;
  emptyClass: string;
  textClass: string;
  label: string;
  delay?: number;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className={`text-xs sm:text-sm font-semibold ${textClass}`}>{label}</span>
        <span className={`text-xs font-bold tabular-nums ${textClass}`}>
          {filled}/{BLOCKS}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: BLOCKS }, (_, i) => {
          const active = i < filled;
          return (
            <motion.div
              key={i}
              className={`h-2.5 rounded-sm ${active ? fillClass : emptyClass}`}
              initial={{ scaleX: 0, opacity: 0.4 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.35,
                delay: delay + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ originX: 0 }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ReservesSection() {
  const { t, lang } = useI18n();

  return (
    <section id="reserves" className="relative py-8 lg:py-24 bg-ivory-100 overflow-hidden">
      <InkBlot
        variant={4}
        color="#691735"
        className="absolute -top-20 -right-32 w-[400px] h-[560px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="reserves.eyebrow"
          titleKey="reserves.title"
          subtitleKey="reserves.subtitle"
        />

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {bloodReserves.map((reserve, index) => {
            const config = levelConfig[reserve.level];
            return (
              <motion.div
                key={reserve.group}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-3.5 sm:p-6 border border-warmgray-200/50 shadow-sm transition-shadow duration-300 hover:shadow-md ${config.bg}`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="font-display text-2xl sm:text-3xl font-medium text-primary-900">
                    {reserve.group}
                  </span>
                  {reserve.rare && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-700 text-ivory-50">
                      Rare
                    </span>
                  )}
                </div>

                <NeedBlocks
                  filled={config.filled}
                  fillClass={config.fill}
                  emptyClass={config.empty}
                  textClass={config.text}
                  label={t(config.labelKey)}
                  delay={0.05 + index * 0.04}
                />

                <p className="text-[11px] sm:text-xs text-warmgray-600 leading-relaxed line-clamp-3">
                  {lang === 'fr' ? reserve.description.fr : reserve.description.en}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-display text-lg text-primary-900 mb-2">
                {lang === 'fr' ? 'La diversité des donneurs compte' : 'Donor diversity matters'}
              </h3>
              <p className="text-sm text-warmgray-600 leading-relaxed">
                {t('reserves.rare.explanation')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 text-sm text-warmgray-600 italic">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t('reserves.disclaimer')}</span>
        </div>
      </div>
    </section>
  );
}
