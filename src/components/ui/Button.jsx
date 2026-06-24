import { cx } from '../../lib/cx.js';

const VARIANTS = {
  primary:
    'bg-kddi text-white hover:bg-kddi/90 border border-kddi disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'bg-transparent text-kddi-arc hover:bg-kddi-arc/10 border border-kddi-arc/60 hover:border-kddi-arc',
  ghost:
    'bg-transparent text-noc-muted hover:text-kddi-fg hover:bg-noc-elevated border border-transparent',
  danger:
    'bg-sev-critical text-white hover:bg-sev-critical/90 border border-sev-critical disabled:opacity-50',
  subtle:
    'bg-noc-elevated text-kddi-fg hover:bg-noc-elevated/70 border border-noc-border',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
};

/**
 * Reusable button with KDDI-blue primary + ops-console variants.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kddi-arc',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
