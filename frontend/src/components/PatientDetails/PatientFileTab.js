import React, { useEffect, useState } from "react";
import { getMotifsByPatient, createMotif, updateMotif, deleteMotif } from "../../api/motifAPI.js";
import PatientSituation from "./PatientFile/PatientSituation.js";
import PatientTherapeutic from "./PatientFile/PatientTherapeutic.js";
import PatientObjectives from "./PatientFile/PatientObjectives.js";
import PatientDiagnosis from "./PatientFile/PatientDiagnosis.js";
import PatientInterventions from "./PatientFile/PatientInterventions.js";
import PatientSummary from "./PatientFile/PatientSummary.js";
import Toast, { showErrorToast, showSuccessToast, showConfirmToast } from "../common/Toast.js";

function DeleteConfirmationToast({ motifTitle, onConfirm, onCancel }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2">Voulez-vous vraiment supprimer le motif <strong>{motifTitle}</strong> ?</span>
      <div className="flex gap-2 mt-2">
        <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={onConfirm}>Supprimer</button>
        <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}

const PatientFileTab = ({ patient }) => {
  const [motifs, setMotifs] = useState([]);
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("situation");
  const [newMotif, setNewMotif] = useState({
    title: "",
    groupeCible: "",
    age: "",
    batteriesCodeCIF: "",
  });
  const [toast, setToast] = useState(null);
  const [editingMotifId, setEditingMotifId] = useState(null);
  const [editingMotifTitle, setEditingMotifTitle] = useState("");

  useEffect(() => {
    if (!patient?.id) return;

    const fetchMotifs = async () => {
      const motifsList = await getMotifsByPatient(patient.id);
      setMotifs(motifsList);
    };

    fetchMotifs();
  }, [patient?.id]);

  const handleCreateMotif = async () => {
    if (!newMotif.title.trim()) {
      showErrorToast(setToast, "Le titre du motif est obligatoire");
      return;
    }

    const addedMotif = await createMotif(patient.id, {
      ...newMotif,
      therapeutic: {
        assesments: "",
        syntheseEvaluation: "",
        restrictionsSouhaits: "",
      },
    });

    if (addedMotif) {
      setMotifs([...motifs, addedMotif]);
      setNewMotif({ title: "", groupeCible: "", age: "", batteriesCodeCIF: "" });
      setSelectedMotif({
        ...addedMotif,
        therapeutic: addedMotif.therapeutic || {
          assesments: "",
          syntheseEvaluation: "",
          restrictionsSouhaits: "",
        },
      });
      showSuccessToast(setToast, "Motif créé avec succès");
    }
  };

  const handleSelectMotif = (motif) => {
    setSelectedMotif({
      ...motif,
      therapeutic: motif.therapeutic || {
        assesments: "",
        syntheseEvaluation: "",
        restrictionsSouhaits: "",
      },
    });
  };

  const handleUpdateMotifData = async (updatedMotif) => {
    if (!selectedMotif) return;
    try {
      await updateMotif(selectedMotif.id, updatedMotif);
      setMotifs((prevMotifs) =>
        prevMotifs.map((m) => (m.id === selectedMotif.id ? updatedMotif : m))
      );
      setSelectedMotif(updatedMotif);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du motif :", error);
    }
  };

  const handleDeleteMotif = (motif) => {
    showConfirmToast(
      setToast,
      <DeleteConfirmationToast
        motifTitle={motif.title}
        onConfirm={async () => {
          try {
            await deleteMotif(motif.id);
            setMotifs((prev) => prev.filter((m) => m.id !== motif.id));
            if (selectedMotif?.id === motif.id) setSelectedMotif(null);
            setToast(null);
            showSuccessToast(setToast, "Motif supprimé avec succès");
          } catch (error) {
            setToast(null);
            showErrorToast(setToast, "Erreur lors de la suppression du motif");
          }
        }}
        onCancel={() => setToast(null)}
      />
    );
  };

  const handleEditMotif = (motif) => {
    setEditingMotifId(motif.id);
    setEditingMotifTitle(motif.title);
  };

  const handleSaveEditMotif = async (motif) => {
    if (!editingMotifTitle.trim()) {
      showErrorToast(setToast, "Le titre du motif est obligatoire");
      return;
    }
    try {
      const updated = await updateMotif(motif.id, { ...motif, title: editingMotifTitle });
      setMotifs((prev) => prev.map((m) => (m.id === motif.id ? { ...m, title: editingMotifTitle } : m)));
      if (selectedMotif?.id === motif.id) setSelectedMotif({ ...selectedMotif, title: editingMotifTitle });
      setEditingMotifId(null);
      setEditingMotifTitle("");
      showSuccessToast(setToast, "Motif modifié avec succès");
    } catch (error) {
      showErrorToast(setToast, "Erreur lors de la modification du motif");
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-120px)] space-x-4">
      {/* Colonne gauche : liste des motifs */}
      <div className="w-1/5 bg-gray-100 p-4 rounded-lg shadow flex flex-col overflow-y-auto custom-scrollbar">
        <h4 className="text-lg font-semibold mb-3">Motifs d’intervention</h4>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Motif d'intervention"
            value={newMotif.title}
            onChange={(e) => setNewMotif({ ...newMotif, title: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <button
            className="bg-dark2GreenErgogo text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
            onClick={handleCreateMotif}
          >
            Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {motifs.map((motif, index) => (
            <li
              key={motif.id || index}
              className={`cursor-pointer p-2 rounded-lg text-sm flex items-center justify-between gap-2 ${
                selectedMotif?.id === motif.id
                  ? "bg-middleBlueErgogo text-white"
                  : "bg-gray-200 hover:bg-blue-300"
              }`}
            >
              {editingMotifId === motif.id ? (
                <>
                  <input
                    className="flex-1 p-1 rounded border text-black"
                    value={editingMotifTitle}
                    onChange={e => setEditingMotifTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleSaveEditMotif(motif);
                      if (e.key === "Escape") { setEditingMotifId(null); setEditingMotifTitle(""); }
                    }}
                    autoFocus
                  />
                  <button className="text-green-600 font-bold ml-1" title="Enregistrer" onClick={() => handleSaveEditMotif(motif)}>✔️</button>
                  <button className="text-gray-500 ml-1" title="Annuler" onClick={() => { setEditingMotifId(null); setEditingMotifTitle(""); }}>✖️</button>
                </>
              ) : (
                <>
                  <div className="flex-1" onClick={() => handleSelectMotif(motif)}>
                    <strong>{motif.title}</strong>
                    <p className="text-xs">Groupe: {motif.groupeCible} | Âge: {motif.age}</p>
                    <p className="text-xs">Batteries: {motif.batteriesCodeCIF}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button className="text-yellow-600 hover:underline" title="Modifier" onClick={() => handleEditMotif(motif)}>✏️</button>
                    <button className="text-red-600 hover:underline" title="Supprimer" onClick={() => handleDeleteMotif(motif)}>🗑️</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite : contenu du motif */}
      <div className="w-4/5 flex flex-col h-full overflow-hidden">
        {selectedMotif ? (
          <>
            {/* Onglets */}
            <div className="flex space-x-2 mb-4 shrink-0">
              {["situation", "therapeutic", "objectives", "diagnosis", "interventions", "summary"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition ${
                    activeSubTab === tab
                      ? "bg-middleBlueErgogo text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveSubTab(tab)}
                >
                  {tab === "situation" && "Situation Personnelle"}
                  {tab === "therapeutic" && "Perspective Thérapeutique"}
                  {tab === "objectives" && "Objectifs"}
                  {tab === "diagnosis" && "Diagnostic"}
                  {tab === "interventions" && "Compte Rendu"}
                  {tab === "summary" && "Synthèse"}
                </button>
              ))}
            </div>

            {/* Contenu scrollable */}
            <div className="flex-grow overflow-y-auto px-1 pb-4 custom-scrollbar">
              {activeSubTab === "situation" && (
                <PatientSituation motif={selectedMotif} updateMotif={handleUpdateMotifData} />
              )}
              {activeSubTab === "therapeutic" && (
                <PatientTherapeutic motif={selectedMotif} patientId={patient?.id} updateMotif={handleUpdateMotifData} />
              )}
              {activeSubTab === "objectives" && (
                <PatientObjectives motif={selectedMotif} updateMotif={handleUpdateMotifData} />
              )}
              {activeSubTab === "diagnosis" && (
                <PatientDiagnosis motif={selectedMotif} updateMotif={handleUpdateMotifData} />
              )}
              {activeSubTab === "interventions" && (
                <PatientInterventions motif={selectedMotif} updateMotif={handleUpdateMotifData} />
              )}
              {activeSubTab === "summary" && (
                <PatientSummary motif={selectedMotif} updateMotif={handleUpdateMotifData} />
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center my-auto">Sélectionnez un motif d’intervention.</p>
        )}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
    </div>
  );
};

export default PatientFileTab;