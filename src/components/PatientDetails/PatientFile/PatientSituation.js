import React, { useState, useEffect } from "react";
import QuillEditor from "../../QuillEditor.js";
import { updateMotifIntervention } from "../../../firebase/patientsFirestore.js"; // 🔹 Vérifie que cet import est correct

const PatientSituation = ({ motif, patientId }) => {
  const [editing, setEditing] = useState(false);
  const [newSituation, setNewSituation] = useState({
    personne: motif?.situationPersonnelle?.personne || "",
    occupation: motif?.situationPersonnelle?.occupation || "",
    environnement: motif?.situationPersonnelle?.environnement || "",
  });

  useEffect(() => {
    setNewSituation({
      personne: motif?.situationPersonnelle?.personne || "",
      occupation: motif?.situationPersonnelle?.occupation || "",
      environnement: motif?.situationPersonnelle?.environnement || "",
    });
  }, [motif]);

  // ✅ Active le mode édition
  const handleEdit = () => {
    setEditing(true);
  };

  // ❌ Annule l'édition et restaure les valeurs initiales
  const handleCancel = () => {
    setEditing(false);
    setNewSituation({
      personne: motif?.situationPersonnelle?.personne || "",
      occupation: motif?.situationPersonnelle?.occupation || "",
      environnement: motif?.situationPersonnelle?.environnement || "",
    });
  };

  // ✏️ Met à jour localement les valeurs pendant la saisie
  const handleInputChange = (field, value) => {
    setNewSituation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!motif || !patientId) {
      console.error("❌ patientId ou motif est undefined !");
      return;
    }
  
    const updatedMotif = {
      ...motif,
      situationPersonnelle: {
        personne: newSituation.personne || "",
        occupation: newSituation.occupation || "",
        environnement: newSituation.environnement || "",
      },
    };
  
    console.log("📤 Tentative d'enregistrement :", patientId, motif.id, updatedMotif);
  
    try {
      const success = await updateMotifIntervention(patientId, motif.id, updatedMotif);
  
      if (success) {
        console.log("✅ Mise à jour réussie !");
        
        // 🛑 Ajout : Mise à jour du `state` pour rafraîchir immédiatement l'affichage
        setNewSituation(updatedMotif.situationPersonnelle);
        
        // 🛑 Ajout : Mise à jour du motif actuel
        motif.situationPersonnelle = updatedMotif.situationPersonnelle;
  
        setEditing(false);
      } else {
        console.error("❌ Mise à jour échouée.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Situation Personnelle</h4>

      {/* ✅ Éditeur pour "Personne" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Personne :</label>
        <QuillEditor
          value={newSituation.personne}
          onChange={(value) => handleInputChange("personne", value)}
          readOnly={!editing}
        />
      </div>

      {/* ✅ Éditeur pour "Occupation" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Occupation :</label>
        <QuillEditor
          value={newSituation.occupation}
          onChange={(value) => handleInputChange("occupation", value)}
          readOnly={!editing}
        />
      </div>

      {/* ✅ Éditeur pour "Environnement" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Environnement :</label>
        <QuillEditor
          value={newSituation.environnement}
          onChange={(value) => handleInputChange("environnement", value)}
          readOnly={!editing}
        />
      </div>

      {/* ✅ Boutons Modifier / Enregistrer / Annuler */}
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

export default PatientSituation;
