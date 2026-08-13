import { useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { SectionHeading, QuoteBlock } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { faqItems, quoteKeys } from '@/data/faq.data';
import { ChevronDown, Check, Minus, UserCheck, Weight, Clock, ShieldCheck, IdCard } from 'lucide-react';

const criteriaKeys = [
  { icon: UserCheck, key: 'faq.criteria.age' },
  { icon: Weight, key: 'faq.criteria.weight' },
  { icon: Clock, key: 'faq.criteria.delay.male' },
  { icon: Clock, key: 'faq.criteria.delay.female' },
  { icon: ShieldCheck, key: 'faq.criteria.health' },
  { icon: IdCard, key: 'faq.criteria.id' },
];

export function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
      <InkBlot
        variant={2}
        color="#8B3147"
        className="absolute top-20 -left-40 w-[500px] h-[700px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="faq.eyebrow"
          titleKey="faq.title"
          subtitleKey="faq.subtitle"
        />

        {/* Criteria summary */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-3xl border border-warmgray-200/50 shadow-lg shadow-bordeaux-900/5 p-6 sm:p-8">
            <h3 className="font-display text-xl text-bordeaux-900 mb-5 text-center">
              {t('faq.criteria.title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criteriaKeys.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ivory-50">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-bordeaux-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-bordeaux-600" />
                    </div>
                    <span className="text-sm text-warmgray-700 leading-snug">
                      {t(item.key as never)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-center text-xs text-warmgray-500 italic">
              {t('faq.criteria.disclaimer')}
            </p>
          </div>
        </div>

        {/* Quote separator */}
        <QuoteBlock quoteKey={quoteKeys[2]} />

        {/* FAQ accordion */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-3">
            {faqItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-bordeaux-300 shadow-md'
                      : 'border-warmgray-200/50 shadow-sm hover:border-warmgray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  >
                    <span className={`font-display text-base sm:text-lg transition-colors ${isOpen ? 'text-bordeaux-800' : 'text-bordeaux-900'}`}>
                      {t(item.qKey as never)}
                    </span>
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen ? 'bg-bordeaux-700 text-ivory-50 rotate-180' : 'bg-ivory-100 text-warmgray-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-warmgray-600 leading-relaxed">
                      {t(item.aKey as never)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
