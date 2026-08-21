import { useI18n } from '@/i18n/useI18n';
import type { TranslationKey } from '@/i18n/translations';

interface SectionHeadingProps {
  eyebrowKey: TranslationKey;
  titleKey: TranslationKey;
  subtitleKey?: TranslationKey;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrowKey,
  titleKey,
  subtitleKey,
  center = true,
  className = '',
}: SectionHeadingProps) {
  const { t } = useI18n();

  return (
    <div
      className={`mb-6 lg:mb-12 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}
    >
      <p className="eyebrow mb-3">{t(eyebrowKey)}</p>
      <h2 className="heading-display text-2xl sm:text-4xl lg:text-5xl leading-[1.15] text-balance">
        {t(titleKey)}
      </h2>
      {subtitleKey && (
        <p className="mt-2 sm:mt-4 text-warmgray-600 text-sm sm:text-lg leading-relaxed">
          {t(subtitleKey)}
        </p>
      )}
    </div>
  );
}

interface QuoteBlockProps {
  quoteKey: TranslationKey;
  className?: string;
}

export function QuoteBlock({ quoteKey, className = '' }: QuoteBlockProps) {
  const { t } = useI18n();

  return (
    <div className={`relative py-4 sm:py-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
      </div>
      <blockquote className="relative text-center px-4 sm:px-6">
        <p className="heading-display text-[12px] sm:text-3xl lg:text-4xl text-primary-800 italic leading-none whitespace-nowrap tracking-tight">
          &ldquo;{t(quoteKey)}&rdquo;
        </p>
      </blockquote>
    </div>
  );
}
