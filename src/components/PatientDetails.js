import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig.js";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const docRef = doc(db, "patients", patientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient(docSnap.data());
          setUpdatedPatient(docSnap.data());
        } else {
          console.log("Aucune donnée trouvée pour ce patient");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du patient :", error);
      }
    };
    fetchPatientData();
  }, [patientId]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "patients", patientId));
      navigate("/patients");
    } catch (error) {
      console.error("Erreur lors de la suppression du patient :", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "patients", patientId), updatedPatient);
      setPatient(updatedPatient);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du patient :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPatient({ ...updatedPatient, [name]: value });
  };

  if (!patient) return <div>Chargement des données...</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{patient.nom} {patient.prenom}</h2>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 text-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Annuler" : "Modifier"}
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg ${activeTab === "details" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("details")}
        >
          Détails
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${activeTab === "carnet" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("carnet")}
        >
          Carnet de notes
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${activeTab === "donnees" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("donnees")}
        >
          Données client
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${activeTab === "dossier" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("dossier")}
        >
          Dossier client
        </button>
      </div>

      <div className="transition-all duration-500 ease-in-out">
        {activeTab === "details" && <PatientDetailsTab patient={patient} isEditing={isEditing} updatedPatient={updatedPatient} handleChange={handleChange} handleUpdate={handleUpdate} />}
        {activeTab === "carnet" && <PatientNotesTab patient={patient} />}
        {activeTab === "donnees" && <PatientDataTab patient={patient} />}
        {activeTab === "dossier" && <PatientFileTab patient={patient} />}
      </div>
    </div>
  );
};

export default PatientDetails;
