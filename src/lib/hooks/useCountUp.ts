import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

interface CountUpOptions {
  duration?: number;
  /** Delay before counting starts (seconds). */
  delay?: number;
  /** Fraction of element that must be visible. */
  amount?: number;
}

/**
 * Counts from 0 to `to` once when the element enters the viewport.
 */
export function useCountUp(
  to: number,
  { duration = 1.5, delay = 0, amount = 0.45 }: CountUpOptions = {},
) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, to, duration, delay]);

  return { ref, value, inView };
}
