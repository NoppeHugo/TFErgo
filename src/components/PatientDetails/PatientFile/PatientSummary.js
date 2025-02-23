import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";

const PatientSummary = ({ motif, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [synthese, setSynthese] = useState(motif?.synthese || "");

  useEffect(() => {
    setSynthese(motif?.synthese || "");
  }, [motif]);

  const handleSave = async () => {
    if (!motif) return;

    const updatedMotif = {
      ...motif,
      synthese,
    };

    try {
      await updateMotif(updatedMotif);
      setEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la synthèse :", error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSynthese(motif?.synthese || "");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg h-full">
      <h4 className="text-md font-semibold mb-4">Synthèse</h4>

      <div className="border rounded-lg p-2">
        <QuillEditor
          value={synthese}
          onChange={setSynthese}
          readOnly={!editing}
          className="min-h-[150px] max-h-64 overflow-auto"
        />
      </div>

      <div className="flex space-x-2 mt-4">
        {editing ? (
          <>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={handleCancel}>
              Annuler
            </button>
          </>
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => setEditing(true)}>
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientSummary;