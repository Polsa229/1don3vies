import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Animated loading screen shown once per session (gated by App via sessionStorage).
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStage(2), 350));
    timers.push(setTimeout(() => setStage(3), 1100));
    timers.push(setTimeout(() => setStage(4), 1550));
    timers.push(setTimeout(() => setVisible(false), 2400));
    timers.push(setTimeout(() => onComplete(), 2750));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Chargement en cours"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#241C20' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {stage >= 2 && (
            <motion.div
              className="absolute rounded-full"
              style={{
                top: '58%',
                width: 6,
                height: 6,
                background: 'rgba(232, 106, 91, 0.6)',
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: [1, 40, 60], opacity: [0.8, 0.3, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            />
          )}

          {stage >= 1 && stage < 3 && (
            <motion.div
              className="absolute"
              style={{ top: '12%' }}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                y: stage >= 2 ? '46vh' : 0,
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: stage >= 2 ? 0.7 : 0.35,
                ease: stage >= 2 ? [0.4, 0, 0.9, 0.4] : 'easeOut',
              }}
            >
              <svg width="28" height="40" viewBox="0 0 28 40" fill="none" aria-hidden>
                <path
                  d="M14 0C14 0 2 16 2 26C2 33.7 7.3 39 14 39C20.7 39 26 33.7 26 26C26 16 14 0 14 0Z"
                  fill="#E86A5B"
                />
                <ellipse cx="10" cy="22" rx="3" ry="6" fill="rgba(255,255,255,0.25)" />
              </svg>
            </motion.div>
          )}

          {stage >= 3 && (
            <motion.div
              className="absolute bottom-[28%] flex items-end gap-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.svg
                  key={i}
                  width="32"
                  height="56"
                  viewBox="0 0 32 56"
                  fill="none"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.65, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  aria-hidden
                >
                  <circle cx="16" cy="10" r="6" fill="#E86A5B" opacity="0.8" />
                  <path
                    d="M16 18C12 18 8 22 8 28V40H24V28C24 22 20 18 16 18Z"
                    fill="#E86A5B"
                    opacity="0.7"
                  />
                  <path
                    d="M2 30H8M24 30H30"
                    stroke="#E86A5B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <rect x="11" y="40" width="3" height="16" fill="#E86A5B" opacity="0.7" />
                  <rect x="18" y="40" width="3" height="16" fill="#E86A5B" opacity="0.7" />
                </motion.svg>
              ))}
            </motion.div>
          )}

          {stage >= 4 && (
            <motion.p
              className="absolute bottom-[14%] text-center px-6 font-display text-lg sm:text-xl text-ivory-100/90 italic"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Une action peut faire toute la différence.
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
