import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '../../lib/cx.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';

/**
 * Accessible modal dialog: portal, overlay click-to-close, Escape-to-close,
 * focus trap, and body scroll lock.
 */
export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cx(
          'w-full rounded-xl border border-noc-border bg-noc-card shadow-2xl',
          'animate-[slide-in_0.2s_ease-out]',
          widths[size] || widths.md,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-noc-border px-5 py-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-base font-semibold text-kddi-fg">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-xs text-noc-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-noc-muted transition-colors hover:bg-noc-elevated hover:text-kddi-fg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
