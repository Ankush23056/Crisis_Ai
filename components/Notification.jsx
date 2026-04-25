import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const notificationConfig = {
  info: {
    icon: <Info className="h-5 w-5" />,
    style: "bg-blue-500",
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    style: "bg-green-500",
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    style: "bg-red-600",
  },
};

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger fade-in
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out before calling onClose
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  const config = notificationConfig[type];

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 text-white p-4 rounded-lg shadow-lg transition-all duration-300 transform ${config.style} ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {config.icon}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="ml-4 p-1 rounded-full hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Notification;
