import React from "react";
import {
  TriangleAlert,
  MapPin,
  Eye,
  TrendingUp,
  Crosshair,
} from "lucide-react";

const tabs = [
  { name: "Alerts", icon: <TriangleAlert className="h-4 w-4 mr-2" /> },
  { name: "Live Map", icon: <MapPin className="h-4 w-4 mr-2" /> },
  { name: "Proximity Analysis", icon: <Crosshair className="h-4 w-4 mr-2" /> },
  { name: "Assessment", icon: <Eye className="h-4 w-4 mr-2" /> },
  { name: "AI Risk Prediction", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
];

const NavTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-2">
      <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-semibold transition-colors
              ${
                activeTab === tab.name
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavTabs;
