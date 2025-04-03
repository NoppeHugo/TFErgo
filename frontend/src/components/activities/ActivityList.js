// src/components/activities/ActivityList.js
import React, { useEffect, useState } from 'react';
import { getActivities } from '../../api/activityAPI.js';
import ActivityFileViewer from './ActivityFileViewer.js';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities().then(res => setActivities(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {activities.map(activity => (
        <div key={activity.id} className="border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">{activity.name}</h2>
          <p className="text-gray-600 mb-2">{activity.description}</p>
          {activity.link && <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lien externe</a>}
          <div className="mt-2">
            <strong>Objectifs :</strong>
            <ul className="list-disc list-inside">
              {activity.objectives.map(o => (
                <li key={o.objective.id}>{o.objective.name}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <strong>Fichiers :</strong>
            {activity.ActivityFile?.map(file => (
              <ActivityFileViewer key={file.id} file={file} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
