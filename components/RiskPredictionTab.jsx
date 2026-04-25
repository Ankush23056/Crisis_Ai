import NationalIntelligenceDashboard from "./NationalIntelligenceDashboard";
import RiskDashboard from "./RiskDashboard";

export default function RiskPredictionTab() {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Side: Country-Level Intelligence */}
        <div className="flex flex-col h-full min-h-[600px]">
          <NationalIntelligenceDashboard country="India" />
        </div>

        {/* Right Side: Granular Data-Entry Risk Predictor */}
        <div className="flex flex-col h-full">
          <RiskDashboard />
        </div>
      </div>
    </div>
  );
}
