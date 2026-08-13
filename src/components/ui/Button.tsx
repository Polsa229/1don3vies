import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-bordeaux-700 text-ivory-50 hover:bg-bordeaux-800 active:bg-bordeaux-900 shadow-lg shadow-bordeaux-900/20',
  secondary:
    'bg-accent-400 text-warmgray-900 hover:bg-accent-500 active:bg-accent-600 shadow-md shadow-accent-900/20',
  ghost:
    'bg-transparent text-bordeaux-700 hover:bg-bordeaux-50 active:bg-bordeaux-100',
  outline:
    'border-2 border-bordeaux-300 text-bordeaux-700 hover:bg-bordeaux-50 active:bg-bordeaux-100 bg-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
