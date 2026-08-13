/** Glossy blood drop used as a hero visual accent. */
export function BloodDrop({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="dropBody" x1="30" y1="10" x2="90" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E86A5B" />
          <stop offset="45%" stopColor="#8F2346" />
          <stop offset="100%" stopColor="#4A1026" />
        </linearGradient>
        <linearGradient id="dropShine" x1="40" y1="30" x2="70" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="dropSoft" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#8F2346" floodOpacity="0.35" />
        </filter>
      </defs>
      <path
        d="M60 8C60 8 18 70 18 104C18 128.853 36.147 148 60 148C83.853 148 102 128.853 102 104C102 70 60 8 60 8Z"
        fill="url(#dropBody)"
        filter="url(#dropSoft)"
      />
      <ellipse cx="44" cy="78" rx="12" ry="20" fill="url(#dropShine)" transform="rotate(-18 44 78)" />
      <circle cx="72" cy="118" r="6" fill="#fff" fillOpacity="0.18" />
    </svg>
  );
}
