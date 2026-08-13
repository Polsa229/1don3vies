import type { useCountdown } from '@/lib/hooks/useCountdown';
import { useI18n } from '@/i18n/useI18n';

type Countdown = ReturnType<typeof useCountdown>;

/**
 * Moodboard-style countdown: four separate Day / Hour / Min / Sec blocks.
 */
export function CountdownBlocks({
  countdown,
  compact = false,
}: {
  countdown: Countdown;
  compact?: boolean;
}) {
  const { lang } = useI18n();
  const units = [
    { value: countdown.days, label: lang === 'fr' ? 'J' : 'D' },
    { value: countdown.hours, label: lang === 'fr' ? 'H' : 'H' },
    { value: countdown.minutes, label: lang === 'fr' ? 'Min' : 'Min' },
    { value: countdown.seconds, label: lang === 'fr' ? 'Sec' : 'Sec' },
  ];

  return (
    <div className={`grid grid-cols-4 ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {units.map(({ value, label }) => (
        <div
          key={label}
          className={`rounded-xl bg-primary-50 border border-primary-100 text-center ${
            compact ? 'px-1.5 py-1.5' : 'px-2 py-2'
          }`}
        >
          <p
            className={`font-display font-semibold text-primary-900 tabular-nums leading-none ${
              compact ? 'text-base' : 'text-xl'
            }`}
          >
            {String(value).padStart(2, '0')}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-600/80">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
