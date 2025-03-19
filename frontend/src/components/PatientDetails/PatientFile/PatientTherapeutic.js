import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import { updateMotifIntervention } from "../../../firebase/patientsFirestore.js";

const PatientTherapeutic = ({ motif, patientId, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [therapeuticData, setTherapeuticData] = useState({
    assesments: motif?.perspectiveTherapeutique?.assesments || "",
    syntheseEvaluation: motif?.perspectiveTherapeutique?.syntheseEvaluation || "",
    restrictionsSouhaits: motif?.perspectiveTherapeutique?.restrictionsSouhaits || "",
    diagnosticOccupationnel: motif?.perspectiveTherapeutique?.diagnosticOccupationnel || "",
  });

  useEffect(() => {
    setTherapeuticData({
      assesments: motif?.perspectiveTherapeutique?.assesments || "",
      syntheseEvaluation: motif?.perspectiveTherapeutique?.syntheseEvaluation || "",
      restrictionsSouhaits: motif?.perspectiveTherapeutique?.restrictionsSouhaits || "",
      diagnosticOccupationnel: motif?.perspectiveTherapeutique?.diagnosticOccupationnel || "",
    });
  }, [motif]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setTherapeuticData({
      assesments: motif?.perspectiveTherapeutique?.assesments || "",
      syntheseEvaluation: motif?.perspectiveTherapeutique?.syntheseEvaluation || "",
      restrictionsSouhaits: motif?.perspectiveTherapeutique?.restrictionsSouhaits || "",
      diagnosticOccupationnel: motif?.perspectiveTherapeutique?.diagnosticOccupationnel || "",
    });
  };

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
      perspectiveTherapeutique: {
        assesments: therapeuticData.assesments || "",
        syntheseEvaluation: therapeuticData.syntheseEvaluation || "",
        restrictionsSouhaits: therapeuticData.restrictionsSouhaits || "",
        diagnosticOccupationnel: therapeuticData.diagnosticOccupationnel || "",
      },
    };

    console.log("📤 Sauvegarde des données thérapeutiques :", patientId, updatedMotif);

    try {
      await updateMotifIntervention(patientId, motif.id, updatedMotif);
      console.log("✅ Mise à jour réussie !");
      setEditing(false);
      updateMotif(updatedMotif); // Update the parent component's state
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Perspective Thérapeutique</h4>

      <div className="mb-4 p-3 border border-gray-300 bg-gray-100 rounded-lg">
        <h5 className="text-md font-semibold text-gray-700">Batteries Code CIF</h5>
        <p className="text-gray-600">{therapeuticData.assesments || "Non défini"}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Synthèse de l'évaluation :</label>
        <QuillEditor
          value={therapeuticData.syntheseEvaluation}
          onChange={(value) => handleInputChange("syntheseEvaluation", value)}
          readOnly={!editing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Restrictions de participation :</label>
        <QuillEditor
          value={therapeuticData.restrictionsSouhaits}
          onChange={(value) => handleInputChange("restrictionsSouhaits", value)}
          readOnly={!editing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Diagnostic Occupationnel :</label>
        <QuillEditor
          value={therapeuticData.diagnosticOccupationnel}
          onChange={(value) => handleInputChange("diagnosticOccupationnel", value)}
          readOnly={!editing}
        />
      </div>

      <div className="flex space-x-2">
        {!editing ? (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleEdit}>
            Modifier
          </button>
        ) : (
          <>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={handleCancel}>
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientTherapeutic;