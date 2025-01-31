import React from "react";

const PatientDiagnosis = ({ patient }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Diagnostic</h4>
      <p>{patient.diagnostic}</p>
    </div>
  );
};

export default PatientDiagnosis;
