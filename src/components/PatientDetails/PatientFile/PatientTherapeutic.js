import React from "react";

const PatientTherapeutic = ({ patient }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Perspective Thérapeutique</h4>
      <ul>
        <li>Assesments: {patient.perspectiveTherapeutique?.assesments}</li>
        <li>Synthèse de l'évaluation: {patient.perspectiveTherapeutique?.syntheseEvaluation}</li>
        <li>Restrictions de participation: {patient.perspectiveTherapeutique?.restrictionsSouhaits}</li>
      </ul>
    </div>
  );
};

export default PatientTherapeutic;
