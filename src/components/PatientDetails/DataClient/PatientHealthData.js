import React, { useState } from "react";

const PatientHealthData = ({ patient, handleChange, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="h-full overflow-y-auto w-full max-w-7xl">
      <h4 className="text-lg font-semibold mb-4">Données de Santé</h4>
      {isEditing ? (
        <div>
          <input type="text" name="diagnosticMedical" placeholder="Diagnostic médical" value={patient.diagnosticMedical || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <input type="text" name="titreDiagnostic" placeholder="Titre du diagnostic" value={patient.titreDiagnostic || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <input type="text" name="antecedentsMedicaux" placeholder="Antécédents médicaux" value={patient.antecedentsMedicaux || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <textarea name="texteAntecedents" placeholder="Texte avec les antécédents" value={patient.texteAntecedents || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <input type="text" name="chroniqueSante" placeholder="Chronique de santé" value={patient.chroniqueSante || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <textarea name="texteViePatient" placeholder="Texte sur la vie du patient" value={patient.texteViePatient || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4" onClick={() => { handleSave(); handleEditToggle(); }}>
            Enregistrer
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mt-4 ml-2" onClick={handleEditToggle}>
            Annuler
          </button>
        </div>
      ) : (
        <div>
          <p className="max-w-md break-words"><strong>Diagnostic médical:</strong> {patient.diagnosticMedical}</p>
          <p className="max-w-md break-words"><strong>Titre du diagnostic:</strong> {patient.titreDiagnostic}</p>
          <p className="max-w-md break-words"><strong>Antécédents médicaux:</strong> {patient.antecedentsMedicaux}</p>
          <p className="max-w-md break-words"><strong>Texte avec les antécédents:</strong> {patient.texteAntecedents}</p>
          <p className="max-w-md break-words"><strong>Chronique de santé:</strong> {patient.chroniqueSante}</p>
          <p className="max-w-md break-words"><strong>Texte sur la vie du patient:</strong> {patient.texteViePatient}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4" onClick={handleEditToggle}>
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientHealthData;