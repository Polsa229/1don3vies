import { useI18n } from '@/i18n/I18nContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { bloodReserves } from '@/data/bloodReserves.data';
import type { NeedLevel } from '@/features/eligibility/eligibility.types';
import { AlertCircle, Info, Globe } from 'lucide-react';

const levelConfig: Record<NeedLevel, { bg: string; bar: string; text: string; labelKey: string; dot: string }> = {
  high: {
    bg: 'bg-bordeaux-50',
    bar: 'bg-bordeaux-600',
    text: 'text-bordeaux-700',
    labelKey: 'reserves.level.high',
    dot: 'bg-bordeaux-500',
  },
  moderate: {
    bg: 'bg-accent-50',
    bar: 'bg-accent-400',
    text: 'text-accent-700',
    labelKey: 'reserves.level.moderate',
    dot: 'bg-accent-400',
  },
  normal: {
    bg: 'bg-success-50',
    bar: 'bg-success-400',
    text: 'text-success-700',
    labelKey: 'reserves.level.normal',
    dot: 'bg-success-400',
  },
};

export function ReservesSection() {
  const { t, lang } = useI18n();

  return (
    <section id="reserves" className="relative py-24 lg:py-32 bg-ivory-100 overflow-hidden">
      <InkBlot
        variant={4}
        color="#8B3147"
        className="absolute -top-20 -right-32 w-[400px] h-[560px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="reserves.eyebrow"
          titleKey="reserves.title"
          subtitleKey="reserves.subtitle"
        />

        {/* Blood group cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodReserves.map((reserve) => {
            const config = levelConfig[reserve.level];
            return (
              <div
                key={reserve.group}
                className={`rounded-2xl p-6 border border-warmgray-200/50 shadow-sm transition-all duration-300 hover:shadow-md ${config.bg}`}
              >
                {/* Group name */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-3xl font-medium text-bordeaux-900">
                    {reserve.group}
                  </span>
                  {reserve.rare && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-bordeaux-700 text-ivory-50">
                      {lang === 'fr' ? 'Rare' : 'Rare'}
                    </span>
                  )}
                </div>

                {/* Need level indicator */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span className={`text-sm font-semibold ${config.text}`}>
                      {t(config.labelKey as never)}
                    </span>
                  </div>
                  {/* Visual bar */}
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.bar} transition-all duration-500`}
                      style={{
                        width: reserve.level === 'high' ? '90%' : reserve.level === 'moderate' ? '55%' : '25%',
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-warmgray-600 leading-relaxed">
                  {lang === 'fr' ? reserve.description.fr : reserve.description.en}
                </p>
              </div>
            );
          })}
        </div>

        {/* Rare groups explanation */}
        <div className="mt-10 bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-bordeaux-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-bordeaux-600" />
            </div>
            <div>
              <h3 className="font-display text-lg text-bordeaux-900 mb-2">
                {lang === 'fr' ? 'La diversité des donneurs compte' : 'Donor diversity matters'}
              </h3>
              <p className="text-sm text-warmgray-600 leading-relaxed">
                {t('reserves.rare.explanation')}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 text-sm text-warmgray-500 italic">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t('reserves.disclaimer')}</span>
        </div>
      </div>
    </section>
  );
}
