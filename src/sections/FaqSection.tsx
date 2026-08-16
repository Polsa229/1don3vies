import { useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import { SectionHeading, QuoteBlock } from "@/components/shared/SectionHeading";
import { InkBlot } from "@/components/shared/InkBlot";
import { DonationCriteriaPanel } from "@/components/shared/DonationCriteriaPanel";
import { Button } from "@/components/ui/Button";
import { faqItems, quoteKeys } from "@/data/faq.data";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState(false);

  function handleConcernSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim() || !message.trim()) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setSent(true);
  }

  return (
    <section id="faq" className="relative py-8 lg:py-24 overflow-hidden">
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

        <DonationCriteriaPanel />

        {/* Quote separator */}
        <QuoteBlock quoteKey={quoteKeys[2]} />

        {/* FAQ accordion + concern form */}
        <div className="max-w-2xl mx-auto lg:max-w-none grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-start">
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
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 text-left"
                  >
                    <span
                      className={`font-display text-sm sm:text-lg transition-colors ${isOpen ? "text-primary-800" : "text-primary-900"}`}
                    >
                      {t(item.qKey as never)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isOpen
                          ? "bg-primary-700 text-ivory-50"
                          : "bg-ivory-100 text-warmgray-600"
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

          <form
            onSubmit={handleConcernSubmit}
            className="bg-white rounded-2xl border border-warmgray-200/50 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24"
          >
            <h3 className="font-display text-base sm:text-xl text-primary-900 mb-1">
              {t("faq.more.title")}
            </h3>
            <p className="text-xs sm:text-sm text-warmgray-600 mb-4">
              {t("faq.more.subtitle")}
            </p>

            {sent ? (
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-sm text-success-700 bg-success-50 border border-success-200 rounded-xl px-4 py-3"
              >
                {t("faq.more.success")}
              </p>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="faq-contact"
                    className="block text-sm font-medium text-primary-900 mb-1.5"
                  >
                    {t("faq.more.contact")}
                  </label>
                  <input
                    id="faq-contact"
                    type="text"
                    autoComplete="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t("faq.more.contact.placeholder")}
                    aria-invalid={formError && !contact.trim()}
                    className="w-full px-4 py-2.5 text-sm text-primary-900 bg-ivory-50 border border-warmgray-200 rounded-2xl focus:border-primary-400 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="faq-message"
                    className="block text-sm font-medium text-primary-900 mb-1.5"
                  >
                    {t("faq.more.message")}
                  </label>
                  <textarea
                    id="faq-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("faq.more.message.placeholder")}
                    aria-invalid={formError && !message.trim()}
                    className="w-full px-4 py-2.5 text-sm text-primary-900 bg-ivory-50 border border-warmgray-200 rounded-2xl focus:border-primary-400 transition-colors outline-none resize-none"
                  />
                </div>
                {formError && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="text-sm text-error-700"
                  >
                    {t("faq.more.error")}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    {t("faq.more.submit")}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
