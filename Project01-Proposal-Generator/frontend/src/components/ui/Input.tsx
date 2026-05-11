'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-3 py-2.5 rounded-[var(--radius-standard)]
          border text-base font-normal
          bg-white text-[var(--color-near-black)]
          placeholder:text-[var(--color-gray)]
          transition-shadow duration-200
          focus:outline-none focus:shadow-[var(--shadow-inset)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[var(--color-danger-red)]' : 'border-[rgba(14,15,12,0.12)]'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
