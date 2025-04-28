import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import GoalList from './GoalList.js';
import MaterialList from './MaterialList.js';

const ManageGoalsAndMaterialsPage = () => {
  const navigate = useNavigate();
  const [goalSearch, setGoalSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-darkPurpleErgogo hover:text-purple-700 mb-6"
        >
          <FiArrowLeft size={20} /> Retour
        </button>

        {/* Contenu 2 colonnes */}
        <div className="flex gap-6">
          {/* Colonne Objectifs */}
          <div className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto h-[calc(85vh-100px)]">
            <h2 className="text-2xl font-semibold text-darkPurpleErgogo mb-4">Objectifs</h2>

            {/* Champ de recherche Objectifs */}
            <input
              type="text"
              value={goalSearch}
              onChange={(e) => setGoalSearch(e.target.value)}
              placeholder="Rechercher un objectif..."
              className="w-full mb-4 px-4 py-2 border rounded-md text-sm"
            />

            <GoalList searchTerm={goalSearch} />
          </div>

          {/* Colonne Matériel */}
          <div className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto h-[calc(85vh-100px)]">
            <h2 className="text-2xl font-semibold text-darkPurpleErgogo mb-4">Matériel</h2>

            {/* Champ de recherche Matériel */}
            <input
              type="text"
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
              placeholder="Rechercher du matériel..."
              className="w-full mb-4 px-4 py-2 border rounded-md text-sm"
            />

            <MaterialList searchTerm={materialSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGoalsAndMaterialsPage;
