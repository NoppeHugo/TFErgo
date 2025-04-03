import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { createActivity, uploadFileToActivity } from '../../api/activityAPI.js';
import { getGoals, createGoal } from '../../api/goalAPI.js';

const ActivityForm = ({ onCreated, showToast }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [files, setFiles] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');

  const loadGoals = () => {
    getGoals().then(res => setGoals(res.data));
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newActivity = await createActivity({
      therapistId: 1, // À rendre dynamique si besoin
      name,
      description,
      link,
      objectiveIds: selectedGoals.map(g => g.value),
    });

    const activityId = newActivity.data.id;

    const uploads = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadFileToActivity(activityId, {
            fileUrl: reader.result,
            fileType: file.type,
            fileName: file.name,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(uploads);
    onCreated();
    showToast && showToast("Activité ajoutée !");

    // Reset
    setName('');
    setDescription('');
    setLink('');
    setSelectedGoals([]);
    setFiles([]);
    setVisible(false);
  };

  const handleAddGoal = async () => {
    if (!newGoalName.trim()) return;
    await createGoal({ name: newGoalName });
    setNewGoalName('');
    loadGoals();
    onCreated();
    showToast && showToast("Objectif ajouté !");
  };

  const goalOptions = goals.map(goal => ({ value: goal.id, label: goal.name }));

  if (!visible) {
    return (
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            placeholder="Nouvel objectif"
            className="border px-2 py-1 rounded text-sm shadow-sm"
          />
          <button
            onClick={handleAddGoal}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
          >
            + Objectif
          </button>
        </div>
        <button
          onClick={() => setVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          + Ajouter une activité
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded space-y-4 max-w-xl border">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de l’activité"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
        rows={3}
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Lien externe"
        className="w-full border px-3 py-2 rounded"
      />

      {/* Select Objectifs avec react-select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs liés :</label>
        <Select
          options={goalOptions}
          isMulti
          value={selectedGoals}
          onChange={setSelectedGoals}
          className="text-sm"
          placeholder="Sélectionner des objectifs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fichiers :</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Créer
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-gray-600 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
