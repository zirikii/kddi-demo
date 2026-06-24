import { Clock, UserRound, Wifi } from 'lucide-react';
import { useClock } from '../../hooks/useClock.js';
import { formatJSTClock } from '../../lib/formatters.js';
import { APP_NAME } from '../../lib/constants.js';

/**
 * Top KDDI-blue header bar: official white logo, product title, operator identity,
 * shift indicator, live JST clock, and feed status.
 */
export default function Header() {
  const now = useClock();

  return (
    <header className="sticky top-0 z-40 border-b border-black/30 bg-kddi">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4">
        {/* Left: logo + product */}
        <div className="flex items-center gap-3">
          <img src="/brand/kddi-logo-white.svg" alt="KDDI" className="h-7 w-auto" />
          <span className="hidden h-6 w-px bg-white/25 sm:block" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-white">{APP_NAME}</span>
            <span className="text-[11px] text-white/60">NOC Console · noc.kddi.internal</span>
          </div>
        </div>

        {/* Right: operator + clock + status */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <UserRound size={15} className="text-white" aria-hidden="true" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-white">Tanaka, Yuki</span>
              <span className="text-[11px] text-white/60">Day Shift · NOC Tokyo</span>
            </div>
          </div>

          <span className="hidden h-6 w-px bg-white/25 md:block" />

          <div className="flex items-center gap-1.5 text-white">
            <Clock size={14} className="text-white/70" aria-hidden="true" />
            <span className="font-mono text-sm tabular-nums" aria-label="Current time (JST)">
              {formatJSTClock(now)}
            </span>
            <span className="text-[11px] text-white/60">JST</span>
          </div>

          <span
            className="flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-1"
            title="Mock live feed"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-region-healthy opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-region-healthy" />
            </span>
            <Wifi size={13} className="text-white/80" aria-hidden="true" />
            <span className="hidden text-[11px] text-white/80 lg:inline">Feed: Live · Mock</span>
          </span>
        </div>
      </div>
    </header>
  );
}
