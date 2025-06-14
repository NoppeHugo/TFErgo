import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchActivities, deleteActivity } from '../../api/activityAPI.js';
import ActivityCard from './ActivityCard.js';
import EditActivityForm from './EditActivityForm.js';
import Spinner from '../common/Spinner.js';
import Toast, { showErrorToast, showSuccessToast, showConfirmToast } from '../common/Toast.js';

const ActivityList = ({ filters, refresh }) => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    searchActivities({
      name: filters.name || '',
      description: filters.description || '',
      objectives: filters.objectives?.join(',') || '',
    }).then(res => setActivities(res.data)).finally(() => setLoading(false));
  }, [filters, refresh]);

  const handleDelete = async (id) => {
    showConfirmToast(setToast, (
      <span>
        Supprimer cette activité ?
        <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={async () => {
          try {
            await deleteActivity(id);
            setActivities(prev => prev.filter(a => a.id !== id));
            showSuccessToast(setToast, "Activité supprimée.");
          } catch (err) {
            showErrorToast(setToast, "Erreur lors de la suppression.");
          }
          setToast(null);
        }}>Oui</button>
        <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
      </span>
    ));
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
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      {editingActivity ? (
        <div className="mb-6">
          <EditActivityForm
            activity={editingActivity}
            onClose={() => setEditingActivity(null)}
            onUpdated={handleUpdated}
          />
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-40"><Spinner size={40} /></div>
      ) : (
        <div className="columns-1 sm:columns-2 gap-6 space-y-6">
          {activities.map(activity => (
            <div key={activity.id} className="break-inside-avoid w-full max-w-full">
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
