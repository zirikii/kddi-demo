import { cx } from '../../lib/cx.js';

/** Pulsing placeholder block. */
export default function LoadingSkeleton({ className }) {
  return <div className={cx('animate-pulse rounded-md bg-noc-elevated', className)} />;
}

/** A stack of skeleton rows mimicking the alert feed. */
export function FeedSkeleton({ rows = 6 }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-noc-border p-3">
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-4 flex-1" />
          <LoadingSkeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
