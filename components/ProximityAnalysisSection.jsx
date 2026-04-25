import React, { useState } from "react";
import { getProactiveProximityData } from "../services/geminiService";
import { HeartPulse, Landmark, Bus, Search, Bot } from "lucide-react";

const ProximityAnalysisSection = ({ alerts, setNotification }) => {
  const [selectedAlertId, setSelectedAlertId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchCategory, setSearchCategory] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (category) => {
    if (!selectedAlertId) {
      setError("Please select an alert first.");
      return;
    }
    const selectedAlert = alerts.find((a) => a.id === selectedAlertId);
    if (!selectedAlert) {
      setError("Could not find the selected alert.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults([]);
    setSearchCategory(category);

    try {
      const serviceResults = await getProactiveProximityData(
        selectedAlert.location,
        categoryInfo[category]?.title || category,
      );
      setResults(serviceResults);
      setNotification(
        `Found ${serviceResults.length} nearby ${category} services.`,
        "success",
      );
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryInfo = {
    health: { icon: <HeartPulse />, title: "Health Services" },
    finance: { icon: <Landmark />, title: "Financial Centers" },
    transport: { icon: <Bus />, title: "Transportation Hubs" },
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Proximity Analysis</h2>
      <p className="text-slate-500 mt-1">
        Find critical services near an active disaster zone.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <select
          value={selectedAlertId}
          onChange={(e) => {
            setSelectedAlertId(e.target.value);
            setError("");
            setResults([]);
            setSearchCategory(null);
          }}
          className="w-full sm:w-1/3 bg-white border-slate-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">-- Select an Active Alert --</option>
          {alerts.map((alert) => (
            <option key={alert.id} value={alert.id}>
              {alert.title}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSearch("health")}
            disabled={!selectedAlertId || isLoading}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HeartPulse size={16} /> Health Services
          </button>
          <button
            onClick={() => handleSearch("finance")}
            disabled={!selectedAlertId || isLoading}
            className="flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Landmark size={16} /> Financial Centers
          </button>
          <button
            onClick={() => handleSearch("transport")}
            disabled={!selectedAlertId || isLoading}
            className="flex items-center gap-2 bg-yellow-100 text-yellow-700 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bus size={16} /> Transportation Hubs
          </button>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 min-h-[250px] flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center text-slate-500">
            <Bot size={48} className="animate-spin text-orange-400" />
            <p className="mt-4 font-semibold">
              AI is searching for nearby services...
            </p>
            <p className="text-sm">Please wait a moment.</p>
          </div>
        )}
        {error && !isLoading && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {results.length > 0 && !isLoading && searchCategory && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              {categoryInfo[searchCategory]?.icon}
              <h3 className="text-lg font-bold">
                {categoryInfo[searchCategory]?.title}
              </h3>
            </div>
            <div className="space-y-3">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-3 rounded-md border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.address}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
                    {item.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="text-center text-slate-400">
            <Search size={48} className="mx-auto" />
            <p className="mt-4 font-semibold">Ready to Analyze</p>
            <p className="mt-1 text-sm">
              Select an alert and a service category to begin your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProximityAnalysisSection;
