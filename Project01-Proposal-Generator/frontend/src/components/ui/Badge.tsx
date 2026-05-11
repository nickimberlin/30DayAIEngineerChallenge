'use client';

import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[var(--color-light-surface)] text-[var(--color-near-black)]',
    success: 'bg-[var(--color-light-mint)] text-[var(--color-positive-green)]',
    warning: 'bg-[rgba(255,209,26,0.15)] text-[#8a6b00]',
    danger: 'bg-[rgba(208,50,56,0.10)] text-[var(--color-danger-red)]',
    info: 'bg-[var(--color-background-accent)] text-[#0a7bb0]',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-[var(--radius-pill)]
        font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
