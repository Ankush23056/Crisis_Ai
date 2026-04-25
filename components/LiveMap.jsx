import React, { useEffect, useRef } from "react";
import { AlertSeverity } from "../types";
import { timeSince } from "../utils";

// Use Leaflet from global scope

const severityColors = {
  [AlertSeverity.CRITICAL]: "#ef4444", // red-500
  [AlertSeverity.HIGH]: "#f97316", // orange-500
  [AlertSeverity.MEDIUM]: "#eab308", // yellow-500
  [AlertSeverity.LOW]: "#3b82f6", // blue-500
};

const customIcon = (color) =>
  L.divIcon({
    html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><circle cx="12" cy="9.5" r="2.5" fill="white"/></svg>`,
    className: "", // important to have empty className
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const LiveMap = ({ alerts, onRespond, setNotification }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Fix for map rendering half-loaded in a hidden tab
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];

      alerts.forEach((alert) => {
        const color = severityColors[alert.severity] || "gray";
        const buttonId = `respond-btn-${alert.id}`;
        const popupContent = `
                    <div style="font-family: sans-serif; font-size: 14px; max-width: 250px; line-height: 1.5;">
                        <b style="font-size: 16px; color: #1e293b;">${alert.title}</b>
                        <p style="font-size: 13px; color: #475569; margin: 8px 0 4px;">${alert.description}</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 8px 0;" />
                        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px; color: #334155;">
                            <b>Severity:</b> <span>${alert.severity}</span>
                            <b>Location:</b> <span>${alert.location}</span>
                            <b>Affected:</b> <span>${alert.affected.toLocaleString()}</span>
                            <b>Timestamp:</b> <span>${timeSince(alert.timestamp)}</span>
                        </div>
                        <button id="${buttonId}" style="width: 100%; margin-top: 12px; padding: 8px 12px; border: none; background: linear-gradient(to right, #f97316, #ef4444); color: white; border-radius: 6px; font-weight: 600; cursor: pointer;">Dispatch Response</button>
                    </div>
                `;

        const marker = L.marker([alert.lat, alert.lng], {
          icon: customIcon(color),
        }).addTo(map);
        marker.bindPopup(popupContent);

        marker.on("popupopen", () => {
          const btn = document.getElementById(buttonId);
          if (btn) {
            btn.onclick = () => onRespond(alert);
          }
        });
        markersRef.current.push(marker);
      });
    }
  }, [alerts, onRespond, setNotification]);

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Live Disaster Map</h2>
      <p className="text-slate-600 mb-4">
        Showing real-time locations of active alerts.
      </p>
      <div
        ref={mapContainerRef}
        id="map"
        className="h-[500px] w-full rounded-md z-0"
      />
    </div>
  );
};

export default LiveMap;
