import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import { updatePatient } from "../../../api/patientAPI.js";

const PatientHealthData = ({ patient, patientId }) => {
  const [editing, setEditing] = useState(false);
  const [healthData, setHealthData] = useState({
    medicalDiagnosis: "",
    medicalHistory: "",
    healthChronicle: "",
  });

  useEffect(() => {
    setHealthData({
      medicalDiagnosis: patient?.medicalDiagnosis || "",
      medicalHistory: patient?.medicalHistory || "",
      healthChronicle: patient?.healthChronicle || "",
    });
  }, [patient]);

  const handleInputChange = (field, value) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!patientId) {
      alert("Erreur : ID patient manquant.");
      return;
    }

    try {
      await updatePatient(patientId, healthData);
      setEditing(false);
      alert("✅ Données de santé mises à jour !");
    } catch (err) {
      console.error("Erreur mise à jour des données de santé :", err);
      alert("❌ Erreur de sauvegarde.");
    }
  };

  const handleCancel = () => {
    setHealthData({
      medicalDiagnosis: patient?.medicalDiagnosis || "",
      medicalHistory: patient?.medicalHistory || "",
      healthChronicle: patient?.healthChronicle || "",
    });
    setEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Données de Santé
      </h3>

      <div className="space-y-6">
        {/* Diagnostic médical */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Diagnostic Médical
          </label>
          <input
            type="text"
            value={healthData.medicalDiagnosis}
            onChange={(e) => handleInputChange("medicalDiagnosis", e.target.value)}
            className="border p-2 rounded w-full"
            disabled={!editing}
          />
        </div>

        {/* Antécédents médicaux */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Antécédents Médicaux
          </label>
          <QuillEditor
            value={healthData.medicalHistory}
            onChange={(value) => handleInputChange("medicalHistory", value)}
            readOnly={!editing}
          />
        </div>

        {/* Chronique de santé */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Chronique de Santé
          </label>
          <QuillEditor
            value={healthData.healthChronicle}
            onChange={(value) => handleInputChange("healthChronicle", value)}
            readOnly={!editing}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          {!editing ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setEditing(true)}
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleSave}
              >
                Enregistrer
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleCancel}
              >
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
