import { useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { SectionHeading, QuoteBlock } from "@/components/shared/SectionHeading";
import { InkBlot } from "@/components/shared/InkBlot";
import { faqItems, quoteKeys } from "@/data/faq.data";
import {
  ChevronDown,
  UserCheck,
  Weight,
  Clock,
  ShieldCheck,
  IdCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const criteriaKeys = [
  { icon: UserCheck, key: "faq.criteria.age" },
  { icon: Weight, key: "faq.criteria.weight" },
  { icon: Clock, key: "faq.criteria.delay.male" },
  { icon: Clock, key: "faq.criteria.delay.female" },
  { icon: ShieldCheck, key: "faq.criteria.health" },
  { icon: IdCard, key: "faq.criteria.id" },
];

export function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
      <InkBlot
        variant={2}
        color="#691735"
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
          <div className="bg-white rounded-3xl border border-warmgray-200/50 shadow-lg shadow-primary-900/5 p-6 sm:p-8">
            <h3 className="font-display text-xl text-primary-900 mb-5 text-center">
              {t("faq.criteria.title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criteriaKeys.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ivory-50"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-warmgray-700 leading-snug">
                      {t(item.key as never)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-5 text-center text-xs text-warmgray-500 italic">
              {t("faq.criteria.disclaimer")}
            </p>
          </div>
        </div>

        {/* Quote separator */}
        <QuoteBlock quoteKey={quoteKeys[2]} />

        {/* FAQ accordion */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {faqItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`bg-white rounded-2xl border transition-colors duration-200 ${
                    isOpen
                      ? "border-primary-300 shadow-md"
                      : "border-warmgray-200/50 shadow-sm hover:border-warmgray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  >
                    <span
                      className={`font-display text-base sm:text-lg transition-colors ${isOpen ? "text-primary-800" : "text-primary-900"}`}
                    >
                      {t(item.qKey as never)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isOpen
                          ? "bg-primary-700 text-ivory-50"
                          : "bg-ivory-100 text-warmgray-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-warmgray-600 leading-relaxed">
                          {t(item.aKey as never)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
