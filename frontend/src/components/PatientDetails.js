import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient, deletePatient } from "../api/patientAPI.js";
import PatientDetailsTab from "./PatientDetails/PatientDetailsTab.js";
import PatientNotesTab from "./PatientDetails/PatientNotesTab.js";
import PatientDataTab from "./PatientDetails/PatientDataTab.js";
import PatientFileTab from "./PatientDetails/PatientFileTab.js";
import PatientAppointmentsTab from "./PatientDetails/PatientAppointmentsTab.js";

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* 🔒 Partie fixe */}
      <div className="flex-shrink-0 bg-white px-6 pt-6 pb-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {patient.lastName} {patient.firstName}
          </h2>
          <button
            className="bg-[#AB3130] text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { key: "details", label: "Détails" },
            { key: "carnet", label: "Carnet de notes" },
            { key: "donnees", label: "Données patient" },
            { key: "dossier", label: "Dossier patient" },
            { key: "rendezvous", label: "Rendez-vous" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`py-2 px-4 rounded-lg transition text-sm font-medium ${
                activeTab === key
                  ? "bg-middleBlueErgogo text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 🧭 Partie scrollable */}
      <div className="flex-grow overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
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
        {activeTab === "rendezvous" && <PatientAppointmentsTab patient={patient} />}
      </div>
    </div>
  );
};

export default PatientDetails;