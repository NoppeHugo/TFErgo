import React from "react";

const PatientDataTab = ({ patient }) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Données Client</h3>
      <ul className="space-y-2">
        <li>Email: {patient.email}</li>
        <li>Adresse: {patient.adresse}</li>
        <li>Téléphone: {patient.telephone1}</li>
      </ul>
    </div>
  );
};

export default PatientDataTab;
