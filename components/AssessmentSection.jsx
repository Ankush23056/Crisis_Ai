import React, { useState } from "react";
import { generateDetailedAssessment } from "../services/geminiService";
import { BrainCircuit, Bot } from "lucide-react";

const AssessmentSection = ({ alerts, setNotification }) => {
  const [selectedAlertId, setSelectedAlertId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!selectedAlertId) {
      setError("Please select an alert to assess.");
      return;
    }
    const selectedAlert = alerts.find((a) => a.id === selectedAlertId);
    if (!selectedAlert) {
      setError("Could not find the selected alert.");
      return;
    }
    setIsLoading(true);
    setError("");
    setAssessment("");

    try {
      const result = await generateDetailedAssessment(selectedAlert);
      setAssessment(result);
      setNotification("AI assessment generated successfully.", "success");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Risk Assessment</h2>
          <p className="text-slate-500 mt-1">
            Generate intelligent disaster risk analysis and recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotification("AI Assistant chat opened.", "info")}
            className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
            style={{
              background: "linear-gradient(to right, #f3e8ff, #e9d5ff)",
              color: "#8b5cf6",
            }}
          >
            <BrainCircuit size={16} />
            AI Assistant
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <select
          value={selectedAlertId}
          onChange={(e) => setSelectedAlertId(e.target.value)}
          className="flex-1 bg-white border-slate-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select an alert to assess</option>
          {alerts.map((alert) => (
            <option key={alert.id} value={alert.id}>
              {alert.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !selectedAlertId}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(to right, #a78bfa, #7c3aed)" }}
        >
          <Bot size={16} />
          {isLoading ? "Generating..." : "Generate Assessment"}
        </button>
      </div>

      <div className="mt-8 border-t pt-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center text-slate-500">
            <Bot size={48} className="animate-pulse text-purple-400" />
            <p className="mt-4 font-semibold">AI is analyzing the risk...</p>
            <p className="text-sm">This may take a few moments.</p>
          </div>
        )}
        {error && !isLoading && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {assessment && !isLoading && (
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: assessment.replace(/\n/g, "<br />"),
            }}
          />
        )}

        {!assessment && !isLoading && !error && (
          <div className="text-center text-slate-400">
            <p className="font-semibold">NO ASSESSMENT GENERATED</p>
            <p className="mt-1 text-sm">
              Select an alert above and click "Generate Assessment" to get
              AI-powered risk analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSection;
