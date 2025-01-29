import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig.js";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPatient, setUpdatedPatient] = useState({});
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
          console.log("Pas de données trouvées pour ce patient");
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
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-bold">Détails</h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="nom"
                  placeholder="Nom" 
                  value={updatedPatient.nom} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="prenom"
                  placeholder="Prénom" 
                  value={updatedPatient.prenom} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="niss"
                  placeholder="NISS" 
                  value={updatedPatient.niss} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="date" 
                  name="dateNaissance"
                  placeholder="Date de Naissance" 
                  value={updatedPatient.dateNaissance} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="adresse"
                  placeholder="Adresse" 
                  value={updatedPatient.adresse} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="telephone1"
                  placeholder="Téléphone 1" 
                  value={updatedPatient.telephone1} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="telephone2"
                  placeholder="Téléphone 2" 
                  value={updatedPatient.telephone2} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={updatedPatient.email} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="mutuelle"
                  placeholder="Mutuelle" 
                  value={updatedPatient.mutuelle} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="ct1_ct2"
                  placeholder="CT1/CT2" 
                  value={updatedPatient.ct1_ct2} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="tiersPayant"
                  placeholder="Tiers Payant" 
                  value={updatedPatient.tiersPayant} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="medecinFamille"
                  placeholder="Médecin de Famille" 
                  value={updatedPatient.medecinFamille} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="profession"
                  placeholder="Profession" 
                  value={updatedPatient.profession} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="number" 
                  name="nbrEnfants"
                  placeholder="Nombre d'Enfants" 
                  value={updatedPatient.nbrEnfants} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="facturerA"
                  placeholder="Facturer à" 
                  value={updatedPatient.facturerA} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="zoneResidence"
                  placeholder="Zone de Résidence" 
                  value={updatedPatient.zoneResidence} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <input 
                  type="text" 
                  name="etatCivil"
                  placeholder="État Civil" 
                  value={updatedPatient.etatCivil} 
                  onChange={handleChange} 
                  className="border p-2 rounded" 
                />
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4"
                  onClick={handleUpdate}
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                <li>NISS: {patient.niss}</li>
                <li>Date de naissance: {patient.dateNaissance}</li>
                <li>Adresse: {patient.adresse}</li>
                <li>Téléphone 1: {patient.telephone1}</li>
                <li>Téléphone 2: {patient.telephone2}</li>
                <li>Email: {patient.email}</li>
                <li>Mutuelle: {patient.mutuelle}</li>
                <li>CT1/CT2: {patient.ct1_ct2}</li>
                <li>Tiers Payant: {patient.tiersPayant}</li>
                <li>Médecin de famille: {patient.medecinFamille}</li>
                <li>Profession: {patient.profession}</li>
                <li>Nombre d’enfants: {patient.nbrEnfants}</li>
                <li>Facturer à: {patient.facturerA}</li>
                <li>Zone de résidence: {patient.zoneResidence}</li>
                <li>Etat civil: {patient.etatCivil}</li>
              </ul>
            )}
          </div>
        )}

        {activeTab === "carnet" && (
          <div>
            <h3 className="text-lg font-bold">Carnet de notes</h3>
            {/* Affiche les notes ici */}
          </div>
        )}

        {activeTab === "donnees" && (
          <div>
            <h3 className="text-lg font-bold">Données client</h3>
            {/* Affiche les données de santé et les contacts ici */}
          </div>
        )}

        {activeTab === "dossier" && (
          <div>
            <h3 className="text-lg font-bold">Dossier Client</h3>
            {/* Affiche les interventions, objectifs, etc. */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;