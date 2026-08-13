import { useI18n } from '@/i18n/I18nContext';
import { useTypewriter } from '@/lib/hooks/useTypewriter';
import { DotGlobeWatermark } from '@/components/shared/DotGlobeWatermark';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const { t, lang } = useI18n();

  const sequence = [
    { text: t('typewriter.fr'), speed: 55, pause: 2000 },
    { text: t('typewriter.en'), speed: 55, pause: 2000 },
    { text: t('typewriter.fr'), speed: 55, pause: 0 },
  ];

  const { displayedText, isDone } = useTypewriter(sequence, 800);

  function scrollToEligibility() {
    const el = document.getElementById('eligibility');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Dotted globe watermark */}
      <DotGlobeWatermark />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory-50 via-ivory-50/50 to-ivory-100 pointer-events-none" />

      <div className="container-hemo relative z-10 flex flex-col items-center text-center py-20">
        {/* Eyebrow */}
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {t('hero.eyebrow')}
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="heading-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-4xl text-balance"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {t('hero.headline')}
        </motion.h1>

        {/* Typewriter question */}
        <motion.div
          className="mt-8 h-10 sm:h-12 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="font-display text-xl sm:text-2xl lg:text-3xl text-bordeaux-600 italic">
            {displayedText}
            <span className={`inline-block w-0.5 h-6 sm:h-7 ml-1 ${isDone ? 'animate-blink' : ''} bg-bordeaux-500`} />
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-8 max-w-xl text-warmgray-600 text-base sm:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Button size="lg" onClick={scrollToEligibility} className="group">
            {t('hero.cta')}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-warmgray-400">
          <span className="text-xs font-medium uppercase tracking-wider">{lang === 'fr' ? 'Défiler' : 'Scroll'}</span>
          <div className="w-px h-12 bg-gradient-to-b from-warmgray-300 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
