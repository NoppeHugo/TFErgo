import React, { useState } from "react";
import QuillEditor from "../../QuillEditor.js";

const PatientObjectives = ({ motif, updateMotif }) => {
  const [selectedLongTermObjective, setSelectedLongTermObjective] = useState(null);
  const [newLongTermObjective, setNewLongTermObjective] = useState({
    titre: "",
  });
  const [newShortTermObjective, setNewShortTermObjective] = useState({
    titre: "",
    dateDebut: "",
    dateFin: "",
    description: "",
    statut: "ouvert",
  });
  const [showShortTermForm, setShowShortTermForm] = useState(false);
  const [editingLongTermObjective, setEditingLongTermObjective] = useState(null);
  const [editingShortTermObjective, setEditingShortTermObjective] = useState(null);

  const handleSelectLongTermObjective = (objective) => {
    setSelectedLongTermObjective(objective);
    setShowShortTermForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShortTermObjective((prev) => ({ ...prev, [name]: value }));
  };

  const handleLongTermInputChange = (e) => {
    const { name, value } = e.target;
    setNewLongTermObjective((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveShortTermObjective = async () => {
    if (!selectedLongTermObjective) return;

    const updatedMotif = {
      ...motif,
      objectifsCourtTerme: [
        ...(motif.objectifsCourtTerme || []),
        {
          ...newShortTermObjective,
          longTermObjectiveId: selectedLongTermObjective.id,
        },
      ],
    };

    try {
      await updateMotif(updatedMotif);
      setNewShortTermObjective({
        titre: "",
        dateDebut: "",
        dateFin: "",
        description: "",
        statut: "ouvert",
      });
      setShowShortTermForm(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'objectif à court terme :", error);
    }
  };

  const handleSaveLongTermObjective = async () => {
    if (!newLongTermObjective.titre.trim()) return;

    const updatedMotif = {
      ...motif,
      objectifsLongTerme: [
        ...(motif.objectifsLongTerme || []),
        {
          ...newLongTermObjective,
          id: Date.now().toString(), // Générer un ID unique pour l'objectif à long terme
        },
      ],
    };

    try {
      await updateMotif(updatedMotif);
      setNewLongTermObjective({ titre: "" });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'objectif à long terme :", error);
    }
  };

  const handleEditLongTermObjective = (objective) => {
    setEditingLongTermObjective(objective);
    setNewLongTermObjective({ titre: objective.titre });
  };

  const handleSaveEditLongTermObjective = async () => {
    const updatedMotif = {
      ...motif,
      objectifsLongTerme: motif.objectifsLongTerme.map((obj) =>
        obj.id === editingLongTermObjective.id ? { ...obj, titre: newLongTermObjective.titre } : obj
      ),
    };

    try {
      await updateMotif(updatedMotif);
      setEditingLongTermObjective(null);
      setNewLongTermObjective({ titre: "" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif à long terme :", error);
    }
  };

  const handleDeleteLongTermObjective = async (objectiveId) => {
    const updatedMotif = {
      ...motif,
      objectifsLongTerme: motif.objectifsLongTerme.filter((obj) => obj.id !== objectiveId),
      objectifsCourtTerme: motif.objectifsCourtTerme.filter((obj) => obj.longTermObjectiveId !== objectiveId),
    };

    try {
      await updateMotif(updatedMotif);
      setSelectedLongTermObjective(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif à long terme :", error);
    }
  };

  const handleEditShortTermObjective = (objective) => {
    setEditingShortTermObjective(objective);
    setNewShortTermObjective({
      titre: objective.titre,
      dateDebut: objective.dateDebut,
      dateFin: objective.dateFin,
      description: objective.description,
      statut: objective.statut,
    });
    setShowShortTermForm(true);
  };

  const handleSaveEditShortTermObjective = async () => {
    const updatedMotif = {
      ...motif,
      objectifsCourtTerme: motif.objectifsCourtTerme.map((obj) =>
        obj === editingShortTermObjective ? { ...newShortTermObjective, longTermObjectiveId: selectedLongTermObjective.id } : obj
      ),
    };

    try {
      await updateMotif(updatedMotif);
      setEditingShortTermObjective(null);
      setNewShortTermObjective({
        titre: "",
        dateDebut: "",
        dateFin: "",
        description: "",
        statut: "ouvert",
      });
      setShowShortTermForm(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif à court terme :", error);
    }
  };

  const handleDeleteShortTermObjective = async (objective) => {
    const updatedMotif = {
      ...motif,
      objectifsCourtTerme: motif.objectifsCourtTerme.filter((obj) => obj !== objective),
    };

    try {
      await updateMotif(updatedMotif);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif à court terme :", error);
    }
  };

  return (
    <div className="flex space-x-4">
      {/* Liste des objectifs à long terme */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-3">Objectifs Long Terme</h4>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Titre de l'objectif à long terme"
            value={newLongTermObjective.titre}
            onChange={handleLongTermInputChange}
            name="titre"
            className="w-full p-2 border rounded-lg mb-2"
          />
          {editingLongTermObjective ? (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleSaveEditLongTermObjective}
              >
                Enregistrer
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ml-2"
                onClick={() => setEditingLongTermObjective(null)}
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSaveLongTermObjective}
            >
              Ajouter
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {motif.objectifsLongTerme?.map((objective, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedLongTermObjective?.id === objective.id ? "bg-blue-500 text-white" : "bg-gray-200"
              } hover:bg-blue-300`}
              onClick={() => handleSelectLongTermObjective(objective)}
            >
              <div className="flex justify-between items-center">
                <strong>{objective.titre}</strong>
                <div className="flex space-x-2">
                  <button
                    className="text-yellow-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLongTermObjective(objective);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLongTermObjective(objective.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulaire pour créer un objectif à court terme */}
      <div className="w-2/3 bg-white p-4 rounded-lg shadow">
        {selectedLongTermObjective ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Objectifs à Court Terme pour "{selectedLongTermObjective.titre}"</h4>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  setShowShortTermForm(true);
                  setEditingShortTermObjective(null);
                  setNewShortTermObjective({
                    titre: "",
                    dateDebut: "",
                    dateFin: "",
                    description: "",
                    statut: "ouvert",
                  });
                }}
              >
                Ajouter
              </button>
            </div>
            {showShortTermForm ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Titre :</label>
                  <input
                    type="text"
                    name="titre"
                    value={newShortTermObjective.titre}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date Début :</label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={newShortTermObjective.dateDebut}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date Fin :</label>
                  <input
                    type="date"
                    name="dateFin"
                    value={newShortTermObjective.dateFin}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description :</label>
                  <QuillEditor
                    value={newShortTermObjective.description}
                    onChange={(value) => handleInputChange({ target: { name: "description", value } })}
                    readOnly={false}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Statut :</label>
                  <select
                    name="statut"
                    value={newShortTermObjective.statut}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="ouvert">Ouvert</option>
                    <option value="fermé">Fermé</option>
                  </select>
                </div>
                {editingShortTermObjective ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      onClick={handleSaveEditShortTermObjective}
                    >
                      Enregistrer
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ml-2"
                      onClick={() => {
                        setEditingShortTermObjective(null);
                        setShowShortTermForm(false);
                      }}
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    onClick={handleSaveShortTermObjective}
                  >
                    Enregistrer
                  </button>
                )}
              </>
            ) : (
              <ul className="space-y-2">
                {motif.objectifsCourtTerme
                  ?.filter((obj) => obj.longTermObjectiveId === selectedLongTermObjective.id)
                  .map((objective, index) => (
                    <li key={index} className="p-2 rounded-lg bg-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <strong>{objective.titre}</strong>
                          <p>Date Début: {objective.dateDebut}</p>
                          <p>Date Fin: {objective.dateFin}</p>
                          <p>Description: <span dangerouslySetInnerHTML={{ __html: objective.description }} /></p>
                          <p>Statut: {objective.statut}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-yellow-500 hover:underline"
                            onClick={() => handleEditShortTermObjective(objective)}
                          >
                            ✏️
                          </button>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDeleteShortTermObjective(objective)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-gray-500">Sélectionnez un objectif à long terme pour créer un objectif à court terme.</p>
        )}
      </div>
    </div>
  );
};

export default PatientObjectives;