import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { updateActivity } from '../../api/activityAPI.js';
import { getGoals } from '../../api/goalAPI.js';

const EditActivityForm = ({ activity, onClose, onUpdated }) => {
  const [name, setName] = useState(activity.name || '');
  const [description, setDescription] = useState(activity.description || '');
  const [link, setLink] = useState(activity.link || '');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    getGoals().then(res => {
      setGoals(res.data);
      const mapped = activity.objectives.map(o => ({
        value: o.objective.id,
        label: o.objective.name,
      }));
      setSelectedGoals(mapped);
    });
  }, [activity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateActivity(activity.id, {
      name,
      description,
      link,
      objectiveIds: selectedGoals.map(o => o.value),
    });

    onUpdated(); // Rafraîchir la liste
    onClose();   // Fermer le formulaire
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded border shadow space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-purple-700">Modifier l’activité</h2>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nom"
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="Lien externe"
        className="w-full border px-3 py-2 rounded"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs :</label>
        <Select
          options={goals.map(g => ({ value: g.id, label: g.name }))}
          isMulti
          value={selectedGoals}
          onChange={setSelectedGoals}
          className="text-sm"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditActivityForm;
