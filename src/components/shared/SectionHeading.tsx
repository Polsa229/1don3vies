import { useI18n } from "@/i18n/useI18n";

interface SectionHeadingProps {
  eyebrowKey: string;
  titleKey: string;
  subtitleKey?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrowKey,
  titleKey,
  subtitleKey,
  center = true,
  className = "",
}: SectionHeadingProps) {
  const { t } = useI18n();

  return (
    <div
      className={`mb-12 ${center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"} ${className}`}
    >
      <p className="eyebrow mb-3">{t(eyebrowKey as never)}</p>
      <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-balance">
        {t(titleKey as never)}
      </h2>
      {subtitleKey && (
        <p className="mt-4 text-warmgray-600 text-base sm:text-lg leading-relaxed">
          {t(subtitleKey as never)}
        </p>
      )}
    </div>
  );
}

interface QuoteBlockProps {
  quoteKey: string;
}

export function QuoteBlock({ quoteKey }: QuoteBlockProps) {
  const { t } = useI18n();

  return (
    <div className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
      </div>
      <blockquote className="relative text-center px-6">
        <p className="heading-display text-2xl sm:text-3xl lg:text-4xl text-primary-800 italic leading-relaxed text-balance">
          &ldquo;{t(quoteKey as never)}&rdquo;
        </p>
      </blockquote>
    </div>
  );
}
