import { useI18n } from '@/i18n/I18nContext';
import { useTypewriter } from '@/lib/hooks/useTypewriter';
import { InkBlot } from '@/components/shared/InkBlot';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

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
      {/* Background ink blots */}
      <div className="absolute inset-0 pointer-events-none">
        <InkBlot
          variant={1}
          color="#6B1F35"
          className="absolute -top-20 -right-32 w-[500px] h-[700px] opacity-[0.04]"
        />
        <InkBlot
          variant={3}
          color="#8B3147"
          className="absolute -bottom-40 -left-32 w-[400px] h-[560px] opacity-[0.03]"
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory-50 via-ivory-50/50 to-ivory-100 pointer-events-none" />

      <div className="container-hemo relative z-10 flex flex-col items-center text-center py-20">
        {/* Eyebrow */}
        <p className="eyebrow mb-6 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {t('hero.eyebrow')}
        </p>

        {/* Headline */}
        <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-4xl text-balance animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {t('hero.headline')}
        </h1>

        {/* Typewriter question */}
        <div className="mt-8 h-10 sm:h-12 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <p className="font-display text-xl sm:text-2xl lg:text-3xl text-bordeaux-600 italic">
            {displayedText}
            <span className={`inline-block w-0.5 h-6 sm:h-7 ml-1 ${isDone ? 'animate-blink' : ''} bg-bordeaux-500`} />
          </p>
        </div>

        {/* Subtitle */}
        <p className="mt-8 max-w-xl text-warmgray-600 text-base sm:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '1s', opacity: 0 }}>
          {t('hero.subtitle')}
        </p>

        {/* CTA */}
        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '1.2s', opacity: 0 }}>
          <Button size="lg" onClick={scrollToEligibility} className="group">
            {t('hero.cta')}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1.5s', opacity: 0 }}>
        <div className="flex flex-col items-center gap-2 text-warmgray-400">
          <span className="text-xs font-medium uppercase tracking-wider">{lang === 'fr' ? 'Défiler' : 'Scroll'}</span>
          <div className="w-px h-12 bg-gradient-to-b from-warmgray-300 to-transparent" />
        </div>
      </div>
    </section>
  );
}
