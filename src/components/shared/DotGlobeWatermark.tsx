import { motion } from 'framer-motion';

/**
 * Dotted-world-map watermark for the Hero section.
 * Uses a radial dot pattern masked into a globe-like ellipse,
 * with a subtle rotation and fade-in.
 */
export function DotGlobeWatermark() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-[120%] h-[120%] dot-globe"
      />
      {/* Interconnected nodes overlay */}
      <svg
        className="absolute w-[80%] h-[80%] opacity-[0.12]"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Connection lines */}
        <g stroke="#6B2737" strokeWidth="0.8" strokeDasharray="4 4">
          <line x1="200" y1="180" x2="400" y2="120" />
          <line x1="400" y1="120" x2="600" y2="200" />
          <line x1="200" y1="180" x2="350" y2="400" />
          <line x1="600" y1="200" x2="500" y2="420" />
          <line x1="350" y1="400" x2="500" y2="420" />
          <line x1="400" y1="120" x2="350" y2="400" />
          <line x1="200" y1="180" x2="600" y2="200" />
        </g>
        {/* Nodes */}
        {[
          [200, 180], [400, 120], [600, 200],
          [350, 400], [500, 420], [300, 300], [550, 320],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#6B2737" />
        ))}
      </svg>
    </div>
  );
}
