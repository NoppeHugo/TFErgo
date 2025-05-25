import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import Toast, { showSuccessToast, showErrorToast } from "../../common/Toast.js";

const PatientSituation = ({ motif, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [newSituation, setNewSituation] = useState({
    personne: motif?.situation?.personne || "",
    occupation: motif?.situation?.occupation || "",
    environnement: motif?.situation?.environnement || "",
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setNewSituation({
      personne: motif?.situation?.personne || "",
      occupation: motif?.situation?.occupation || "",
      environnement: motif?.situation?.environnement || "",
    });
  }, [motif]);

  const handleInputChange = (field, value) => {
    setNewSituation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateMotif({ ...motif, situation: newSituation });
    setEditing(false);
  };

  useEffect(() => {
    if (editing) {
      const delay = setTimeout(() => {
        if (Object.values(newSituation).some((value, index) => value !== Object.values(motif?.situation || {})[index])) {
          updateMotif({ ...motif, situation: newSituation });
        }
      }, 10000);

      return () => clearTimeout(delay);
    }
  }, [newSituation, editing]);

  const handleCancel = () => {
    setEditing(false);
    setNewSituation({
      personne: motif?.situation?.personne || "",
      occupation: motif?.situation?.occupation || "",
      environnement: motif?.situation?.environnement || "",
    });
  };

  const handleSaveSituation = async () => {
    try {
      await updateMotif({ ...motif, situation: newSituation });
      showSuccessToast(setToast, "Situation modifiée avec succès.");
      setEditing(false);
    } catch (error) {
      showErrorToast(setToast, "Erreur lors de la modification de la situation.");
    }
  };

  return (
    <div className="relative w-full h-full">
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
      <div className="flex justify-between items-start mb-4">
        {!editing ? (
          <button
            className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg sticky top-4"
            onClick={() => setEditing(true)}
          >
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2 sticky top-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSaveSituation}>
              Enregistrer
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        )}
      </div>

      {["personne", "occupation", "environnement"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 capitalize">{field} :</label>
          <div className="border rounded p-2">
            <QuillEditor
              value={newSituation[field]}
              onChange={(value) => handleInputChange(field, value)}
              readOnly={!editing}
              className="min-h-[150px] max-h-[300px] overflow-y-auto custom-scrollbar"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientSituation;
