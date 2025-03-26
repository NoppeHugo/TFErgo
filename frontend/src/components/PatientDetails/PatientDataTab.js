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
    <div className="bg-white p-6 rounded-lg shadow-md h-full w-full max-w-8xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Données Patient</h3>
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg ${activeSubTab === "references" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveSubTab("references")}
        >
          Références et Contacts
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${activeSubTab === "health" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveSubTab("health")}
        >
          Données de Santé
        </button>
      </div>

      <div className="transition-all duration-500 ease-in-out h-full overflow-y-auto">
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
