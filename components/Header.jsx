import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Bell,
  User,
  TriangleAlert,
  Ambulance,
  Siren,
  Radio,
} from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";

const Header = ({ setNotification }) => {
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsEmergencyMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = (message) => {
    setNotification(message, "error");
    setIsEmergencyMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-orange-600" />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-slate-800 leading-tight">
              Crisis AI
            </h1>
            <p className="text-xs text-slate-500 leading-tight">
              Emergency Management Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            ALERT STATUS
          </button>
          <div className="relative flex items-center">
            <button
              onClick={() =>
                setNotification("Showing 7 new notifications.", "info")
              }
              className="p-1 flex items-center"
            >
              <Bell className="h-6 w-6 text-slate-500 hover:text-slate-800" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                7
              </span>
            </button>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="p-1 flex items-center"
            title="Edit Profile"
          >
            <User className="h-6 w-6 text-slate-500 hover:text-slate-800" />
          </button>
          <div className="relative flex items-center" ref={menuRef}>
            <button
              onClick={() => setIsEmergencyMenuOpen(!isEmergencyMenuOpen)}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              EMERGENCY
            </button>
            {isEmergencyMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl z-20 border">
                <div className="p-2">
                  <p className="text-xs font-bold text-slate-500 uppercase px-2 py-1">
                    One-Tap Action Presets
                  </p>
                  <button
                    onClick={() =>
                      handleActionClick("Evacuation Protocol Triggered!")
                    }
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <TriangleAlert className="h-5 w-5 text-yellow-500" /> 🚨
                    Trigger Evacuation Protocol
                  </button>
                  <button
                    onClick={() =>
                      handleActionClick("Medical Teams Dispatched!")
                    }
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <Ambulance className="h-5 w-5 text-blue-500" /> 🚑 Dispatch
                    Medical Teams
                  </button>
                  <button
                    onClick={() =>
                      handleActionClick("Law Enforcement Notified!")
                    }
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <Siren className="h-5 w-5 text-red-500" /> 🚓 Notify Law
                    Enforcement
                  </button>
                  <button
                    onClick={() =>
                      handleActionClick("Public Alert Broadcasted!")
                    }
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <Radio className="h-5 w-5 text-green-500" /> 📢 Broadcast
                    Public Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        setNotification={setNotification}
      />
    </>
  );
};

export default Header;
