import React, { useEffect, useState } from 'react';
import { getGoals } from '../../api/goalAPI.js';

const ActivityFilters = ({ filters, setFilters, onCreated }) => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const [fade, setFade] = useState(false);
  const [removingIndex, setRemovingIndex] = useState(null);

  const loadGoals = () => {
    getGoals().then(res => setGoals(res.data));
  };

  useEffect(() => {
    loadGoals();
  }, [onCreated]);

  const handleChangeObjective = (index, value) => {
    const updated = [...filters.objectives];
    updated[index] = Number(value);
    setFilters({ ...filters, objectives: updated });
    setError('');
  };

  const handleAddObjectiveField = () => {
    if (filters.objectives.includes(null)) {
      setError("Veuillez remplir l'objectif précédent avant d'en ajouter un autre.");
      setFade(false);
      setTimeout(() => setFade(true), 2500);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setFilters({ ...filters, objectives: [...filters.objectives, null] });
    setError('');
    setFade(false);
  };

  const handleRemoveObjective = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      const updated = [...filters.objectives];
      updated.splice(index, 1);
      setFilters({ ...filters, objectives: updated });
      setRemovingIndex(null);
    }, 300);
    setError('');
  };

  return (
    <div className="flex flex-col gap-6 transition-all duration-500 ease-in-out">
      
      {/* Barre de recherche */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom"
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightPurpleErgogo"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rechercher par description"
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightPurpleErgogo"
          value={filters.description}
          onChange={(e) => setFilters({ ...filters, description: e.target.value })}
        />
      </div>

      {/* Objectifs */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">
          Filtrer par objectifs :
        </label>
        {filters.objectives.map((id, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 transition-all ${
              removingIndex === index ? 'animate-fade-out' : 'animate-fade-in'
            }`}
          >
            <select
              className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightPurpleErgogo"
              value={id || ''}
              onChange={(e) => handleChangeObjective(index, e.target.value)}
            >
              <option value="">Objectif {index + 1}</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleRemoveObjective(index)}
              className="text-red-500 hover:text-red-700 text-xl font-bold"
              title="Supprimer"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Message d'erreur animé */}
        {error && (
          <div
            className={`bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg px-3 py-2 transition-opacity duration-500 ease-in-out animate-fade-in ${
              fade ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleAddObjectiveField}
          type="button"
          className="mt-2 text-sm text-darkPurpleErgogo hover:underline"
        >
          + Ajouter un objectif
        </button>
      </div>
      
    </div>
  );
};

export default ActivityFilters;
