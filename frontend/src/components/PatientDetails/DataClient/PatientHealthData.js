import { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import {
  getPatientHealthData,
  updatePatientHealthData,
} from "../../../api/healthDataApi.js";

const PatientHealthData = ({ patientId }) => {
  const [editing, setEditing] = useState(false);
  const [healthData, setHealthData] = useState({
    medicalDiagnosis: "",
    medicalHistory: "",
    healthChronicle: "",
  });

  useEffect(() => {
    if (patientId) {
      loadHealthData();
    }
  }, [patientId]);

  useEffect(() => {
    if (editing) {
      const autosaveInterval = setInterval(() => {
        handleAutoSave();
      }, 10000);

      return () => clearInterval(autosaveInterval);
    }
  }, [editing, healthData]);

  const loadHealthData = async () => {
    try {
      const data = await getPatientHealthData(patientId);
      setHealthData(data);
    } catch (err) {
      console.error("Erreur chargement santé:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updatePatientHealthData(patientId, healthData);
      setEditing(false);
      alert("✅ Données mises à jour !");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      alert("❌ Erreur sauvegarde.");
    }
  };

  const handleAutoSave = async () => {
    try {
      await updatePatientHealthData(patientId, healthData);
      console.log("✅ Données autosauvegardées !");
    } catch (err) {
      console.error("Erreur autosauvegarde:", err);
    }
  };

  const handleCancel = () => {
    loadHealthData();
    setEditing(false);
  };

  return (
    <div className="flex flex-col bg-white h-full w-full rounded-lg shadow-md p-4">
      {/* Header avec titre + bouton à droite */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Données de Santé</h3>
        {!editing ? (
          <button
            className="bg-middleBlueErgogo text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setEditing(true)}
          >
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2">
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
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto flex-grow pr-1 custom-scrollbar space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Diagnostic Médical
          </label>
          <input
            type="text"
            value={healthData.medicalDiagnosis}
            onChange={(e) =>
              handleInputChange("medicalDiagnosis", e.target.value)
            }
            className="border p-2 rounded w-full"
            disabled={!editing}
          />
        </div>

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

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Chronique de Santé
          </label>
          <QuillEditor
            value={healthData.healthChronicle}
            onChange={(value) =>
              handleInputChange("healthChronicle", value)
            }
            readOnly={!editing}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientHealthData;
