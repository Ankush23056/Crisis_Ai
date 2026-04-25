import React from "react";
import {
  TriangleAlert,
  ChevronRight,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import { AlertSeverity, AlertStatus } from "../types";
import { timeSince } from "../utils";

const severityConfig = {
  [AlertSeverity.CRITICAL]: {
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-700",
    iconColor: "text-red-500",
    tagColor: "bg-red-500 text-white",
  },
  [AlertSeverity.HIGH]: {
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500",
    textColor: "text-orange-700",
    iconColor: "text-orange-500",
    tagColor: "bg-orange-500 text-white",
  },
  [AlertSeverity.MEDIUM]: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-700",
    iconColor: "text-yellow-500",
    tagColor: "bg-yellow-500 text-white",
  },
  [AlertSeverity.LOW]: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
    tagColor: "bg-blue-500 text-white",
  },
};

const statusColors = {
  [AlertStatus.ACTIVE]: "bg-red-500 text-white",
  [AlertStatus.MONITORING]: "bg-yellow-500 text-white",
  [AlertStatus.RESOLVED]: "bg-green-500 text-white",
  [AlertStatus.UPDATING]: "bg-blue-500 text-white",
};

const AlertCard = ({ alert, onViewDetails, onEdit, onRespond }) => {
  const config =
    severityConfig[alert.severity] || severityConfig[AlertSeverity.MEDIUM];

  return (
    <div
      className={`border ${config.borderColor} ${config.bgColor} p-4 rounded-lg shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <TriangleAlert className={`h-6 w-6 ${config.iconColor} mt-1`} />
          <div>
            <div className="flex items-center gap-3">
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {alert.title}
              </h3>
              <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {alert.type}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[alert.status]}`}
              >
                {alert.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
          </div>
        </div>
        <button onClick={() => onViewDetails(alert)}>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {alert.location}
          </div>
          <div className={`flex items-center gap-1.5 ${config.textColor}`}>
            <Users className="h-4 w-4" /> {alert.affected.toLocaleString()}{" "}
            affected
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {timeSince(alert.timestamp)}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => onRespond(alert)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md px-4 py-1.5 text-sm font-medium hover:opacity-90 shadow-sm"
          >
            Respond
          </button>
          <button
            onClick={() => onViewDetails(alert)}
            className="bg-white border border-slate-300 rounded-md px-4 py-1.5 text-sm font-medium hover:bg-slate-50"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(alert)}
            className="bg-white border border-slate-300 rounded-md px-4 py-1.5 text-sm font-medium hover:bg-slate-50"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
