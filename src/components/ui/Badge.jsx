import { cx } from '../../lib/cx.js';

/**
 * Generic pill badge. Pass full color classes via `className` for custom looks.
 */
export default function Badge({ className, children, ...props }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        'border-noc-border bg-noc-elevated text-kddi-fg',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
