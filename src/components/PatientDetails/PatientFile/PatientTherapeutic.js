import React from "react";

const PatientTherapeutic = ({ motif }) => {
  if (!motif || !motif.perspectiveTherapeutique) {
    return <p className="text-gray-500">Aucune donnée disponible.</p>;
  }

  return (
    <div>
      <h4 className="text-md font-semibold">Perspective Thérapeutique</h4>
      <ul>
        <li>Assesments: {motif.perspectiveTherapeutique?.assesments || "Non défini"}</li>
        <li>Synthèse de l'évaluation: {motif.perspectiveTherapeutique?.syntheseEvaluation || "Non défini"}</li>
        <li>Restrictions de participation: {motif.perspectiveTherapeutique?.restrictionsSouhaits || "Non défini"}</li>
      </ul>
    </div>
  );
};

export default PatientTherapeutic;
