import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient, deletePatient } from "../api/patientAPI.js";
import PatientDetailsTab from "./PatientDetails/PatientDetailsTab.js";
import PatientNotesTab from "./PatientDetails/PatientNotesTab.js";
import PatientDataTab from "./PatientDetails/PatientDataTab.js";
import PatientFileTab from "./PatientDetails/PatientFileTab.js";

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [updatedPatient, setUpdatedPatient] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatient(patientId);
        setPatient(data);
        setUpdatedPatient(data);
      } catch (error) {
        console.error("Erreur de chargement du patient :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Supprimer ce patient ?");
    if (!confirmed) return;
    try {
      await deletePatient(patientId);
      navigate("/patients");
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePatient(patientId, updatedPatient);
      const refreshed = await getPatient(patientId);
      setPatient(refreshed);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
    }
  };

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (!patient) return <div className="p-4">Patient introuvable</div>;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* En-tête patient */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {patient.lastName} {patient.firstName}
        </h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition"
          onClick={handleDelete}
        >
          Supprimer
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: "details", label: "Détails" },
          { key: "carnet", label: "Carnet de notes" },
          { key: "donnees", label: "Données patient" },
          { key: "dossier", label: "Dossier patient" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`py-2 px-4 rounded-lg transition text-sm font-medium ${
              activeTab === key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="grow overflow-y-auto custom-scrollbar pr-1">
        {activeTab === "details" && (
          <PatientDetailsTab
            patient={patient}
            isEditing={isEditing}
            updatedPatient={updatedPatient}
            handleChange={handleChange}
            handleUpdate={handleUpdate}
            setIsEditing={setIsEditing}
          />
        )}
        {activeTab === "carnet" && <PatientNotesTab patient={patient} />}
        {activeTab === "donnees" && <PatientDataTab patient={patient} />}
        {activeTab === "dossier" && <PatientFileTab patient={patient} />}
      </div>
    </div>
  );
};

export default PatientDetails;
