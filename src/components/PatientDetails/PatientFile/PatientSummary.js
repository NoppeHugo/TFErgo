import React from "react";

const PatientSummary = ({ motif }) => {
  // Vérification de la présence des données
  if (!motif || !motif.synthese) {
    return <p className="text-gray-500">Aucune synthèse disponible.</p>;
  }

  return (
    <div>
      <h4 className="text-md font-semibold">Synthèse</h4>
      <p>{motif.synthese || "Non définie"}</p>
    </div>
  );
};

export default PatientSummary;
