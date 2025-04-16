import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";

const PatientDiagnosis = ({ motif, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [diagnostic, setDiagnostic] = useState(motif?.diagnostic || "");

  useEffect(() => {
    setDiagnostic(motif?.diagnostic || "");
  }, [motif]);

  const handleSave = async () => {
    if (!motif) return;

    try {
      await updateMotif({ ...motif, diagnostic });
      setEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du diagnostic :", error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDiagnostic(motif?.diagnostic || "");
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Boutons d'action en haut à droite */}
      <div className="flex justify-end mb-4">
        {editing ? (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2"
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
          </>
        ) : (
          <button
            className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setEditing(true)}
          >
            Modifier
          </button>
        )}
      </div>

      {/* Éditeur avec style d'origine (bordure et padding) */}
      <div className="border rounded-lg p-2 flex-grow overflow-y-auto custom-scrollbar">
        <QuillEditor
          value={diagnostic}
          onChange={setDiagnostic}
          readOnly={!editing}
        />
      </div>
    </div>
  );
};

export default PatientDiagnosis;
