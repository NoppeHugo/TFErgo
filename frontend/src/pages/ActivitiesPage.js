import React, { useState } from 'react';
import ActivityList from '../components/activities/ActivityList.js';
import ActivityForm from '../components/activities/ActivityForm.js';
import ActivityFilters from '../components/activities/ActivityFilters.js';
import Toast from '../components/Toast.js'; 

const ActivitiesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({ name: '', description: '', objectives: [] });
  const [toastMessage, setToastMessage] = useState('');

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000); 
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* En-tête fixe */}
      <div className="p-6 border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Activités thérapeutiques</h1>
          <ActivityForm onCreated={() => { triggerRefresh(); showToast("Activité ajoutée !"); }} showToast={showToast} />
        </div>
      </div>

      {/* Corps scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto p-6 flex gap-6">
          {/* Filtres */}
          <div className="w-full max-w-xs">
            <div className="bg-white rounded shadow p-4 sticky top-28">
              <ActivityFilters filters={filters} setFilters={setFilters} onCreated={refresh} />
            </div>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <ActivityList
              filters={filters}
              refresh={refresh}
              onEditActivity={(activity) => {
                console.log("Modifier activité :", activity);
              }}
            />
          </div>
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
};

export default ActivitiesPage;
