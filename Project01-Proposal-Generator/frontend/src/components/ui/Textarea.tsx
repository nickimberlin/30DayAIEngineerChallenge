'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2.5 rounded-[var(--radius-standard)]
          border text-base font-normal
          bg-white text-[var(--color-near-black)]
          placeholder:text-[var(--color-gray)]
          transition-shadow duration-200
          focus:outline-none focus:shadow-[var(--shadow-inset)]
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y min-h-[100px]
          ${error ? 'border-[var(--color-danger-red)]' : 'border-[rgba(14,15,12,0.12)]'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
