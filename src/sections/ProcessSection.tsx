import { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import {
  ClipboardCheck,
  Stethoscope,
  HeartPulse,
  Coffee,
  Clock,
  Droplet,
  Shield,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

const STEPS = [
  {
    icon: ClipboardCheck,
    titleKey: 'process.step1.title',
    descKey: 'process.step1.desc',
    durationKey: 'process.step1.duration',
  },
  {
    icon: Stethoscope,
    titleKey: 'process.step2.title',
    descKey: 'process.step2.desc',
    durationKey: 'process.step2.duration',
  },
  {
    icon: HeartPulse,
    titleKey: 'process.step3.title',
    descKey: 'process.step3.desc',
    durationKey: 'process.step3.duration',
  },
  {
    icon: Coffee,
    titleKey: 'process.step4.title',
    descKey: 'process.step4.desc',
    durationKey: 'process.step4.duration',
  },
] as const;

const TIPS = [
  {
    icon: Droplet,
    titleKey: 'process.tips.before',
    itemsKey: 'process.tips.before.items',
  },
  {
    icon: Shield,
    titleKey: 'process.tips.during',
    itemsKey: 'process.tips.during.items',
  },
  {
    icon: Sun,
    titleKey: 'process.tips.after',
    itemsKey: 'process.tips.after.items',
  },
] as const;

export function ProcessSection() {
  const { t } = useI18n();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="process"
      className="relative py-24 lg:py-32 bg-ivory-100 overflow-hidden"
    >
      <InkBlot
        variant={3}
        color="#8F2346"
        className="absolute -bottom-32 -left-32 w-[450px] h-[600px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="process.eyebrow"
          titleKey="process.title"
          subtitleKey="process.subtitle"
        />

        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Desktop baseline (dashed track) */}
          <div
            className="pointer-events-none absolute top-12 left-[12.5%] right-[12.5%] hidden lg:block h-0.5"
            aria-hidden
          >
            <div className="h-full w-full border-t-2 border-dashed border-primary-200/80" />
          </div>

          {/* Desktop animated progress connectors */}
          <div
            className="pointer-events-none absolute top-12 left-[12.5%] right-[12.5%] hidden lg:block h-0.5"
            aria-hidden
          >
            <div className="relative h-full w-full">
              {[0, 1, 2].map((segment) => {
                const active = hovered !== null && hovered > segment;
                return (
                  <motion.div
                    key={segment}
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 origin-left rounded-full bg-primary-700"
                    style={{
                      left: `${(segment / 3) * 100}%`,
                      width: `${100 / 3}%`,
                    }}
                    initial={false}
                    animate={{
                      scaleX: active ? 1 : 0,
                      opacity: active ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: active ? segment * 0.08 : (2 - segment) * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const filled = hovered !== null && i <= hovered;
              const isCurrent = hovered === i;

              return (
                <motion.div
                  key={step.titleKey}
                  variants={fadeUp}
                  className="relative flex flex-col items-center text-center"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                >
                  {/* Mobile / tablet vertical connector into this step */}
                  {i > 0 && (
                    <div
                      className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-0.5 overflow-hidden"
                      aria-hidden
                    >
                      <div className="absolute inset-0 border-l-2 border-dashed border-primary-200/80" />
                      <motion.div
                        className="absolute inset-x-0 top-0 w-0.5 mx-auto origin-top rounded-full bg-primary-700"
                        initial={false}
                        animate={{
                          scaleY: hovered !== null && hovered >= i ? 1 : 0,
                          opacity: hovered !== null && hovered >= i ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay:
                            hovered !== null && hovered >= i
                              ? (i - 1) * 0.08
                              : (STEPS.length - i) * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ height: '100%' }}
                      />
                    </div>
                  )}

                  <motion.div
                    className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 shadow-lg shadow-primary-900/5 ${
                      filled
                        ? 'border-primary-700 bg-primary-700'
                        : 'border-primary-200 bg-white'
                    }`}
                    animate={{
                      scale: isCurrent ? 1.06 : 1,
                      boxShadow: filled
                        ? '0 16px 36px -12px rgba(143, 35, 70, 0.45)'
                        : '0 10px 24px -12px rgba(143, 35, 70, 0.12)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={filled ? 'filled' : 'outline'}
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Icon
                          className={`h-8 w-8 ${filled ? 'text-ivory-50' : 'text-primary-600'}`}
                          strokeWidth={1.8}
                        />
                      </motion.span>
                    </AnimatePresence>

                    <span
                      className={`absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-md transition-colors duration-300 ${
                        filled
                          ? 'bg-accent-500 text-white'
                          : 'bg-primary-700 text-ivory-50'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </motion.div>

                  <div className="mt-6">
                    <h3
                      className={`font-display text-lg mb-2 transition-colors duration-300 ${
                        filled ? 'text-primary-800' : 'text-primary-900'
                      }`}
                    >
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm text-warmgray-600 leading-relaxed max-w-xs mx-auto">
                      {t(step.descKey)}
                    </p>
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
                        filled
                          ? 'text-primary-800 bg-primary-100'
                          : 'text-accent-600 bg-accent-50'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {t(step.durationKey)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-700 text-ivory-50 text-sm font-semibold shadow-lg">
            <Clock className="w-4 h-4" />
            {t('process.total')}
          </span>
        </motion.div>

        <div className="mt-20">
          <h3 className="font-display text-2xl text-primary-900 text-center mb-10">
            {t('process.tips.title')}
          </h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {TIPS.map((tip) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.titleKey}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-7 border border-warmgray-200/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h4 className="font-display text-lg text-primary-900 mb-3">
                    {t(tip.titleKey)}
                  </h4>
                  <p className="text-sm text-warmgray-600 leading-relaxed">
                    {t(tip.itemsKey)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
