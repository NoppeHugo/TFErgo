import React, { useState, useEffect } from "react";

const PatientSituation = ({ motif, patientId, updateMotif }) => {
  const [editing, setEditing] = useState(false);
  const [newSituation, setNewSituation] = useState({
    personne: motif?.situationPersonnelle?.personne || "",
    occupation: motif?.situationPersonnelle?.occupation || "",
    environnement: motif?.situationPersonnelle?.environnement || "",
  });

  useEffect(() => {
    console.log("🟢 Récupération des données du motif :", motif);
    setNewSituation({
      personne: motif?.situationPersonnelle?.personne || "",
      occupation: motif?.situationPersonnelle?.occupation || "",
      environnement: motif?.situationPersonnelle?.environnement || "",
    });
  }, [motif]);

  // 🟢 Active le mode édition et charge les valeurs actuelles
  const handleEdit = () => {
    setEditing(true);
  };

  // 🟢 Annule l'édition et remet les valeurs initiales
  const handleCancel = () => {
    setEditing(false);
    setNewSituation({
      personne: motif?.situationPersonnelle?.personne || "",
      occupation: motif?.situationPersonnelle?.occupation || "",
      environnement: motif?.situationPersonnelle?.environnement || "",
    });
  };

  // 🟢 Met à jour localement les valeurs pendant la saisie
  const handleInputChange = (field, value) => {
    setNewSituation((prev) => ({ ...prev, [field]: value }));
  };

  // 🟢 Sauvegarde en Firestore
  const handleSave = async () => {
    if (!motif || !patientId) return;

    const updatedMotif = {
      ...motif,
      situationPersonnelle: {
        personne: newSituation.personne,
        occupation: newSituation.occupation,
        environnement: newSituation.environnement,
      },
    };

    console.log("🟢 Tentative de mise à jour du motif :", updatedMotif);

    try {
      await updateMotif(updatedMotif);
      console.log("✅ Motif mis à jour avec succès !");
      setEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du motif :", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h4 className="text-lg font-semibold mb-4">Situation Personnelle</h4>

      {/* ✅ Éditeur pour "Personne" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Personne :</label>
        <textarea
          value={newSituation.personne}
          onChange={(e) => handleInputChange("personne", e.target.value)}
          readOnly={!editing}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* ✅ Éditeur pour "Occupation" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Occupation :</label>
        <textarea
          value={newSituation.occupation}
          onChange={(e) => handleInputChange("occupation", e.target.value)}
          readOnly={!editing}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* ✅ Éditeur pour "Environnement" */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Environnement :</label>
        <textarea
          value={newSituation.environnement}
          onChange={(e) => handleInputChange("environnement", e.target.value)}
          readOnly={!editing}
          className="w-full p-2 border rounded-lg"
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