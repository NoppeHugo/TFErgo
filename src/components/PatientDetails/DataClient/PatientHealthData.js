import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import { updatePatient } from "../../../firebase/patientsFirestore.js";

const PatientHealthData = ({ patient, patientId, handleChange, handleSave }) => {
  const [editing, setEditing] = useState(false);
  const [healthData, setHealthData] = useState({
    diagnosticMedical: patient?.diagnosticMedical || "",
    antecedentsMedicaux: patient?.antecedentsMedicaux || "",
    chroniqueSante: patient?.chroniqueSante || "",
  });

  useEffect(() => {
    setHealthData({
      diagnosticMedical: patient?.diagnosticMedical || "",
      antecedentsMedicaux: patient?.antecedentsMedicaux || "",
      chroniqueSante: patient?.chroniqueSante || "",
    });
  }, [patient]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setHealthData({
      diagnosticMedical: patient?.diagnosticMedical || "",
      antecedentsMedicaux: patient?.antecedentsMedicaux || "",
      chroniqueSante: patient?.chroniqueSante || "",
    });
  };

  const handleInputChange = (field, value) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveHealthData = async () => {
    if (!patientId) {
      console.error("❌ patientId est undefined !");
      alert("Erreur : Impossible de sauvegarder, l'ID du patient est introuvable.");
      return;
    }

    const updatedData = {
      diagnosticMedical: healthData.diagnosticMedical || "",
      antecedentsMedicaux: healthData.antecedentsMedicaux || "",
      chroniqueSante: healthData.chroniqueSante || "",
    };

    console.log("📤 Sauvegarde des données :", patientId, updatedData);

    try {
      await updatePatient(patientId, updatedData);
      console.log("✅ Mise à jour réussie !");
      handleSave(); // Rafraîchir les données
      setEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto w-full bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Données de Santé</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Diagnostic Médical</label>
          <input
            type="text"
            name="diagnosticMedical"
            placeholder="Diagnostic médical"
            value={healthData.diagnosticMedical}
            onChange={(e) => handleInputChange("diagnosticMedical", e.target.value)}
            className="border p-2 rounded w-full"
            disabled={!editing}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Antécédents Médicaux</label>
          <QuillEditor
            value={healthData.antecedentsMedicaux}
            onChange={(value) => handleInputChange("antecedentsMedicaux", value)}
            readOnly={!editing}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Chronique de Santé</label>
          <QuillEditor
            value={healthData.chroniqueSante}
            onChange={(value) => handleInputChange("chroniqueSante", value)}
            readOnly={!editing}
          />
        </div>

        <div className="flex space-x-2">
          {!editing ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleEdit}>
              Modifier
            </button>
          ) : (
            <>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleSaveHealthData}>
                Enregistrer
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={handleCancel}>
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHealthData;
