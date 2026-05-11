'use client';

import { HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({
  className = '',
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div
        className={`
          w-full bg-[var(--color-light-surface)]
          rounded-full overflow-hidden
          ${sizes[size]}
        `}
      >
        <div
          className="h-full bg-[var(--color-wise-green)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-[var(--color-gray)] text-right font-semibold">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
