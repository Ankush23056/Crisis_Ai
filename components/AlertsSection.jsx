import React from "react";
import { Filter, Plus } from "lucide-react";
import { AlertSeverity, AlertStatus } from "../types";
import AlertCard from "./AlertCard";

const AlertsSection = ({
  alerts,
  onNewAlertClick,
  onViewDetails,
  onEditAlert,
  onRespond,
  setNotification,
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h2 className="text-xl font-bold">Emergency Alerts</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time monitoring and response coordination
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setNotification("Filter options opened.", "info")}
            className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={onNewAlertClick}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Alert
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Search by keyword, type, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3 bg-white border border-slate-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All">All Severities</option>
          {Object.values(AlertSeverity).map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All">All Statuses</option>
          {Object.values(AlertStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onViewDetails={onViewDetails}
              onEdit={onEditAlert}
              onRespond={onRespond}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="font-semibold text-slate-600">No alerts found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertsSection;
