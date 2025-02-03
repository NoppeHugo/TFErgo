import React from "react";

const PatientDiagnosis = ({ motif }) => {
  if (!motif || !motif.diagnostic) {
    return <p className="text-gray-500">Aucune donnée disponible.</p>;
  }

  return (
    <div>
      <h4 className="text-md font-semibold">Diagnostic</h4>
      <p>{motif.diagnostic || "Non défini"}</p>
    </div>
  );
};

export default PatientDiagnosis;
