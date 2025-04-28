import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getGoals, createGoal } from '../../api/goalAPI.js';

const GoalSelect = ({ selectedGoals, setSelectedGoals, showToast }) => {
  const [goals, setGoals] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [error, setError] = useState('');

  const loadGoals = async () => {
    const res = await getGoals();
    const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
    setGoals(sorted);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoalName.trim()) {
      setError('Nom requis');
      return;
    }
    try {
      await createGoal({ name: newGoalName });
      setNewGoalName('');
      await loadGoals();
      showToast && showToast('Objectif ajouté !');
    } catch {
      setError('Erreur lors de l’ajout');
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Objectifs liés :</label>
        <Select
          options={goals.map((g) => ({ value: g.id, label: g.name }))}
          isMulti
          value={selectedGoals}
          onChange={setSelectedGoals}
          isSearchable
          className="mt-1 text-sm"
          placeholder="Sélectionner des objectifs"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          placeholder="Nouvel objectif"
          className="border px-2 py-1 rounded text-sm flex-1"
        />
        <button
          type="button"
          onClick={handleAddGoal}
          className="bg-dark2GreenErgogo text-white px-3 py-1 rounded text-sm"
        >
          + Objectif
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default GoalSelect;
