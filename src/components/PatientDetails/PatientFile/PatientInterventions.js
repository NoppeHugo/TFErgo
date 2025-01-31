import React from "react";

const PatientInterventions = ({ patient }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Compte Rendu des Interventions</h4>
      {patient.compteRenduInterventions?.map((intervention, index) => (
        <div key={index}>
          <p>Date: {intervention.date}</p>
          <p>{intervention.texte}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientInterventions;
