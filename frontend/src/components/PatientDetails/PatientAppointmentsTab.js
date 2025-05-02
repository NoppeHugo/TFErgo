import React, { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "../../api/appointmentAPI.js";
import PatientAppointmentFeedback from "./PatientAppointmentFeedback.js";
import { createEvaluationItem } from "../../api/evaluationAPI.js"; // ✅ Import

const PatientAppointmentsTab = ({ patient }) => {
  const [appointments, setAppointments] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState(""); // ✅
  const [reload, setReload] = useState(false); // ✅

  useEffect(() => {
    if (patient?.id) {
      getAppointmentsByPatient(patient.id).then(setAppointments);
    }
  }, [patient]);

  const handleAddItem = async () => {
    if (!newItemTitle) return;
    await createEvaluationItem(patient.id, newItemTitle);
    setNewItemTitle("");
    setReload((r) => !r); // ✅ déclenche un reload de tous les feedbacks
  };

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous pour ce patient.</p>;
  }

  return (
    <div className="space-y-4">
      {/* ✅ CHAMP AJOUT GLOBAL */}
      <div className="p-4 bg-white border rounded-xl mb-4">
        <h3 className="text-lg font-semibold mb-2">Ajouter un élément à évaluer</h3>
        <div className="flex gap-2">
          <input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Nouvel élément à évaluer"
            className="px-3 py-2 border rounded w-full"
          />
          <button
            onClick={handleAddItem}
            className="bg-dark2GreenErgogo text-white px-3 py-2 rounded hover:brightness-110"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 no-scrollbar">
      {appointments.map((apt) => (
        <div key={apt.id} className="p-4 bg-gray-50 border rounded-xl">
          <h3 className="font-semibold text-lg text-[#776B89]">
            {apt.title} – {new Date(apt.date).toLocaleString("fr-FR")}
          </h3>
          <p className="text-sm text-gray-700 mt-1">{apt.description}</p>

          {apt.activities?.length > 0 && (
            <div className="mt-2 text-sm">
              <strong>Activités liées :</strong>
              <ul className="list-disc list-inside">
                {apt.activities.map((link) => (
                  <li key={link.activity.id}>{link.activity.name}</li>
                ))}
              </ul>
            </div>
          )}

          {apt.sessionReport && (
            <div className="mt-2 text-sm text-gray-800">
              <strong>Compte rendu :</strong>
              <p>{apt.sessionReport}</p>
            </div>
          )}

          {/* 🔥 Feedback avec reload */}
          <div className="mt-4">
            <PatientAppointmentFeedback
              appointmentId={apt.id}
              patientId={patient.id}
              reloadTrigger={reload} // ✅
            />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default PatientAppointmentsTab;
