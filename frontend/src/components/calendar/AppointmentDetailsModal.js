import React from "react";
import { motion } from "framer-motion";
import { deleteAppointment } from "../../api/appointmentAPI.js";
import { useQueryClient } from "@tanstack/react-query";

const AppointmentDetailsModal = ({ appointment, onClose, onEdit }) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (window.confirm("Supprimer ce rendez-vous ?")) {
      await deleteAppointment(appointment.id);
      queryClient.invalidateQueries(["appointments"]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-[#776B89] mb-4">
          📝 Détails du rendez-vous
        </h2>

        <div className="space-y-2 text-sm">
          <p><strong>🧠 Titre :</strong> {appointment.title}</p>
          <p><strong>👤 Patient :</strong> {appointment.patient?.firstName} {appointment.patient?.lastName}</p>
          <p><strong>📅 Date :</strong> {new Date(appointment.date).toLocaleString("fr-FR")}</p>
          <p><strong>⏱️ Durée :</strong> {appointment.duration} min</p>
          <p><strong>📋 Description :</strong> {appointment.description || "–"}</p>
          <p>
            <strong>🎯 Activités :</strong>{" "}
            {appointment.activities?.map((a) => a.activity.name).join(", ") || "–"}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline text-sm"
          >
            Supprimer
          </button>
          <button
            onClick={() => onEdit(appointment)}
            className="text-[#A294F9] hover:underline text-sm"
          >
            Modifier
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:underline text-sm"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentDetailsModal;
