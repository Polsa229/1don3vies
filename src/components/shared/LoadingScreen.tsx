import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Animated loading screen shown on first visit.
 * Sequence:
 * 1. Dark background (#2B2320)
 * 2. Blood drop (#D0332B) falls
 * 3. Light halo expands at impact
 * 4. Human silhouettes holding hands appear
 * 5. Tagline "Une action peut faire toute la différence." appears
 * 6. Fade out to main page
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStage(1), 300));   // drop appears
    timers.push(setTimeout(() => setStage(2), 1400));  // drop falls + halo
    timers.push(setTimeout(() => setStage(3), 2200));  // silhouettes
    timers.push(setTimeout(() => setStage(4), 3200));  // tagline
    timers.push(setTimeout(() => setStage(5), 4800));  // fade out
    timers.push(setTimeout(() => onComplete(), 5400)); // done

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 5 && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#2B2320' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Halo at impact point */}
          {stage >= 2 && (
            <motion.div
              className="absolute rounded-full"
              style={{
                bottom: '38%',
                width: 6,
                height: 6,
                background: 'rgba(208, 51, 43, 0.6)',
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: [1, 40, 60], opacity: [0.8, 0.3, 0] }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          )}

          {/* Blood drop */}
          {stage >= 1 && stage < 3 && (
            <motion.div
              className="absolute"
              style={{ top: '30%' }}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                y: stage >= 2 ? 'calc(38vh - 30vh)' : 0,
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 0.8, ease: stage >= 2 ? 'easeIn' : 'easeOut' }}
            >
              <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
                <path
                  d="M14 0C14 0 2 16 2 26C2 33.7 7.3 39 14 39C20.7 39 26 33.7 26 26C26 16 14 0 14 0Z"
                  fill="#D0332B"
                />
                <ellipse cx="10" cy="22" rx="3" ry="6" fill="rgba(255,255,255,0.25)" />
              </svg>
            </motion.div>
          )}

          {/* Human silhouettes holding hands */}
          {stage >= 3 && (
            <motion.div
              className="absolute bottom-[28%] flex items-end gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.svg
                  key={i}
                  width="32"
                  height="56"
                  viewBox="0 0 32 56"
                  fill="none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.65, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  {/* Head */}
                  <circle cx="16" cy="10" r="6" fill="#D0332B" opacity="0.8" />
                  {/* Body */}
                  <path
                    d="M16 18C12 18 8 22 8 28V40H24V28C24 22 20 18 16 18Z"
                    fill="#D0332B"
                    opacity="0.7"
                  />
                  {/* Arms holding hands */}
                  <path
                    d="M2 30H8M24 30H30"
                    stroke="#D0332B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  {/* Legs */}
                  <rect x="11" y="40" width="3" height="16" fill="#D0332B" opacity="0.7" />
                  <rect x="18" y="40" width="3" height="16" fill="#D0332B" opacity="0.7" />
                </motion.svg>
              ))}
            </motion.div>
          )}

          {/* Tagline */}
          {stage >= 4 && (
            <motion.p
              className="absolute bottom-[14%] text-center px-6 font-display text-lg sm:text-xl text-ivory-100/90 italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Une action peut faire toute la différence.
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
