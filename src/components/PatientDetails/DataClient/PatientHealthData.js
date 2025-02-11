import React, { useState } from "react";
import LexicalEditor from "../../LexicalEditor.js"; // Ajuste le chemin selon ton projet

const PatientHealthData = ({ patient, handleChange, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="h-full overflow-y-auto w-full bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Données de Santé</h4>
      <div className="space-y-4">
        {/* Section Diagnostic Médical */}
        <div>
          <label className="block text-gray-700 font-semibold">Diagnostic Médical</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="diagnosticMedical"
              placeholder="Diagnostic médical"
              value={patient.diagnosticMedical || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={!isEditing}
            />
            <button
              className="absolute right-3 text-gray-500 hover:text-gray-700"
              onClick={handleEditToggle}
            >
              Modifier
            </button>
          </div>
        </div>

        {/* Section Antécédents Médicaux avec LexicalEditor */}
        <div>
          <label className="block text-gray-700 font-semibold">Antécédents Médicaux</label>
          <LexicalEditor 
            value={patient.antecedentsMedicaux || ""} 
            onChange={(content) => handleChange({ target: { name: "antecedentsMedicaux", value: content } })}
            readOnly={!isEditing}
          />
        </div>

        {/* Section Chronique de Santé avec LexicalEditor */}
        <div>
          <label className="block text-gray-700 font-semibold">Chronique de santé</label>
          <LexicalEditor 
            value={patient.chroniqueSante || ""} 
            onChange={(content) => handleChange({ target: { name: "chroniqueSante", value: content } })}
            readOnly={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex space-x-4 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={() => {
                handleSave();
                handleEditToggle();
              }}
            >
              Enregistrer
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={handleEditToggle}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHealthData;
