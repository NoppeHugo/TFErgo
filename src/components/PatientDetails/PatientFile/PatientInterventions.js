import React from "react";

const PatientInterventions = ({ motif }) => {
  // Vérification de la présence des données
  if (!motif || !motif.compteRenduInterventions) {
    return <p className="text-gray-500">Aucune intervention enregistrée.</p>;
  }

  return (
    <div>
      <h4 className="text-md font-semibold">Compte Rendu des Interventions</h4>
      {motif.compteRenduInterventions.length > 0 ? (
        motif.compteRenduInterventions.map((intervention, index) => (
          <div key={index} className="border-b py-2">
            <p><strong>Date:</strong> {intervention.date || "Non spécifiée"}</p>
            <p>{intervention.texte || "Pas de texte"}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucune intervention enregistrée.</p>
      )}
    </div>
  );
};

export default PatientInterventions;
