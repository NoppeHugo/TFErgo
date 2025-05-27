import React, { useState } from "react";
import QuillEditor from "../../QuillEditor.js";
import { showSuccessToast, showErrorToast, showConfirmToast } from "../../common/Toast.js";
import Toast from "../../common/Toast.js";

function DeleteConfirmationToast({ message, onConfirm, onCancel }) {
  return (
    <span>
      {message}
      <button
        className="ml-4 bg-red-600 text-white px-2 py-1 rounded"
        onClick={onConfirm}
      >
        Oui
      </button>
      <button
        className="ml-2 bg-gray-400 text-white px-2 py-1 rounded"
        onClick={onCancel}
      >
        Non
      </button>
    </span>
  );
}

const PatientInterventions = ({ motif, updateMotif }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newIntervention, setNewIntervention] = useState({
    date: "",
    texte: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInputChange = (field, value) => {
    setNewIntervention((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveIntervention = async () => {
    if (!newIntervention.date || !newIntervention.texte || !newIntervention.texte.trim()) {
      showErrorToast(setToast, "La date et le texte du compte rendu sont obligatoires");
      return;
    }
    const updatedMotif = {
      ...motif,
      compteRenduInterventions: [
        ...(motif.compteRenduInterventions || []),
        newIntervention,
      ],
    };

    try {
      await updateMotif(updatedMotif);
      setNewIntervention({ date: "", texte: "" });
      setShowForm(false);
      showSuccessToast(setToast, "Intervention ajoutée avec succès.");
    } catch (error) {
      showErrorToast(setToast, "Erreur lors de l'ajout de l'intervention.");
    }
  };

  const handleEditIntervention = (index) => {
    setEditingIndex(index);
    setNewIntervention(motif.compteRenduInterventions[index]);
    setShowForm(true);
  };

  const handleSaveEditIntervention = async () => {
    const updatedMotif = {
      ...motif,
      compteRenduInterventions: motif.compteRenduInterventions.map((intervention, index) =>
        index === editingIndex ? newIntervention : intervention
      ),
    };

    try {
      await updateMotif(updatedMotif);
      setEditingIndex(null);
      setNewIntervention({ date: "", texte: "" });
      setShowForm(false);
      showSuccessToast(setToast, "Intervention modifiée avec succès.");
    } catch (error) {
      showErrorToast(setToast, "Erreur lors de la modification de l'intervention.");
    }
  };

  const handleDeleteIntervention = (index) => {
    showConfirmToast(
      setToast,
      <DeleteConfirmationToast
        message="Voulez-vous vraiment supprimer cette intervention ?"
        onConfirm={async () => {
          const updatedMotif = {
            ...motif,
            compteRenduInterventions: motif.compteRenduInterventions.filter((_, i) => i !== index),
          };
          try {
            await updateMotif(updatedMotif);
            showSuccessToast(setToast, "Intervention supprimée.");
          } catch (error) {
            showErrorToast(setToast, "Erreur lors de la suppression de l'intervention.");
          }
        }}
        onCancel={() => setToast(null)}
      />
    );
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewIntervention({ date: "", texte: "" });
    setShowForm(false);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
      <h4 className="text-md font-semibold mb-4">Compte Rendu des Interventions</h4>

      <button
        className="mb-4 bg-middleBlueErgogo text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={() => {
          setShowForm(true);
          setEditingIndex(null);
          setNewIntervention({ date: "", texte: "" });
        }}
      >
        Ajouter une intervention
      </button>

      {showForm && (
        <div className="mb-4 border p-4 rounded-lg">
          <input
            type="date"
            className="w-full mb-2 border rounded-lg p-2"
            placeholder="Date de l'intervention"
            value={newIntervention.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
          <QuillEditor
            value={newIntervention.texte}
            onChange={(value) => handleInputChange("texte", value)}
            readOnly={false}
          />
          <div className="flex space-x-2 mt-4">
            {editingIndex !== null ? (
              <>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handleSaveEditIntervention}
                >
                  Enregistrer
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleSaveIntervention}
              >
                Ajouter
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        {motif.compteRenduInterventions?.length > 0 ? (
          <ul className="space-y-2">
            {motif.compteRenduInterventions.map((intervention, index) => (
              <li key={index} className="border-b py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Date:</strong> {intervention.date || "Non spécifiée"}</p>
                    <div dangerouslySetInnerHTML={{ __html: intervention.texte }} />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-yellow-500 hover:underline"
                      onClick={() => handleEditIntervention(index)}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteIntervention(index)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucune intervention enregistrée.</p>
        )}
      </div>
    </div>
  );
};

export default PatientInterventions;