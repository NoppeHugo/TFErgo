import { useState } from "react";
import PatientReferences from "./DataClient/PatientReferences.js";
import PatientHealthData from "./DataClient/PatientHealthData.js";
import { updatePatient } from "../../api/patientAPI.js";

const PatientDataTab = ({ patient }) => {
  const [activeSubTab, setActiveSubTab] = useState("references");
  const [updatedPatient, setUpdatedPatient] = useState({ ...patient });

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updatePatient(patient.id, updatedPatient);
      alert("✅ Données mises à jour !");
    } catch (err) {
      console.error("❌ Erreur mise à jour :", err);
      alert("❌ Erreur de sauvegarde.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      <div className="px-6 pt-6 pb-2 border-b">
        <div className="flex flex-wrap gap-4">
          <button
            className={`py-2 px-4 rounded-lg transition-all text-sm font-medium ${
              activeSubTab === "references"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveSubTab("references")}
          >
            Références et Contacts
          </button>
          <button
            className={`py-2 px-4 rounded-lg transition-all text-sm font-medium ${
              activeSubTab === "health"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveSubTab("health")}
          >
            Données de Santé
          </button>
        </div>
      </div>

      <div className="grow overflow-y-auto px-6 py-4 custom-scrollbar">
        {activeSubTab === "references" && (
          <PatientReferences
            patient={updatedPatient}
            handleChange={handleChange}
            handleSave={handleSave}
          />
        )}
        {activeSubTab === "health" && (
          <PatientHealthData
            patient={updatedPatient}
            patientId={patient.id}
            handleChange={handleChange}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDataTab;
