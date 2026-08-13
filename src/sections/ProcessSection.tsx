import { useI18n } from '@/i18n/I18nContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { ClipboardCheck, Stethoscope, HeartPulse, Coffee, Clock, Droplet, Shield, Sun } from 'lucide-react';

const STEPS = [
  { icon: ClipboardCheck, titleKey: 'process.step1.title', descKey: 'process.step1.desc', durationKey: 'process.step1.duration' },
  { icon: Stethoscope, titleKey: 'process.step2.title', descKey: 'process.step2.desc', durationKey: 'process.step2.duration' },
  { icon: HeartPulse, titleKey: 'process.step3.title', descKey: 'process.step3.desc', durationKey: 'process.step3.duration' },
  { icon: Coffee, titleKey: 'process.step4.title', descKey: 'process.step4.desc', durationKey: 'process.step4.duration' },
];

const TIPS = [
  { icon: Droplet, titleKey: 'process.tips.before', itemsKey: 'process.tips.before.items' },
  { icon: Shield, titleKey: 'process.tips.during', itemsKey: 'process.tips.during.items' },
  { icon: Sun, titleKey: 'process.tips.after', itemsKey: 'process.tips.after.items' },
];

export function ProcessSection() {
  const { t } = useI18n();

  return (
    <section id="process" className="relative py-24 lg:py-32 bg-ivory-100 overflow-hidden">
      <InkBlot
        variant={3}
        color="#6B1F35"
        className="absolute -bottom-32 -left-32 w-[450px] h-[600px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="process.eyebrow"
          titleKey="process.title"
          subtitleKey="process.subtitle"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px">
            <svg className="w-full h-2" preserveAspectRatio="none" viewBox="0 0 1000 2">
              <line
                x1="0"
                y1="1"
                x2="1000"
                y2="1"
                stroke="#DFA9B2"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="path-line"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step number circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-white border-2 border-bordeaux-200 flex items-center justify-center shadow-lg shadow-bordeaux-900/5 transition-all duration-300 group-hover:scale-105 group-hover:border-bordeaux-400 group-hover:shadow-xl">
                    <Icon className="w-8 h-8 text-bordeaux-600 transition-transform group-hover:scale-110" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-bordeaux-700 text-ivory-50 text-xs font-bold flex items-center justify-center shadow-md">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h3 className="font-display text-lg text-bordeaux-900 mb-2">
                      {t(step.titleKey as never)}
                    </h3>
                    <p className="text-sm text-warmgray-600 leading-relaxed max-w-xs">
                      {t(step.descKey as never)}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {t(step.durationKey as never)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bordeaux-700 text-ivory-50 text-sm font-semibold shadow-lg">
            <Clock className="w-4 h-4" />
            {t('process.total')}
          </span>
        </div>

        {/* Tips */}
        <div className="mt-20">
          <h3 className="font-display text-2xl text-bordeaux-900 text-center mb-10">
            {t('process.tips.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-7 border border-warmgray-200/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-bordeaux-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-bordeaux-600" />
                  </div>
                  <h4 className="font-display text-lg text-bordeaux-900 mb-3">
                    {t(tip.titleKey as never)}
                  </h4>
                  <p className="text-sm text-warmgray-600 leading-relaxed">
                    {t(tip.itemsKey as never)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
