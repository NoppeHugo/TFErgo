import React from "react";

const PatientObjectives = ({ motif }) => {
  return (
    <div>
      <h4 className="text-md font-semibold">Objectifs</h4>
      <h5>Objectifs Long Terme</h5>
      <p>{motif.objectifsLongTerme}</p>
      
      <h5>Objectifs Court Terme</h5>
      {motif.objectifsCourtTerme?.map((objectif, index) => (
        <div key={index}>
          <p>{objectif.titre} - {objectif.date} (Statut: {objectif.statut})</p>
        </div>
      ))}
    </div>
  );
};

export default PatientObjectives;
