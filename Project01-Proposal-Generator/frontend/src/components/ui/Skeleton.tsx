'use client';

import { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'rounded-[var(--radius-minimal)] h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-[var(--radius-card)]',
  };

  return (
    <div
      className={`
        animate-pulse
        bg-[var(--color-light-surface)]
        ${variants[variant]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = '', ...props }: { lines?: number; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        p-6 rounded-[var(--radius-large)]
        border border-[rgba(14,15,12,0.12)]
        bg-white
        ${className}
      `}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={24} width="60%" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}
