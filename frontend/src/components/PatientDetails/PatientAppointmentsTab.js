import React, { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "../../api/appointmentAPI.js";
import PatientAppointmentFeedback from "./PatientAppointmentFeedback.js"; // 🆕 à importer

const PatientAppointmentsTab = ({ patient }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (patient?.id) {
      getAppointmentsByPatient(patient.id).then(setAppointments);
    }
  }, [patient]);

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous pour ce patient.</p>;
  }

  return (
    <div className="space-y-4">
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

          {/* 🔥 Ajout du feedback */}
          <div className="mt-4">
            <PatientAppointmentFeedback appointmentId={apt.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientAppointmentsTab;