import { useState, useEffect } from "react";
import { analyzeSocialRadar } from "../services/geminiService";
import {
  Radio,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export default function SocialRadar({ location = "San Francisco, CA" }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRadar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSocialRadar(location);
      setReport(data);
    } catch (err) {
      setError(err.message || "Failed to fetch social radar data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, [location]);

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg shadow-lg border border-slate-800 flex flex-col h-full min-h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Radio className="h-6 w-6 mr-2 text-purple-400" />
            Social Media "Early Warning" Radar
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Monitoring chatter for unreported crises near {location}
          </p>
        </div>
        <button
          onClick={fetchRadar}
          disabled={loading}
          className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 font-medium py-2 px-4 rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Scan Network
        </button>
      </div>

      {loading && !report ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <Radio className="h-10 w-10 text-purple-500 animate-ping mb-4" />
          <p className="text-slate-400 animate-pulse">
            Filtering noise and analyzing social feeds...
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-red-400">
          <AlertTriangle className="h-10 w-10 mb-4 opacity-80" />
          <p>{error}</p>
          <button
            onClick={fetchRadar}
            className="mt-4 underline text-sm hover:text-red-300"
          >
            Try Again
          </button>
        </div>
      ) : report ? (
        <div className="flex-1 flex flex-col space-y-6">
          {/* Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${report.flaggedPosts.length > 0 ? "bg-orange-900/20 border-orange-500/30" : "bg-green-900/20 border-green-500/30"}`}
            >
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Radar Status
              </p>
              <div className="flex items-center mt-1">
                {report.flaggedPosts.length > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-green-400 mr-2" />
                )}
                <p
                  className={`font-bold text-lg ${report.flaggedPosts.length > 0 ? "text-orange-400" : "text-green-400"}`}
                >
                  {report.overallStatus}
                </p>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                AI Summary
              </p>
              <p className="text-slate-300 text-sm leading-snug mt-1">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Flagged Posts */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Flagged Posts (Noise Filtered)
            </h3>

            {report.flaggedPosts.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-md text-center">
                <p className="text-slate-400">
                  No critical threats detected in recent social media chatter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {report.flaggedPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800 border border-slate-700 p-4 rounded-md flex flex-col relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${post.confidence > 80 ? "bg-red-500" : post.confidence > 50 ? "bg-orange-500" : "bg-yellow-500"}`}
                    ></div>

                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex items-center">
                        <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded mr-2">
                          {post.platform}
                        </span>
                        <span className="text-xs text-slate-400">
                          {post.time}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${post.confidence > 80 ? "bg-red-900/40 text-red-400" : "bg-orange-900/40 text-orange-400"}`}
                      >
                        {post.confidence}% Confidence
                      </span>
                    </div>

                    <p className="text-slate-200 text-sm italic mb-3 pl-2">
                      "{post.content}"
                    </p>

                    <div className="mt-auto pl-2">
                      <span className="inline-flex items-center text-xs font-medium text-slate-400">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Potential Threat:{" "}
                        <span className="text-slate-200 ml-1">
                          {post.threatType}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
