import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '../components/activities/ActivityList.js';
import ActivityForm from '../components/activities/ActivityForm.js';
import ActivityFilters from '../components/activities/ActivityFilters.js';
import Toast from '../components/Toast.js';
import { GoGoal } from "react-icons/go";
import { GiToolbox } from "react-icons/gi";


const ActivitiesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({ name: '', description: '', objectives: [] });
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-4 mt-3 w-full px-6">
          {/* Boutons alignés */}
          <div className="flex justify-center gap-4 w-full">  
            
            {/* Bouton aller gérer objectifs/matériel */}
            <button
              onClick={() => navigate('/manage-goals-materials')}
              className="w-10 h-10 flex items-center justify-center rounded-md transition hover:bg-gray-100"
              title="Gérer objectifs et matériel"
            >
              <GoGoal className="text-dark2GreenErgogo text-3xl" />
              <GiToolbox className="text-dark2GreenErgogo text-3xl" />
            </button>

            {/* Formulaire d'ajout d'activité */}
            <ActivityForm onCreated={triggerRefresh} showToast={showToast} />

          </div >
      </div>


      {/* Corps 3 colonnes */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto p-6 flex gap-6 h-full">

          {/* Colonne 1 : Filtres */}
          <div className="w-[20%] min-w-[260px]">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-28">
              <ActivityFilters filters={filters} setFilters={setFilters} onCreated={refresh} />
            </div>
          </div>

          {/* Colonne 2 : Liste d’activités */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <ActivityList filters={filters} refresh={refresh} />
          </div>

        </div>
      </div>

      {/* Toast notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default ActivitiesPage;
