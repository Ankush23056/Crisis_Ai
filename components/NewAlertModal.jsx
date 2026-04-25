// FIX: Correctly import `useState` from React to resolve 'Cannot find name' errors.
import React, { useState } from "react";
import { AlertSeverity, AlertStatus } from "../types";
import { X } from "lucide-react";

const cityCoordinates = {
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
};

const disasterTypes = [
  "Earthquake",
  "Flood",
  "Wildfire",
  "Cyclone",
  "Landslide",
  "Fire",
  "Tsunami",
  "Industrial Accident",
];
const cities = Object.keys(cityCoordinates);

const NewAlertModal = ({ onClose, onAddAlert }) => {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [affected, setAffected] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !severity || !title || !location || !description) {
      alert("Please fill out all required fields.");
      return;
    }

    const coords = cityCoordinates[location] || { lat: 20.5937, lng: 78.9629 }; // Default coordinates

    const newAlertData = {
      title,
      type,
      description,
      location,
      lat: coords.lat,
      lng: coords.lng,
      affected: affected || 0,
      severity,
      status: AlertStatus.ACTIVE,
    };
    onAddAlert(newAlertData);
    onClose();
  };
  const inputStyle =
    "w-full bg-white text-slate-900 border-slate-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 placeholder-slate-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Create New Emergency Alert
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="disaster-type"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Disaster Type
                </label>
                <select
                  id="disaster-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputStyle}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {disasterTypes.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="severity"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className={inputStyle}
                >
                  <option value="" disabled>
                    Select severity
                  </option>
                  {Object.values(AlertSeverity).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="alert-title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Alert Title
              </label>
              <input
                type="text"
                id="alert-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Earthquake M7.2 Detected"
                className={inputStyle}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Location (City)
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputStyle}
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="affected-people"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Affected People
                </label>
                <input
                  type="number"
                  id="affected-people"
                  value={affected}
                  onChange={(e) =>
                    setAffected(parseInt(e.target.value, 10) || 0)
                  }
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the emergency..."
                className={`${inputStyle} resize-y`}
              />
            </div>
          </div>

          <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-slate-300 rounded-lg px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 shadow-sm"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAlertModal;
