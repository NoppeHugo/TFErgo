import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";

const PatientSituation = ({ motif, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [newSituation, setNewSituation] = useState({
    personne: motif?.situation?.personne || "",
    occupation: motif?.situation?.occupation || "",
    environnement: motif?.situation?.environnement || "",
  });

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
    const updated = {
      ...motif,
      situation: newSituation,
    };
    await updateMotif(updated);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setNewSituation({
      personne: motif?.situation?.personne || "",
      occupation: motif?.situation?.occupation || "",
      environnement: motif?.situation?.environnement || "",
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Situation Personnelle</h4>

      {["personne", "occupation", "environnement"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 capitalize">{field} :</label>
          <QuillEditor
            value={newSituation[field]}
            onChange={(value) => handleInputChange(field, value)}
            readOnly={!editing}
          />
        </div>
      ))}

      <div className="flex space-x-2">
        {!editing ? (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setEditing(true)}>Modifier</button>
        ) : (
          <>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSave}>Enregistrer</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>Annuler</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientSituation;
