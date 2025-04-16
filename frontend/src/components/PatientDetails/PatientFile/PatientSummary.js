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
    try {
      await updateMotif({ ...motif, synthese });
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
    <div className="relative flex flex-col p-4 bg-white shadow-md rounded-lg h-full max-h-[calc(100vh-150px)] overflow-hidden">
      {/* Titre + Bouton Modifier sticky en haut */}
      <div className="flex justify-between items-start mb-4 sticky top-0 bg-white z-10 pb-2">
        {!editing ? (
          <button
            className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg"
            onClick={() => setEditing(true)}
          >
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSave}
            >
              Enregistrer
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={handleCancel}
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* ✅ Scroll uniquement ici */}
      <div className="border rounded-lg p-2 grow overflow-y-auto custom-scrollbar">
        <QuillEditor
          value={synthese}
          onChange={setSynthese}
          readOnly={!editing}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default PatientSummary;
