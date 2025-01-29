import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Si tu utilises le routing pour accéder à un patient spécifique
import { db } from "../firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

const PatientDetails = () => {
  const { patientId } = useParams(); // Récupère l'id du patient depuis l'URL (si tu utilises react-router)
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Récupérer les données du patient depuis Firestore
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const docRef = doc(db, "patients", patientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient(docSnap.data());
        } else {
          console.log("Pas de données trouvées pour ce patient");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du patient :", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (!patient) return <div>Chargement des données...</div>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full mt-4">
      <h2 className="text-xl font-bold mb-4">{patient.nom} {patient.prenom}</h2>
      
      {/* Onglets de navigation */}
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

      {/* Affichage dynamique selon l'onglet sélectionné */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-bold">Détails</h3>
            <ul className="space-y-2">
              <li>NISS: {patient.niss}</li>
              <li>Titre: {patient.titre}</li>
              <li>Sexe: {patient.sexe}</li>
              <li>Langue: {patient.langue}</li>
              <li>Date de naissance: {patient.dateNaissance}</li>
              <li>Nationalité: {patient.nationalite}</li>
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
