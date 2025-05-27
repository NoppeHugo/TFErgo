import React, { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "../../api/appointmentAPI.js";
import PatientAppointmentFeedback from "./PatientAppointmentFeedback.js";
import { createEvaluationItem, getEvaluationItemsByPatient, deleteEvaluationItem } from "../../api/evaluationAPI.js";
import Toast, { showSuccessToast, showErrorToast, showConfirmToast } from "../common/Toast.js";
import Spinner from '../common/Spinner.js';

const PatientAppointmentsTab = ({ patient }) => {
  const [appointments, setAppointments] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [reload, setReload] = useState(false);
  const [items, setItems] = useState([]); // ✅ éléments à évaluer
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient?.id) {
      setLoading(true);
      Promise.all([
        getAppointmentsByPatient(patient.id).then(setAppointments),
        getEvaluationItemsByPatient(patient.id).then(setItems)
      ]).finally(() => setLoading(false));
    }
  }, [patient, reload]);

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;
    try {
      await createEvaluationItem(patient.id, newItemTitle);
      setNewItemTitle("");
      setReload((r) => !r);
      showSuccessToast(setToast, "Élément ajouté avec succès.");
    } catch (err) {
      showErrorToast(setToast, "Erreur lors de l'ajout de l'élément.");
    }
  };

  function DeleteConfirmationToast({ message, onConfirm, onCancel }) {
    return (
      <span>
        {message}
        <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={onConfirm}>Oui</button>
        <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={onCancel}>Non</button>
      </span>
    );
  }

  const handleDeleteItem = (id) => {
    showConfirmToast(
      setToast,
      <DeleteConfirmationToast
        message="Supprimer cet élément ?"
        onConfirm={async () => {
          try {
            await deleteEvaluationItem(id);
            setReload((r) => !r);
            showSuccessToast(setToast, "Élément supprimé.");
          } catch (err) {
            showErrorToast(setToast, "Erreur lors de la suppression.");
          }
          setToast(null);
        }}
        onCancel={() => setToast(null)}
      />
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40"><Spinner size={40} /></div>;
  }

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous pour ce patient.</p>;
  }

  return (
    <div className="space-y-4">
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
      <div className="p-4 bg-white border rounded-xl mb-4">
        <h3 className="text-lg font-semibold mb-2">Ajouter un élément à évaluer</h3>
        <div className="flex gap-2 mb-3">
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

        {/* ✅ Liste des éléments avec bouton suppression */}
        {items.length > 0 && (
          <ul className="space-y-2 text-sm text-gray-700">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
              >
                <span>{item.title}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
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

            <div className="mt-4">
              <PatientAppointmentFeedback
                appointmentId={apt.id}
                patientId={patient.id}
                reloadTrigger={reload}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointmentsTab;
