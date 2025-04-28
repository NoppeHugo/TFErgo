import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchActivities, deleteActivity } from '../../api/activityAPI.js';
import ActivityCard from './ActivityCard.js';
import EditActivityForm from './EditActivityForm.js';

const ActivityList = ({ filters, refresh }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const navigate = useNavigate();

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
        <div className="columns-1 sm:columns-2 gap-6 space-y-6">
          {activities.map(activity => (
            <div key={activity.id} className="break-inside-avoid">
              <ActivityCard
                activity={activity}
                onEdit={() => setEditingActivity(activity)}
                onDelete={() => handleDelete(activity.id)}
                onOpen={() => navigate(`/activities/${activity.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ActivityList;
