'use client';

import { forwardRef, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', size = 'md', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-[var(--radius-large)] border bg-white';

    const variants = {
      default: 'border-[rgba(14,15,12,0.12)] shadow-[var(--shadow-ring)]',
      accent: 'border-[var(--color-wise-green)] shadow-[var(--shadow-ring)]',
      outline: 'border-[rgba(14,15,12,0.12)]',
    };

    const sizes = {
      sm: 'rounded-[var(--radius-card)]',
      md: 'rounded-[var(--radius-large)]',
      lg: 'rounded-[var(--radius-section)]',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
