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
    await updateMotif({ ...motif, therapeutic: therapeuticData });
    setEditing(false);
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
    <div className="relative p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-start mb-4">
        {!editing ? (
          <button className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg sticky top-4" onClick={() => setEditing(true)}>
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2 sticky top-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        )}
      </div>

      {[
        { label: "Batteries Code CIF", field: "assesments" },
        { label: "Synthèse de l'évaluation", field: "syntheseEvaluation" },
        { label: "Restrictions de participation", field: "restrictionsSouhaits" },
        { label: "Diagnostic occupationnel", field: "diagnosticOccupationnel" },
      ].map(({ label, field }) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{label} :</label>
          <div className="border rounded p-2">
            <QuillEditor
              value={therapeuticData[field]}
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

export default PatientTherapeutic;
