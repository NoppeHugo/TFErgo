import React from "react";

const PatientDetailsTab = ({ patient, isEditing, updatedPatient, handleChange, handleUpdate }) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Détails</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nom" placeholder="Nom" value={updatedPatient.nom} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="prenom" placeholder="Prénom" value={updatedPatient.prenom} onChange={handleChange} className="border p-2 rounded" />
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4" onClick={handleUpdate}>
            Enregistrer
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          <li>Nom: {patient.nom}</li>
          <li>Prénom: {patient.prenom}</li>
          <li>NISS: {patient.niss}</li>
          <li>Date de naissance: {patient.dateNaissance}</li>
        </ul>
      )}
    </div>
  );
};

export default PatientDetailsTab;
