'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)] hover:scale-[1.05] active:scale-[0.95] focus:ring-[var(--color-wise-green)]',
      secondary: 'bg-[rgba(22,51,0,0.08)] text-[var(--color-near-black)] hover:scale-[1.05] active:scale-[0.95] focus:ring-[var(--color-warm-dark)] hover:bg-[rgba(22,51,0,0.12)]',
      ghost: 'bg-transparent text-[var(--color-near-black)] hover:bg-[var(--color-light-surface)] active:scale-[0.98] focus:ring-[var(--color-warm-dark)]',
      danger: 'bg-[var(--color-danger-red)] text-white hover:scale-[1.05] active:scale-[0.95] focus:ring-[var(--color-danger-red)]',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-[var(--radius-pill)]',
      md: 'text-base px-4 py-2 rounded-[var(--radius-pill)]',
      lg: 'text-lg px-6 py-3 rounded-[var(--radius-pill)]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
