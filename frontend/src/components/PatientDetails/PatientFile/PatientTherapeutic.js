import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";

const PatientTherapeutic = ({ motif, patientId, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [therapeuticData, setTherapeuticData] = useState({
    assesments: motif?.therapeutic?.assesments || "",
    syntheseEvaluation: motif?.therapeutic?.syntheseEvaluation || "",
    restrictionsSouhaits: motif?.therapeutic?.restrictionsSouhaits || "",
    diagnosticOccupationnel: motif?.therapeutic?.diagnosticOccupationnel || "",
  });

  useEffect(() => {
    setTherapeuticData({
      assesments: motif?.therapeutic?.assesments || "",
      syntheseEvaluation: motif?.therapeutic?.syntheseEvaluation || "",
      restrictionsSouhaits: motif?.therapeutic?.restrictionsSouhaits || "",
      diagnosticOccupationnel: motif?.therapeutic?.diagnosticOccupationnel || "",
    });
  }, [motif]);

  const handleInputChange = (field, value) => {
    setTherapeuticData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!motif || !patientId) {
      console.error("❌ patientId ou motif est undefined !");
      return;
    }

    const updatedMotif = {
      ...motif,
      therapeutic: {
        assesments: therapeuticData.assesments || "",
        syntheseEvaluation: therapeuticData.syntheseEvaluation || "",
        restrictionsSouhaits: therapeuticData.restrictionsSouhaits || "",
        diagnosticOccupationnel: therapeuticData.diagnosticOccupationnel || "",
      },
    };

    try {
      await updateMotif(updatedMotif);
      setEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setTherapeuticData({
      assesments: motif?.therapeutic?.assesments || "",
      syntheseEvaluation: motif?.therapeutic?.syntheseEvaluation || "",
      restrictionsSouhaits: motif?.therapeutic?.restrictionsSouhaits || "",
      diagnosticOccupationnel: motif?.therapeutic?.diagnosticOccupationnel || "",
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Perspective Thérapeutique</h4>

      {[
        { label: "Batteries Code CIF", field: "assesments" },
        { label: "Synthèse de l'évaluation", field: "syntheseEvaluation" },
        { label: "Restrictions de participation", field: "restrictionsSouhaits" },
        { label: "Diagnostic occupationnel", field: "diagnosticOccupationnel" },
      ].map(({ label, field }) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{label} :</label>
          <QuillEditor
            value={therapeuticData[field]}
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

export default PatientTherapeutic;
