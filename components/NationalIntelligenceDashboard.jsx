import { useState, useEffect } from "react";
import { getProactiveNationalRisk } from "../services/geminiService";
import {
  ShieldAlert,
  RefreshCw,
  MapPin,
  Calendar,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function NationalIntelligenceDashboard({ country = "India" }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProactiveNationalRisk(country);
      setReport(data);
    } catch (err) {
      setError(err.message || "Failed to fetch national intelligence report.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [country]);

  const getRiskColor = (score) => {
    if (score <= 3) return "text-green-500";
    if (score <= 6) return "text-yellow-500";
    if (score <= 8) return "text-orange-500";
    return "text-red-500";
  };

  const getRiskBgColor = (score) => {
    if (score <= 3) return "bg-green-100 border-green-200";
    if (score <= 6) return "bg-yellow-100 border-yellow-200";
    if (score <= 8) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg shadow-lg h-full border border-slate-800 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <ShieldAlert className="h-6 w-6 mr-2 text-blue-400" />
            National Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Proactive Statecraft & Risk Analysis for {country}
          </p>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-medium py-2 px-4 rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Request Updated Intel Report
        </button>
      </div>

      {loading && !report ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-400 animate-pulse">
            Analyzing historical patterns and environmental trends...
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-red-400">
          <AlertTriangle className="h-10 w-10 mb-4 opacity-80" />
          <p>{error}</p>
          <button
            onClick={fetchReport}
            className="mt-4 underline text-sm hover:text-red-300"
          >
            Try Again
          </button>
        </div>
      ) : report ? (
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${getRiskBgColor(report.currentRiskLevel)} bg-opacity-10`}
            >
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Current Risk Level
              </p>
              <div className="flex items-end">
                <span
                  className={`text-4xl font-black ${getRiskColor(report.currentRiskLevel)}`}
                >
                  {report.currentRiskLevel}
                </span>
                <span className="text-slate-500 ml-1 mb-1 font-medium">
                  / 10
                </span>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Command Level
              </p>
              <div className="flex items-start mt-1">
                <Activity className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-slate-200 font-medium text-sm leading-snug">
                  {report.commandLevel}
                </p>
              </div>
            </div>
          </div>

          {/* High Risk States */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              High-Risk Regions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.highRiskStates.map((stateInfo, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 border border-slate-700 p-3 rounded-md flex flex-col"
                >
                  <span className="font-bold text-slate-200">
                    {stateInfo.state}
                  </span>
                  <span className="text-orange-400 text-sm mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {stateInfo.primaryThreat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Predicted Timeline */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              7-Day Forecast
            </h3>
            <div className="space-y-3">
              {report.predictedTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 border border-slate-700 p-3 rounded-md flex items-start"
                >
                  <div className="flex flex-col items-center justify-center bg-slate-900 rounded px-3 py-2 mr-4 min-w-[70px] border border-slate-700">
                    <span className="text-xs text-slate-400 uppercase">
                      {item.date}
                    </span>
                    <span
                      className={`font-bold ${item.probability > 60 ? "text-red-400" : item.probability > 30 ? "text-orange-400" : "text-blue-400"}`}
                    >
                      {item.probability}%
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
