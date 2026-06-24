import { useId } from 'react';
import { cx } from '../../lib/cx.js';

/**
 * Styled, accessible textarea with optional label, helper, and error text.
 */
export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  error,
  helper,
  className,
  ...props
}) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-noc-muted">
          {label}
          {required && <span className="ml-0.5 text-sev-critical">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(
          'w-full resize-y rounded-md border bg-noc-bg px-3 py-2 text-sm text-kddi-fg placeholder:text-noc-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kddi-arc',
          error ? 'border-sev-critical' : 'border-noc-border',
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-sev-critical">
          {error}
        </p>
      ) : (
        helper && <p className="mt-1 text-xs text-noc-muted">{helper}</p>
      )}
    </div>
  );
}
