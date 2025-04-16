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
    }, 300); // Durée de l’animation
    setError('');
  };

  return (
    <div className="flex flex-col gap-4 transition-all duration-500 ease-in-out">
      {/* Nom & Description */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Rechercher par nom"
          className="border px-3 py-2 rounded w-full text-sm"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rechercher par description"
          className="border px-3 py-2 rounded w-full text-sm"
          value={filters.description}
          onChange={(e) => setFilters({ ...filters, description: e.target.value })}
        />
      </div>

      {/* Objectifs */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          Filtrer par objectifs :
        </label>
        <div className="flex flex-col gap-2">
          {filters.objectives.map((id, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                removingIndex === index ? 'animate-fade-out' : 'animate-fade-in'
              }`}
            >
              <select
                className="border px-2 py-1 rounded flex-grow text-sm"
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
                className="text-red-500 text-lg hover:text-red-700"
                title="Supprimer ce filtre"
              >
                −
              </button>
            </div>
          ))}

          {/* Message d'erreur animé */}
          {error && (
            <div
              className={`bg-purple-100 border border-purple-300 text-purple-700 text-sm rounded px-3 py-2 mt-1 transition-opacity duration-500 ease-in-out animate-fade-in ${
                fade ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleAddObjectiveField}
            type="button"
            className="text-darkPurpleErgogo text-sm hover:underline mt-1"
          >
            + Ajouter un objectif
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;
