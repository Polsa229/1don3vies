interface InkBlotProps {
  className?: string;
  variant?: 1 | 2 | 3 | 4;
  color?: string;
}

/**
 * Stylized organic ink-blot SVG motif.
 * Used as decorative background accent throughout the site.
 */
export function InkBlot({ className = '', variant = 1, color = '#6B1F35' }: InkBlotProps) {
  const paths: Record<number, string> = {
    1: 'M155.5 68.5C190.3 79.2 208.8 115.3 213.5 150.5C218.2 185.7 209.1 220.1 186.5 246.5C163.9 272.9 127.8 291.3 90.5 287.5C53.2 283.7 14.8 257.7 5.5 221.5C-3.8 185.3 15.7 139 44.5 107.5C73.3 76 120.7 57.8 155.5 68.5Z',
    2: 'M120 40C145 35 165 55 175 80C185 105 185 135 170 160C155 185 125 205 95 200C65 195 35 175 25 145C15 115 30 75 55 60C80 45 95 45 120 40Z',
    3: 'M100 20C130 25 155 50 160 80C165 110 150 140 125 155C100 170 65 170 45 150C25 130 20 95 35 70C50 45 70 15 100 20Z',
    4: 'M80 30C100 20 130 30 145 50C160 70 165 100 155 125C145 150 120 170 90 165C60 160 30 140 25 110C20 80 40 50 60 35C70 28 75 33 80 30Z',
  };

  return (
    <svg
      viewBox="0 0 220 320"
      className={className}
      style={{ color }}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={paths[variant]}
        fill="currentColor"
        transform="translate(0, 10) scale(0.95)"
      />
    </svg>
  );
}
