import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../lib/cx.js';

/**
 * Styled, accessible native select.
 * @param {{label?:string, options:Array<{value:string,label:string}>, value, onChange, disabled, helper, className}} props
 */
export default function Select({ label, options = [], value, onChange, disabled, helper, className }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-noc-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cx(
            'h-9 w-full appearance-none rounded-md border border-noc-border bg-noc-bg px-3 pr-9 text-sm text-kddi-fg',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kddi-arc',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-noc-muted"
        />
      </div>
      {helper && <p className="mt-1 text-xs text-noc-muted">{helper}</p>}
    </div>
  );
}
