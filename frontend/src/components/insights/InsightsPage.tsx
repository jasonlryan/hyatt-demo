import React, { useState } from 'react';
import InsightsDashboard from './InsightsDashboard';
import BrandAnalyticsTab from './BrandAnalyticsTab';
import { BrandOverview } from '../../types/peakMetrics';

const InsightsPage: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandOverview | null>(null);
  const [isBrandAnalyticsOpen, setIsBrandAnalyticsOpen] = useState(false);

  const handleBrandSelect = (brand: BrandOverview) => {
    setSelectedBrand(brand);
    setIsBrandAnalyticsOpen(true);
  };

  const handleCloseBrandAnalytics = () => {
    setIsBrandAnalyticsOpen(false);
    setSelectedBrand(null);
  };

  return (
    <>
      <InsightsDashboard onBrandSelect={handleBrandSelect} />
      
      {selectedBrand && (
        <BrandAnalyticsTab
          brandName={selectedBrand.title}
          isOpen={isBrandAnalyticsOpen}
          onClose={handleCloseBrandAnalytics}
          refreshInterval={0} // Disable automatic polling
        />
      )}
    </>
  );
};

export default InsightsPage;