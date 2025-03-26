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

  if (loading) return <div>Chargement...</div>;
  if (!patient) return <div>Patient introuvable</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full h-full">
      <h2 className="text-xl font-bold">{patient.lastName} {patient.firstName}</h2>
      <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm" onClick={handleDelete}>
        Supprimer
      </button>

      <div className="flex space-x-4 mb-6">
        {["details", "carnet", "donnees", "dossier"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded-lg ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" ? "Détails" : tab === "carnet" ? "Carnet de notes" : tab === "donnees" ? "Données patient" : "Dossier patient"}
          </button>
        ))}
      </div>
      


      <div className="transition-all duration-500 ease-in-out h-full overflow-y-auto">
        {activeTab === "details" && <PatientDetailsTab patient={patient} isEditing={isEditing} updatedPatient={updatedPatient} handleChange={handleChange} handleUpdate={handleUpdate} setIsEditing={setIsEditing} />}
        {activeTab === "carnet" && <PatientNotesTab patient={patient} />}
        {activeTab === "donnees" && <PatientDataTab patient={patient} />}
        {activeTab === "dossier" && <PatientFileTab patient={patient} />}
      </div>
    </div>
  );
};

export default PatientDetails;
