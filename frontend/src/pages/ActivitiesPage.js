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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Activités thérapeutiques</h1>
        <ActivityForm onCreated={() => { triggerRefresh(); showToast("Activité ajoutée !"); }} showToast={showToast} />
      </div>

      <div className="flex gap-6">
        <div className="w-full max-w-xs">
          <div className="bg-white rounded shadow p-4 sticky top-20">
            <ActivityFilters filters={filters} setFilters={setFilters} onCreated={refresh} />
          </div>
        </div>

        <div className="flex-1">
        <ActivityList
        filters={filters}
        refresh={refresh}
        onEditActivity={(activity) => {
          console.log("Modifier activité :", activity);
        }}/>
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
};

export default ActivitiesPage;
