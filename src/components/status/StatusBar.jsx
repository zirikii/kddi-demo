import { deriveRegionHealth } from '../../data/mockRegions.js';
import RegionCard from './RegionCard.jsx';

/**
 * Top status bar: 4 region health cards derived from the current alert set.
 * @param {{alerts:object[]}} props
 */
export default function StatusBar({ alerts }) {
  const regions = deriveRegionHealth(alerts);

  return (
    <section aria-label="Regional network status" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {regions.map((region) => (
        <RegionCard
          key={region.id}
          region={region}
          logo={region.id === 'overseas' ? '/brand/telehouse-logo.svg' : undefined}
        />
      ))}
    </section>
  );
}
