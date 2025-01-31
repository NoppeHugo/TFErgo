import React from "react";

const PatientSummary = ({ patient }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Synthèse</h4>
      <p>{patient.synthese}</p>
    </div>
  );
};

export default PatientSummary;
