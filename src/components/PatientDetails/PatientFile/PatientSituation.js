import React from "react";

const PatientSituation = ({ motif }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Situation Personnelle</h4>
      <ul>
        <li>Personne: {motif.situationPersonnelle?.personne}</li>
        <li>Occupation: {motif.situationPersonnelle?.occupation}</li>
        <li>Environnement: {motif.situationPersonnelle?.environnement}</li>
      </ul>
    </div>
  );
};

export default PatientSituation;
