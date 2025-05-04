import React, { useEffect, useState } from "react";
import QuillEditor from "../../QuillEditor.js";
import { createLongTermObjective, createShortTermObjective } from "../../../api/objectiveAPI.js";
import API from "../../../api/api.js";


const PatientObjectives = ({ motif }) => {
  const [longObjectives, setLongObjectives] = useState([]);
  const [selectedLongObjective, setSelectedLongObjective] = useState(null);

  const [newLongTitle, setNewLongTitle] = useState("");
  const [newShortObjective, setNewShortObjective] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "ouvert",
  });

  const [showShortTermForm, setShowShortTermForm] = useState(false);

  const fetchObjectives = async () => {
    try {
      const res = await API.get(`/objectives/${motif.id}/objectives`);
      const data = res.data;

      setLongObjectives(data?.longTermObjectives || []);
    } catch (err) {
      console.error("Erreur chargement objectifs", err);
    }
  };

  useEffect(() => {
    if (motif?.id) fetchObjectives();
  }, [motif]);

  const handleAddLongTermObjective = async () => {
    if (!newLongTitle.trim()) return;
    try {
      await createLongTermObjective(motif.id, {
        title: newLongTitle,
        startDate: new Date().toISOString(),
      });
      setNewLongTitle("");
      fetchObjectives();
    } catch (err) {
      console.error("Erreur ajout objectif long terme", err);
    }
  };

  const handleAddShortTermObjective = async () => {
    if (!selectedLongObjective) return;
    try {
      await createShortTermObjective(selectedLongObjective.id, newShortObjective);
      setNewShortObjective({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        status: "ouvert",
      });
      setShowShortTermForm(false);
      fetchObjectives();
    } catch (err) {
      console.error("Erreur ajout objectif court terme", err);
    }
  };

  const renderShortTermForm = () => (
    <div className="space-y-3">
      <input
        type="text"
        name="title"
        value={newShortObjective.title}
        onChange={(e) => setNewShortObjective({ ...newShortObjective, title: e.target.value })}
        placeholder="Titre"
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-2">
        <input
          type="date"
          name="startDate"
          value={newShortObjective.startDate}
          onChange={(e) => setNewShortObjective({ ...newShortObjective, startDate: e.target.value })}
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={newShortObjective.endDate}
          onChange={(e) => setNewShortObjective({ ...newShortObjective, endDate: e.target.value })}
          className="w-1/2 p-2 border rounded"
        />
      </div>
      <QuillEditor
        value={newShortObjective.description}
        onChange={(value) => setNewShortObjective({ ...newShortObjective, description: value })}
        readOnly={false}
      />
      <select
        name="status"
        value={newShortObjective.status}
        onChange={(e) => setNewShortObjective({ ...newShortObjective, status: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="ouvert">Ouvert</option>
        <option value="fermé">Fermé</option>
      </select>

      <div className="flex justify-end">
        <button className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg" onClick={handleAddShortTermObjective}>
          Enregistrer
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full space-x-4">
      {/* Colonne gauche : Objectifs long terme */}
      <div className="w-1/4 h-full bg-gray-100 p-4 rounded-lg shadow flex flex-col overflow-y-auto custom-scrollbar">
        <h4 className="text-lg font-semibold mb-3">Objectifs Long Terme</h4>

        <input
          type="text"
          value={newLongTitle}
          onChange={(e) => setNewLongTitle(e.target.value)}
          placeholder="Titre..."
          className="w-full p-2 border rounded-lg mb-2"
        />
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
              onClick={() => setSelectedLongObjective(obj)}
              className={`cursor-pointer p-2 rounded-lg text-sm ${
                selectedLongObjective?.id === obj.id ? "bg-middleBlueErgogo text-white" : "bg-gray-200"
              }`}
            >
              {obj.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite : Objectifs court terme */}
      <div className="w-3/4 h-full bg-white p-4 rounded-lg shadow flex flex-col overflow-y-auto custom-scrollbar">
        {selectedLongObjective ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Objectifs Court Terme pour "{selectedLongObjective.title}"
              </h4>
              <button
                className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg"
                onClick={() => setShowShortTermForm(!showShortTermForm)}
              >
                {showShortTermForm ? "Annuler" : "Ajouter"}
              </button>
            </div>

            <ul className="space-y-3 mb-6">
              {selectedLongObjective.shortTermObjectives?.map((obj) => (
                <li key={obj.id} className="p-3 bg-gray-100 rounded shadow-sm">
                  <div className="font-semibold">{obj.title}</div>
                  <div className="text-sm text-gray-600">
                    {obj.status} | Du {obj.startDate?.slice(0, 10)} au {obj.endDate?.slice(0, 10) || "…"}
                  </div>
                  {obj.description && (
                    <div
                      className="mt-2 text-sm prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: obj.description }}
                    />
                  )}
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
