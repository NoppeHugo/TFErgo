import React, { useState } from "react";
import PatientSituation from "./PatientFile/PatientSituation.js";
import PatientTherapeutic from "./PatientFile/PatientTherapeutic.js";
import PatientObjectives from "./PatientFile/PatientObjectives.js";
import PatientDiagnosis from "./PatientFile/PatientDiagnosis.js";
import PatientInterventions from "./PatientFile/PatientInterventions.js";
import PatientSummary from "./PatientFile/PatientSummary.js";

const PatientFileTab = ({ patient }) => {
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("situation");

  return (
    <div className="flex space-x-4">
      {/* Liste des motifs d’intervention */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-3">Motifs d’intervention</h4>
        <ul className="space-y-2">
          {patient.motifsIntervention?.map((motif, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedMotif === motif ? "bg-blue-500 text-white" : "bg-gray-200"
              } hover:bg-blue-300`}
              onClick={() => setSelectedMotif(motif)}
            >
              <strong>{motif.motifIntervention}</strong>
              <p className="text-sm">Groupe: {motif.groupeCible} | Âge: {motif.age}</p>
              <p className="text-xs">Batteries: {motif.batteriesCodeCIF}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Affichage des onglets du dossier client */}
      <div className="w-3/4 bg-white p-4 rounded-lg shadow">
        {selectedMotif ? (
          <>
            <div className="flex space-x-2 mb-4">
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "situation" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("situation")}>
                Situation Personnelle
              </button>
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "therapeutic" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("therapeutic")}>
                Perspective Thérapeutique
              </button>
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "objectives" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("objectives")}>
                Objectifs
              </button>
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "diagnosis" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("diagnosis")}>
                Diagnostic
              </button>
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "interventions" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("interventions")}>
                Compte Rendu
              </button>
              <button className={`py-2 px-4 rounded-lg ${activeSubTab === "summary" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveSubTab("summary")}>
                Synthèse
              </button>
            </div>

            {/* Affichage du sous-onglet sélectionné */}
            {activeSubTab === "situation" && <PatientSituation motif={selectedMotif} />}
            {activeSubTab === "therapeutic" && <PatientTherapeutic motif={selectedMotif} />}
            {activeSubTab === "objectives" && <PatientObjectives motif={selectedMotif} />}
            {activeSubTab === "diagnosis" && <PatientDiagnosis motif={selectedMotif} />}
            {activeSubTab === "interventions" && <PatientInterventions motif={selectedMotif} />}
            {activeSubTab === "summary" && <PatientSummary motif={selectedMotif} />}
          </>
        ) : (
          <p className="text-gray-500 text-center">Sélectionnez un motif d’intervention pour afficher les détails.</p>
        )}
      </div>
    </div>
  );
};

export default PatientFileTab;
