import { cx } from '../../lib/cx.js';

/**
 * CSS/div-based mini bar chart — no charting library.
 * @param {{data:number[], className?:string, barClassName?:string, height?:number}} props
 */
export default function Sparkline({ data = [], className, barClassName, height = 32 }) {
  const max = Math.max(...data, 1);
  return (
    <div
      className={cx('flex items-end gap-0.5', className)}
      style={{ height }}
      role="img"
      aria-label="trend sparkline"
    >
      {data.map((v, i) => (
        <div
          key={i}
          className={cx('flex-1 rounded-sm bg-kddi-arc/70', barClassName)}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
