// src/components/activities/ActivityList.js
import React, { useEffect, useState } from 'react';
import { searchActivities, deleteActivity } from '../../api/activityAPI.js';
import ActivityCard from './ActivityCard.js';
import EditActivityForm from './EditActivityForm.js';

const ActivityList = ({ filters, refresh }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    searchActivities({
      name: filters.name || '',
      description: filters.description || '',
      objectives: filters.objectives?.join(',') || '',
    }).then(res => setActivities(res.data));
  }, [filters, refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette activité ?")) {
      await deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleUpdated = () => {
    setEditingActivity(null);
    searchActivities({
      name: filters.name || '',
      description: filters.description || '',
      objectives: filters.objectives?.join(',') || '',
    }).then(res => setActivities(res.data));
  };

  return (
    <>
      {editingActivity ? (
        <div className="mb-6">
          <EditActivityForm
            activity={editingActivity}
            onClose={() => setEditingActivity(null)}
            onUpdated={handleUpdated}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => setEditingActivity(activity)}
              onDelete={() => handleDelete(activity.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ActivityList;
