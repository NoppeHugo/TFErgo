import React, { useEffect, useState, useCallback, useRef } from "react";
import QuillEditor from "../../QuillEditor.js";
import {
  createLongTermObjective,
  createShortTermObjective,
  updateLongTermObjective,
  deleteLongTermObjective,
  updateShortTermObjective,
  deleteShortTermObjective,
} from "../../../api/objectiveAPI.js";
import API from "../../../api/api.js";
import { showSuccessToast, showErrorToast, showConfirmToast } from "../../common/Toast.js";
import Toast from "../../common/Toast.js";

function DeleteConfirmationToast({ message, onConfirm, onCancel }) {
  return (
    <span>
      {message}
      <button
        className="ml-4 bg-red-600 text-white px-2 py-1 rounded"
        onClick={onConfirm}
      >
        Oui
      </button>
      <button
        className="ml-2 bg-gray-400 text-white px-2 py-1 rounded"
        onClick={onCancel}
      >
        Non
      </button>
    </span>
  );
}

const PatientObjectives = ({ motif }) => {
  const [longObjectives, setLongObjectives] = useState([]);
  const [selectedLongObjective, setSelectedLongObjective] = useState(null);
  const [newLongTitle, setNewLongTitle] = useState("");
  const [showShortTermForm, setShowShortTermForm] = useState(false);
  const [editingShortId, setEditingShortId] = useState(null);
  const [editingLongId, setEditingLongId] = useState(null);
  const [editLongTitle, setEditLongTitle] = useState("");
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const initialShortState = {
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "ouvert",
  };
  const [newShortObjective, setNewShortObjective] = useState(initialShortState);

  const longTitleInputRef = useRef();
  const shortTitleInputRef = useRef();
  const shortStartDateRef = useRef();
  const shortEndDateRef = useRef();

  const validateShort = () => {
    const errors = {};
    if (!newShortObjective.title.trim()) errors.title = "Le titre de l'objectif court terme est obligatoire";
    if (!newShortObjective.startDate) errors.startDate = "Date de début obligatoire";
    if (!newShortObjective.endDate) errors.endDate = "Date de fin obligatoire";
    return errors;
  };

  const fetchObjectives = useCallback(async () => {
    if (!motif?.id) return;
    try {
      const res = await API.get(`/objectives/${motif.id}/objectives`);
      const updatedList = res.data?.longTermObjectives || [];
      setLongObjectives(updatedList);

      // Mise à jour automatique du selected si toujours présent
      const stillExists = updatedList.find((o) => o.id === selectedLongObjective?.id);
      setSelectedLongObjective(stillExists || null);
    } catch (err) {
      console.error("Erreur chargement objectifs", err);
    }
  }, [motif.id, selectedLongObjective?.id]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const handleAddLongTermObjective = async () => {
    if (!newLongTitle.trim()) {
      setFormErrors({ longTitle: "Le titre de l'objectif long terme est obligatoire" });
      if (longTitleInputRef.current) longTitleInputRef.current.focus();
      showErrorToast(setToast, "Le titre de l'objectif long terme est obligatoire");
      return;
    }
    setFormErrors({});
    try {
      await createLongTermObjective(motif.id, {
        title: newLongTitle,
        startDate: new Date().toISOString(),
      });
      setNewLongTitle("");
      fetchObjectives();
      showSuccessToast(setToast, "Objectif long terme ajouté avec succès.");
    } catch (err) {
      console.error("Erreur ajout objectif long terme", err);
      showErrorToast(setToast, "Erreur lors de l'ajout de l'objectif long terme.");
    }
  };

  const handleAddOrEditShortTermObjective = async () => {
    const errors = validateShort();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      if (errors.title && shortTitleInputRef.current) shortTitleInputRef.current.focus();
      else if (errors.startDate && shortStartDateRef.current) shortStartDateRef.current.focus();
      else if (errors.endDate && shortEndDateRef.current) shortEndDateRef.current.focus();
      showErrorToast(setToast, Object.values(errors).join(' '));
      return;
    }
    if (!newShortObjective.title.trim()) {
      showErrorToast(setToast, "Le titre de l'objectif court terme est obligatoire");
      return;
    }
    if (!newShortObjective.startDate || !newShortObjective.endDate) {
      showErrorToast(setToast, "Les dates de début et de fin sont obligatoires pour un objectif court terme");
      return;
    }
    if (!selectedLongObjective) return;
    try {
      if (editingShortId) {
        await updateShortTermObjective(editingShortId, newShortObjective);
        showSuccessToast(setToast, "Objectif court terme modifié avec succès.");
      } else {
        await createShortTermObjective(selectedLongObjective.id, newShortObjective);
        showSuccessToast(setToast, "Objectif court terme ajouté avec succès.");
      }
      setNewShortObjective(initialShortState);
      setEditingShortId(null);
      setShowShortTermForm(false);
      fetchObjectives();
    } catch (err) {
      console.error("Erreur ajout/modif objectif court terme", err);
      showErrorToast(setToast, "Erreur lors de l'ajout ou de la modification de l'objectif court terme.");
    }
  };

  const handleEditShort = (obj) => {
    setNewShortObjective({
      title: obj.title || "",
      startDate: obj.startDate?.slice(0, 10) || "",
      endDate: obj.endDate?.slice(0, 10) || "",
      description: obj.description || "",
      status: obj.status || "ouvert",
    });
    setEditingShortId(obj.id);
    setShowShortTermForm(true);
  };

  const handleEditLong = (obj) => {
    setEditingLongId(obj.id);
    setEditLongTitle(obj.title);
  };

  const handleUpdateLongTermObjective = async (id) => {
    if (!editLongTitle.trim()) {
      showErrorToast(setToast, "Le titre de l'objectif long terme est obligatoire");
      return;
    }
    try {
      await updateLongTermObjective(id, { title: editLongTitle });
      showSuccessToast(setToast, "Objectif long terme modifié avec succès.");
      setEditingLongId(null);
      setEditLongTitle("");
      fetchObjectives();
    } catch (err) {
      showErrorToast(setToast, "Erreur lors de la modification de l'objectif long terme.");
    }
  };

  const handleDeleteShort = (id) => {
    showConfirmToast(
      setToast,
      <DeleteConfirmationToast
        message="Voulez-vous vraiment supprimer cet objectif court terme ?"
        onConfirm={async () => {
          try {
            await deleteShortTermObjective(id);
            fetchObjectives();
            showSuccessToast(setToast, "Objectif court terme supprimé avec succès.");
          } catch (err) {
            console.error("Erreur suppression objectif court terme", err);
            showErrorToast(setToast, "Erreur lors de la suppression de l'objectif court terme.");
          }
        }}
        onCancel={() => setToast(null)}
      />
    );
  };

  const handleDeleteLong = (id) => {
    showConfirmToast(
      setToast,
      <DeleteConfirmationToast
        message="Voulez-vous vraiment supprimer cet objectif ?"
        onConfirm={async () => {
          try {
            await deleteLongTermObjective(id);
            if (selectedLongObjective?.id === id) {
              setSelectedLongObjective(null);
            }
            fetchObjectives();
            showSuccessToast(setToast, "Objectif long terme supprimé avec succès.");
          } catch (err) {
            console.error("Erreur suppression objectif long terme", err);
            showErrorToast(setToast, "Erreur lors de la suppression de l'objectif long terme.");
          }
        }}
        onCancel={() => setToast(null)}
      />
    );
  };

  const renderShortTermForm = () => (
    <div className="space-y-3">
      <input
        type="text"
        value={newShortObjective.title}
        onChange={(e) => setNewShortObjective((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Titre"
        ref={shortTitleInputRef}
        className={`w-full p-2 border rounded ${formErrors.title ? 'border-red-500' : ''}`}
        aria-invalid={!!formErrors.title}
        aria-describedby={formErrors.title ? 'short-title-error' : undefined}
      />
      {formErrors.title && <div id="short-title-error" className="text-red-600 text-sm mb-2">{formErrors.title}</div>}
      <div className="flex space-x-2">
        <input
          type="date"
          value={newShortObjective.startDate}
          onChange={(e) => setNewShortObjective((prev) => ({ ...prev, startDate: e.target.value }))}
          ref={shortStartDateRef}
          className={`w-1/2 p-2 border rounded ${formErrors.startDate ? 'border-red-500' : ''}`}
          aria-invalid={!!formErrors.startDate}
          aria-describedby={formErrors.startDate ? 'short-startdate-error' : undefined}
        />
        {formErrors.startDate && <div id="short-startdate-error" className="text-red-600 text-sm mb-2">{formErrors.startDate}</div>}
        <input
          type="date"
          value={newShortObjective.endDate}
          onChange={(e) => setNewShortObjective((prev) => ({ ...prev, endDate: e.target.value }))}
          ref={shortEndDateRef}
          className={`w-1/2 p-2 border rounded ${formErrors.endDate ? 'border-red-500' : ''}`}
          aria-invalid={!!formErrors.endDate}
          aria-describedby={formErrors.endDate ? 'short-enddate-error' : undefined}
        />
      </div>
      {formErrors.endDate && <div id="short-enddate-error" className="text-red-600 text-sm mb-2">{formErrors.endDate}</div>}
      <QuillEditor
        value={newShortObjective.description}
        onChange={(val) => setNewShortObjective((prev) => ({ ...prev, description: val }))}
        readOnly={false}
      />
      <select
        value={newShortObjective.status}
        onChange={(e) => setNewShortObjective((prev) => ({ ...prev, status: e.target.value }))}
        className="w-full p-2 border rounded"
      >
        <option value="ouvert">Ouvert</option>
        <option value="fermé">Fermé</option>
      </select>

      <div className="flex justify-end">
        <button
          className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg"
          onClick={handleAddOrEditShortTermObjective}
        >
          {editingShortId ? "Modifier" : "Enregistrer"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full space-x-4">
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
      <div className="w-1/4 h-full bg-gray-100 p-4 rounded-lg shadow flex flex-col overflow-y-auto custom-scrollbar">
        <h4 className="text-lg font-semibold mb-3">Objectifs Long Terme</h4>
        <input
          type="text"
          value={newLongTitle}
          onChange={(e) => setNewLongTitle(e.target.value)}
          placeholder="Titre..."
          ref={longTitleInputRef}
          className={`w-full p-2 border rounded-lg mb-2 ${formErrors.longTitle ? 'border-red-500' : ''}`}
          aria-invalid={!!formErrors.longTitle}
          aria-describedby={formErrors.longTitle ? 'long-title-error' : undefined}
        />
        {formErrors.longTitle && <div id="long-title-error" className="text-red-600 text-sm mb-2">{formErrors.longTitle}</div>}
        <button
          className="bg-dark2GreenErgogo text-white px-4 py-2 rounded-lg w-full mb-4"
          onClick={handleAddLongTermObjective}
        >
          Ajouter
        </button>

        <ul className="space-y-2">
          {longObjectives.map((obj) => (
            <li
              key={obj.id}
              className={`group cursor-pointer p-2 rounded-lg text-sm flex justify-between items-center ${
                selectedLongObjective?.id === obj.id
                  ? "bg-middleBlueErgogo text-white"
                  : "bg-gray-200"
              }`}
            >
              {editingLongId === obj.id ? (
                <div className="flex w-full">
                  <input
                    type="text"
                    value={editLongTitle}
                    onChange={(e) => setEditLongTitle(e.target.value)}
                    className="flex-1 p-2 border rounded-l-lg"
                  />
                  <button
                    className="bg-green-500 text-white px-3 rounded-r-lg"
                    onClick={() => handleUpdateLongTermObjective(obj.id)}
                  >
                    ✔️
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 rounded-r-lg ml-2"
                    onClick={() => setEditingLongId(null)}
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <span onClick={() => setSelectedLongObjective(obj)}>{obj.title}</span>
              )}
              <div className="space-x-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="text-yellow-500 hover:text-yellow-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditLong(obj);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLong(obj.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 h-full bg-white p-4 rounded-lg shadow flex flex-col overflow-y-auto custom-scrollbar">
        {selectedLongObjective ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Objectifs Court Terme pour "{selectedLongObjective.title}"
              </h4>
              <button
                className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowShortTermForm(!showShortTermForm);
                  setEditingShortId(null);
                  setNewShortObjective(initialShortState);
                }}
              >
                {showShortTermForm ? "Annuler" : "Ajouter"}
              </button>
            </div>

            <ul className="space-y-3 mb-6">
              {selectedLongObjective.shortTermObjectives?.map((obj) => (
                <li key={obj.id} className="p-3 bg-gray-100 rounded shadow-sm relative group">
                  <div className="font-semibold">{obj.title}</div>
                  <div className="text-sm text-gray-600">
                    {obj.status} | Du {obj.startDate?.slice(0, 10)} au {obj.endDate?.slice(0, 10) || "…"}
                  </div>
                  {obj.description?.trim() && (
                    <div
                      className="mt-2 text-sm prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: obj.description.includes("<") ? obj.description : `<p>${obj.description}</p>` }}
                    />
                  )}
                  <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => handleEditShort(obj)}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteShort(obj.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {showShortTermForm && renderShortTermForm()}
          </>
        ) : (
          <p className="text-gray-500 text-center my-auto">Sélectionnez un objectif long terme.</p>
        )}
      </div>
    </div>
  );
};

export default PatientObjectives;
