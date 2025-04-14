import React, { useEffect, useState } from 'react';
import { searchActivities, deleteActivity } from '../../api/activityAPI.js';
import ActivityCard from './ActivityCard.js';
import EditActivityForm from './EditActivityForm.js';
import FullscreenActivityView from './ActivityDetailsPage.js';

const ActivityList = ({ filters, refresh }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [fullscreenActivity, setFullscreenActivity] = useState(null); // 👈 NEW

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => setEditingActivity(activity)}
              onDelete={() => handleDelete(activity.id)}
              onOpen={setFullscreenActivity} // 👈 NEW
            />
          ))}
        </div>
      )}

      {/* Vue plein écran si sélectionnée */}
      {fullscreenActivity && (
        <FullscreenActivityView
        activity={fullscreenActivity}
        onClose={() => setFullscreenActivity(null)}
        onEdit={(a) => {
          setEditingActivity(a);
          setFullscreenActivity(null);
        }}
        onDelete={async (id) => {
          await deleteActivity(id);
          setFullscreenActivity(null);
          setActivities(prev => prev.filter((a) => a.id !== id));
        }}
      />      
      )}
    </>
  );
};

export default ActivityList;
