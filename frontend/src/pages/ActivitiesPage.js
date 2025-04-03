import React, { useState } from 'react';
import ActivityForm from '../components/activities/ActivityForm.js';
import ActivityList from '../components/activities/ActivityList.js';

const ActivitiesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(prev => !prev);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Activités thérapeutiques</h1>
      <ActivityForm onCreated={triggerRefresh} />
      <ActivityList key={refresh} />
    </div>
  );
};

export default ActivitiesPage;
