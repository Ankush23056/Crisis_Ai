import React, { useState, useEffect } from "react";
import { generateEmergencyResponsePlan } from "../services/geminiService";
import { X, CheckCircle, Truck, Map, Megaphone, Loader2 } from "lucide-react";

const ResponseModal = ({ alert, onClose }) => {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedPlan = await generateEmergencyResponsePlan(
          alert.type,
          alert.location,
          alert.severity,
        );
        setPlan(generatedPlan);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate response plan.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [alert]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              Command Center Response
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              AI-Generated Plan for: {alert.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-900">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">
                Generating AI Response Plan...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : plan ? (
            <div className="space-y-6">
              {/* Immediate Actions */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Immediate Actions (First Responders)
                </h3>
                <ul className="space-y-3">
                  {plan.immediateActions.map((action, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {index + 1}
                      </span>
                      <span className="mt-0.5">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resource Requirements */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-blue-400" />
                  Resource Requirements
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.resourceRequirements.map((resource, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-slate-300 bg-slate-800 p-3 rounded-md border border-slate-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evacuation Route */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                  <Map className="h-5 w-5 text-yellow-400" />
                  Evacuation Route
                </h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800 p-4 rounded-md border border-slate-700">
                  {plan.evacuationRoute}
                </p>
              </div>

              {/* Public Message */}
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-3">
                  <Megaphone className="h-5 w-5" />
                  Public Broadcast Message
                </h3>
                <div className="bg-slate-900 border border-orange-500/20 p-4 rounded-md">
                  <p className="text-orange-200 font-medium text-lg italic">
                    "{plan.publicMessage}"
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
          <button
            disabled={isLoading || !!error}
            className="px-5 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Execute Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
