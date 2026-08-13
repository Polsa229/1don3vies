import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * A syringe whose red fluid level decreases as the user scrolls down,
 * symbolizing the act of giving blood. Uses Framer Motion's useScroll
 * to track progress through the section and maps it to the fill height.
 */
export function SyringeScroll({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fluid goes from 100% → 5% as user scrolls through the section
  const fluidHeight = useTransform(scrollYProgress, [0, 0.7], [100, 5]);
  const fluidOpacity = useTransform(scrollYProgress, [0, 0.7], [0.9, 0.4]);

  return (
    <div ref={ref} className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Plunger rod */}
        <div className="w-3 h-16 bg-warmgray-300 rounded-t-sm" />
        {/* Plunger top */}
        <div className="w-10 h-3 bg-warmgray-400 rounded-t-md" />

        {/* Syringe barrel */}
        <div className="relative w-10 h-48 bg-ivory-100 border-2 border-warmgray-300 rounded-md overflow-hidden">
          {/* Graduation marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 px-1">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="w-2 h-px bg-warmgray-300"
                style={{ alignSelf: "flex-end" }}
              />
            ))}
          </div>
          {/* Red fluid */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent-600 to-primary-500"
            style={{
              height: useTransform(fluidHeight, (v) => `${v}%`),
              opacity: fluidOpacity,
            }}
          >
            {/* Surface shimmer */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>

        {/* Needle hub */}
        <div className="w-4 h-3 bg-warmgray-400" />
        {/* Needle */}
        <div className="w-1 h-10 bg-warmgray-500" />

        {/* Drop falling */}
        <motion.div
          className="w-2 h-3 rounded-full bg-accent-600"
          animate={{
            y: [0, 20, 40],
            opacity: [1, 1, 0],
            scale: [1, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      </div>

      {/* Label */}
      <p className="mt-6 text-xs font-medium uppercase tracking-widest text-warmgray-500 text-center max-w-[140px]">
        Don de vie
      </p>
    </div>
  );
}
