import React from "react";
import {
  X,
  TriangleAlert,
  MapPin,
  Users,
  Clock,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { timeSince } from "../utils";

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-6 w-6 text-slate-400">{icon}</div>
    <div className="ml-3">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-base text-slate-800">{value}</p>
    </div>
  </div>
);

const AlertDetailsModal = ({ alert, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-800">Alert Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-slate-800">{alert.title}</h3>
            <p className="text-slate-600 mt-1">{alert.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <DetailItem
              icon={<ShieldAlert />}
              label="Severity"
              value={alert.severity}
            />
            <DetailItem icon={<Zap />} label="Status" value={alert.status} />
            <DetailItem
              icon={<MapPin />}
              label="Location"
              value={alert.location}
            />
            <DetailItem
              icon={<Users />}
              label="People Affected"
              value={alert.affected.toLocaleString()}
            />
            <DetailItem
              icon={<Clock />}
              label="Reported"
              value={timeSince(alert.timestamp)}
            />
          </div>
        </div>

        <div className="p-5 border-t bg-slate-50 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsModal;
