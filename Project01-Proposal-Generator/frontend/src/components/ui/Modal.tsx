'use client';

import { useEffect, useRef, HTMLAttributes } from 'react';
import { X } from 'lucide-react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
}

export function Modal({
  className = '',
  open = false,
  onClose,
  title,
  description,
  children,
  ...props
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && onClose) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`
          relative z-10 w-full max-w-lg
          bg-white rounded-[var(--radius-section)]
          border border-[rgba(14,15,12,0.12)]
          shadow-[var(--shadow-ring)]
          p-8
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        {...props}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-light-surface)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--color-gray)]" />
          </button>
        )}

        {title && (
          <h2 id="modal-title" className="text-xl font-semibold text-[var(--color-near-black)] mb-2">
            {title}
          </h2>
        )}

        {description && (
          <p id="modal-description" className="text-[var(--color-gray)] mb-6">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
