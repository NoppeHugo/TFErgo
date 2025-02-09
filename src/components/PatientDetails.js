import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, deletePatient, updatePatient } from "../firebase/patientsFirestore.js";
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
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        console.log("Récupération du patient :", patientId);
        const data = await getPatient(patientId);
        if (data) {
          console.log("Patient chargé :", data);
          setPatient({ id: patientId, ...data });
          setUpdatedPatient({ id: patientId, ...data }); // Synchronisation pour l'édition
        } else {
          console.error("Erreur : aucun patient trouvé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
      setLoading(false);
    };
    fetchPatientData();
  }, [patientId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?");
    if (!confirmDelete) return;

    try {
      await deletePatient(patientId);
      navigate("/patients");
    } catch (error) {
      console.error("Erreur lors de la suppression du patient :", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePatient(patientId, updatedPatient);
      const updatedData = await getPatient(patientId);
      setPatient(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du patient :", error);
    }
  };

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Chargement des données...</div>;
  if (!patient) return <div>Aucun patient trouvé.</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full h-full">
      <h2 className="text-xl font-bold">{patient.nom} {patient.prenom}</h2>
      <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm" onClick={handleDelete}>
        Supprimer
      </button>

      <div className="flex space-x-4 mb-6">
        <button className={`py-2 px-4 rounded-lg ${activeTab === "details" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("details")}>
          Détails
        </button>
        <button className={`py-2 px-4 rounded-lg ${activeTab === "carnet" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("carnet")}>
          Carnet de notes
        </button>
        <button className={`py-2 px-4 rounded-lg ${activeTab === "donnees" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("donnees")}>
          Données client
        </button>
        <button className={`py-2 px-4 rounded-lg ${activeTab === "dossier" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("dossier")}>
          Dossier client
        </button>
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