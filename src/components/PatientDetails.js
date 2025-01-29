import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig.js";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [activeSubTab, setActiveSubTab] = useState("references");
  const [activeMotif, setActiveMotif] = useState(null);
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
            <div className="flex space-x-4 mb-4">
              <button
                className={`py-2 px-4 rounded-lg ${activeSubTab === "references" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveSubTab("references")}
              >
                Références et contacts
              </button>
              <button
                className={`py-2 px-4 rounded-lg ${activeSubTab === "sante" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveSubTab("sante")}
              >
                Données de santé
              </button>
            </div>

            {activeSubTab === "references" && (
              <div>
                <h4 className="text-md font-semibold">Références et contacts</h4>
                <div className="mt-2">
                  <h5 className="text-sm font-semibold">Dispensateurs de soin</h5>
                  <ul className="space-y-2">
                    <li>Nom: {patient.dispensateurNom}</li>
                    <li>Prénom: {patient.dispensateurPrenom}</li>
                    <li>Type: {patient.dispensateurType}</li>
                    <li>INAMI: {patient.dispensateurINAMI}</li>
                    <li>Téléphone: {patient.dispensateurTelephone}</li>
                    <li>Email: {patient.dispensateurEmail}</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-semibold">Autres contacts</h5>
                  <ul className="space-y-2">
                    <li>Nom: {patient.contactNom}</li>
                    <li>Prénom: {patient.contactPrenom}</li>
                    <li>Relation: {patient.contactRelation}</li>
                    <li>Téléphone: {patient.contactTelephone}</li>
                    <li>Email: {patient.contactEmail}</li>
                    <li>Commentaire: {patient.contactCommentaire}</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSubTab === "sante" && (
              <div>
                <h4 className="text-md font-semibold">Données de santé</h4>
                <ul className="space-y-2">
                  <li>Diagnostic médical: {patient.diagnosticMedical}</li>
                  <li>Titre du diagnostic: {patient.titreDiagnostic}</li>
                  <li>Antécédents médicaux: {patient.antecedentsMedicaux}</li>
                  <li>Texte avec les antécédents: {patient.texteAntecedents}</li>
                  <li>Chronique de santé: {patient.chroniqueSante}</li>
                  <li>Texte sur la vie du patient: {patient.texteViePatient}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "dossier" && (
          <div>
            <h3 className="text-lg font-bold">Dossier Client</h3>
            <div className="mt-4">
              <h4 className="text-md font-semibold">Motifs d'intervention</h4>
              <ul className="space-y-2">
                {patient.motifsIntervention?.map((motif, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={() => setActiveMotif(motif)}
                  >
                    {motif.titre}
                  </li>
                ))}
              </ul>
            </div>

            {activeMotif && (
              <div className="mt-4">
                <h4 className="text-md font-semibold">Résumé</h4>
                <ul className="space-y-2">
                  <li>Groupe cible: {activeMotif.groupeCible}</li>
                  <li>Âge: {activeMotif.age}</li>
                  <li>Motif d'intervention: {activeMotif.motifIntervention}</li>
                  <li>Batteries code CIF: {activeMotif.batteriesCodeCIF}</li>
                </ul>

                <h4 className="text-md font-semibold mt-4">Situation personnelle</h4>
                <ul className="space-y-2">
                  <li>Personne: {activeMotif.situationPersonnelle?.personne}</li>
                  <li>Occupation: {activeMotif.situationPersonnelle?.occupation}</li>
                  <li>Environnement: {activeMotif.situationPersonnelle?.environnement}</li>
                </ul>

                <h4 className="text-md font-semibold mt-4">Perspective thérapeutique</h4>
                <ul className="space-y-2">
                  <li>Assesments: {activeMotif.perspectiveTherapeutique?.assesments}</li>
                  <li>Synthèse de la phase d'évaluation: {activeMotif.perspectiveTherapeutique?.syntheseEvaluation}</li>
                  <li>Restrictions de participations et souhaits occupationnels: {activeMotif.perspectiveTherapeutique?.restrictionsSouhaits}</li>
                </ul>

                <h4 className="text-md font-semibold mt-4">Objectifs long terme et court terme</h4>
                <ul className="space-y-2">
                  <li>Objectifs long terme: {activeMotif.objectifsLongTerme}</li>
                  <li>Objectifs court terme:</li>
                  {activeMotif.objectifsCourtTerme?.map((objectif, index) => (
                    <ul key={index} className="ml-4 space-y-2">
                      <li>Date: {objectif.date}</li>
                      <li>Titre: {objectif.titre}</li>
                      <li>Date de fin: {objectif.dateFin}</li>
                      <li>Statut: {objectif.statut}</li>
                      <li>Activités réalisées pour cet objectif: {objectif.activitesRealisees}</li>
                    </ul>
                  ))}
                </ul>

                <h4 className="text-md font-semibold mt-4">Diagnostic</h4>
                <p>{activeMotif.diagnostic}</p>

                <h4 className="text-md font-semibold mt-4">Compte rendu des interventions</h4>
                {activeMotif.compteRenduInterventions?.map((intervention, index) => (
                  <ul key={index} className="ml-4 space-y-2">
                    <li>Date: {intervention.date}</li>
                    <li>Texte: {intervention.texte}</li>
                  </ul>
                ))}

                <h4 className="text-md font-semibold mt-4">Synthèse</h4>
                <p>{activeMotif.synthese}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;