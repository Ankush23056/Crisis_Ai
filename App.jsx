import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import NavTabs from "./components/NavTabs";
import AlertsSection from "./components/AlertsSection";
import NewAlertModal from "./components/NewAlertModal";
import EditAlertModal from "./components/EditAlertModal";
import LiveMap from "./components/LiveMap";
import ProximityAnalysisSection from "./components/ProximityAnalysisSection";
import AssessmentSection from "./components/AssessmentSection";
import RiskPredictionTab from "./components/RiskPredictionTab";
import AlertDetailsModal from "./components/AlertDetailsModal";
import ResponseModal from "./components/ResponseModal";
import Notification from "./components/Notification";
import Chatbot from "./components/Chatbot";
import SocialRadar from "./components/SocialRadar";
import { statCardData } from "./constants";
import { AlertStatus } from "./types";
import {
  createAlert as apiCreateAlert,
  updateAlert as apiUpdateAlert,
} from "./services/apiService";
import { fetchLiveAlerts, getChatbotResponse } from "./services/geminiService";

export default function App() {
  const [activeTab, setActiveTab] = useState("Alerts");
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [viewingAlert, setViewingAlert] = useState(null);
  const [respondingAlert, setRespondingAlert] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hello! I'm your Health & Disaster Expert. How can I assist you with crisis management, first aid, or emergency planning today?",
        },
      ],
    },
  ]);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const fetchedAlerts = await fetchLiveAlerts();
        setAlerts(fetchedAlerts);
      } catch (error) {
        showNotification(
          "Failed to load live alerts. Please try again later.",
          "error",
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAlerts();
  }, []);

  const handleNewAlert = async (alertData) => {
    try {
      const newAlert = await apiCreateAlert(alertData);
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
      showNotification(
        `New alert "${newAlert.title}" has been successfully created.`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to create alert. Please try again.", "error");
      console.error(error);
    }
  };
  const handleUpdateAlert = async (updatedAlert) => {
    try {
      const savedAlert = await apiUpdateAlert(updatedAlert);
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === savedAlert.id ? savedAlert : alert,
        ),
      );
      showNotification(
        `Alert "${savedAlert.title}" has been successfully updated.`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update alert. Please try again.", "error");
      console.error(error);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const handleSendMessage = async (message) => {
    const userMessage = { role: "user", parts: [{ text: message }] };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await getChatbotResponse(message, chatHistory);
      const modelMessage = { role: "model", parts: [{ text: response }] };
      setChatHistory((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      const modelErrorMessage = {
        role: "model",
        parts: [{ text: `Error: ${errorMessage}` }],
      };
      setChatHistory((prev) => [...prev, modelErrorMessage]);
      showNotification(errorMessage, "error");
    }
  };

  const activeAlerts = alerts.filter(
    (alert) => alert.status === AlertStatus.ACTIVE,
  );

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.type.toLowerCase().includes(searchLower) ||
        alert.location.toLowerCase().includes(searchLower);
      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;
      const matchesStatus =
        statusFilter === "All" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header setNotification={showNotification} />
      <main className="p-4 sm:p-6 lg:p-8">
        <StatCards stats={statCardData} />
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {isLoading ? (
          <div className="mt-6 text-center">Loading alerts...</div>
        ) : (
          <>
            {activeTab === "Alerts" && (
              <div className="space-y-6 mt-6">
                <SocialRadar location="India" />
                <AlertsSection
                  alerts={filteredAlerts}
                  onNewAlertClick={() => setIsModalOpen(true)}
                  onViewDetails={setViewingAlert}
                  onEditAlert={setEditingAlert}
                  onRespond={setRespondingAlert}
                  setNotification={showNotification}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  severityFilter={severityFilter}
                  setSeverityFilter={setSeverityFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>
            )}
            {activeTab === "Live Map" && (
              <LiveMap
                alerts={activeAlerts}
                onRespond={setRespondingAlert}
                setNotification={showNotification}
              />
            )}
            {activeTab === "Proximity Analysis" && (
              <ProximityAnalysisSection
                alerts={activeAlerts}
                setNotification={showNotification}
              />
            )}
            {activeTab === "Assessment" && (
              <AssessmentSection
                alerts={alerts}
                setNotification={showNotification}
              />
            )}
            {activeTab === "AI Risk Prediction" && <RiskPredictionTab />}
          </>
        )}
      </main>
      {isModalOpen && (
        <NewAlertModal
          onClose={() => setIsModalOpen(false)}
          onAddAlert={handleNewAlert}
        />
      )}
      {editingAlert && (
        <EditAlertModal
          alert={editingAlert}
          onClose={() => setEditingAlert(null)}
          onUpdateAlert={handleUpdateAlert}
        />
      )}
      {viewingAlert && (
        <AlertDetailsModal
          alert={viewingAlert}
          onClose={() => setViewingAlert(null)}
        />
      )}
      {respondingAlert && (
        <ResponseModal
          alert={respondingAlert}
          onClose={() => setRespondingAlert(null)}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Chatbot
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        messages={chatHistory}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
