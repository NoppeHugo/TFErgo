import React, { useEffect } from "react";

const Toast = ({ message, onClose, type = "success", persistent }) => {
  const bg = type === "error" ? "bg-red-600" : "bg-dark2GreenErgogo";

  useEffect(() => {
    if (!persistent) {
      const timeout = setTimeout(onClose, type === "error" ? 3000 : 2000);
      return () => clearTimeout(timeout);
    }
    // Si persistent, ne jamais auto-close
  }, [onClose, type, persistent]);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={
          `${bg} text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 ` +
          (!persistent ? "animate-fade-in-out" : "")
        }
      >
        <span role="img" aria-label="notif">{type === "error" ? "❌" : "📋"}</span>
        {message}
        {!persistent && (
          <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
        )}
      </div>
    </div>
  );
};

export function showErrorToast(setToast, message) {
  setToast({ message, type: "error", persistent: false });
}

export function showSuccessToast(setToast, message) {
  setToast({ message, type: "success", persistent: false });
}

export function showConfirmToast(setToast, messageComponent) {
  setToast({ message: messageComponent, type: "error", persistent: true });
}

export default Toast;
