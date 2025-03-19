import React, { useEffect, useState } from "react";
import { addMotifIntervention, getMotifsIntervention, updateMotifIntervention } from "../../firebase/patientsFirestore.js";
import PatientSituation from "./PatientFile/PatientSituation.js";
import PatientTherapeutic from "./PatientFile/PatientTherapeutic.js";
import PatientObjectives from "./PatientFile/PatientObjectives.js";
import PatientDiagnosis from "./PatientFile/PatientDiagnosis.js";
import PatientInterventions from "./PatientFile/PatientInterventions.js";
import PatientSummary from "./PatientFile/PatientSummary.js";

const PatientFileTab = ({ patient }) => {
  const [motifs, setMotifs] = useState([]);
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("situation");
  const [newMotif, setNewMotif] = useState({ motifIntervention: "", groupeCible: "", age: "", batteriesCodeCIF: "" });

  useEffect(() => {
    if (!patient?.id) return;

    const fetchMotifs = async () => {
      const motifsList = await getMotifsIntervention(patient.id);
      setMotifs(motifsList);
    };

    fetchMotifs();
  }, [patient?.id]);

  const handleCreateMotif = async () => {
    if (!newMotif.motifIntervention.trim()) return;

    const addedMotif = await addMotifIntervention(patient.id, {
      ...newMotif,
      perspectiveTherapeutique: {
        assesments: "",
        syntheseEvaluation: "",
        restrictionsSouhaits: "",
      },
    });

    if (addedMotif) {
      setMotifs([...motifs, addedMotif]);
      setNewMotif({ motifIntervention: "", groupeCible: "", age: "", batteriesCodeCIF: "" });
    }
  };

  const handleSelectMotif = (motif) => {
    setSelectedMotif({
      ...motif,
      perspectiveTherapeutique: motif.perspectiveTherapeutique || {
        assesments: "",
        syntheseEvaluation: "",
        restrictionsSouhaits: "",
      },
    });
  };

  const handleUpdateMotifData = async (updatedMotif) => {
    if (!selectedMotif) return;
    console.log("🟢 Tentative de mise à jour du motif :", updatedMotif);
    try {
      await updateMotifIntervention(patient.id, selectedMotif.id, updatedMotif);
      console.log("✅ Motif mis à jour avec succès !");
      
      // 🔥 Mise à jour immédiate de la liste des motifs pour voir le changement sans refresh
      setMotifs((prevMotifs) =>
        prevMotifs.map((m) => (m.id === selectedMotif.id ? updatedMotif : m))
      );
      setSelectedMotif(updatedMotif);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du motif :", error);
    }
  };

  return (
    <div className="flex space-x-4">
      {/* Liste des motifs d’intervention */}
      <div className="w-1/6 bg-gray-100 p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-3">Motifs d’intervention</h4>

        {/* Ajout d'un nouveau motif */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Motif d'intervention"
            value={newMotif.motifIntervention}
            onChange={(e) => setNewMotif({ ...newMotif, motifIntervention: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleCreateMotif}>
            Ajouter
          </button>
        </div>

        <ul className="space-y-2">
          {motifs.map((motif, index) => ( // 🔹 Ajout de l'index pour éviter l'erreur si `motif.id` est absent
            <li
              key={motif.id || index} // 🔹 Correction ici
              className={`cursor-pointer p-2 rounded-lg ${
                selectedMotif?.id === motif.id ? "bg-blue-500 text-white" : "bg-gray-200"
              } hover:bg-blue-300`}
              onClick={() => handleSelectMotif(motif)}
            >
              <strong>{motif.motifIntervention}</strong>
              <p className="text-sm">Groupe: {motif.groupeCible} | Âge: {motif.age}</p>
              <p className="text-xs">Batteries: {motif.batteriesCodeCIF}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Affichage des onglets du dossier patient */}
      <div className="w-5/6 bg-white p-4 rounded-lg shadow">
        {selectedMotif ? (
          <>
            <div className="flex space-x-2 mb-4">
              {["situation", "therapeutic", "objectives", "diagnosis", "interventions", "summary"].map((tab, index) => (
                <button
                  key={tab || index} // 🔹 Correction ici
                  className={`py-2 px-4 rounded-lg ${
                    activeSubTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setActiveSubTab(tab)}
                >
                  {tab === "situation" ? "Situation Personnelle" : ""}
                  {tab === "therapeutic" ? "Perspective Thérapeutique" : ""}
                  {tab === "objectives" ? "Objectifs" : ""}
                  {tab === "diagnosis" ? "Diagnostic" : ""}
                  {tab === "interventions" ? "Compte Rendu" : ""}
                  {tab === "summary" ? "Synthèse" : ""}
                </button>
              ))}
            </div>

            {/* Affichage du sous-onglet sélectionné */}
            {activeSubTab === "situation" && <PatientSituation motif={selectedMotif} patientId={patient.id} updateMotif={handleUpdateMotifData} />}
            {activeSubTab === "therapeutic" && <PatientTherapeutic motif={selectedMotif} patientId={patient.id} updateMotif={handleUpdateMotifData} />}
            {activeSubTab === "objectives" && <PatientObjectives motif={selectedMotif} updateMotif={handleUpdateMotifData} />}
            {activeSubTab === "diagnosis" && <PatientDiagnosis motif={selectedMotif} updateMotif={handleUpdateMotifData} />}
            {activeSubTab === "interventions" && <PatientInterventions motif={selectedMotif} updateMotif={handleUpdateMotifData} />}
            {activeSubTab === "summary" && <PatientSummary motif={selectedMotif} updateMotif={handleUpdateMotifData} />}
          </>
        ) : (
          <p className="text-gray-500 text-center">Sélectionnez un motif d’intervention.</p>
        )}
      </div>
    </div>
  );
};

export default PatientFileTab;