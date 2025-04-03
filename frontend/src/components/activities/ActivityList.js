// src/components/activities/ActivityList.js
import React, { useEffect, useState } from 'react';
import { searchActivities } from '../../api/activityAPI.js';
import ActivityCard from './ActivityCard.js';

const ActivityList = ({ filters, refresh }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    searchActivities({
      name: filters.name || '',
      description: filters.description || '',
      objectives: filters.objectives?.join(',') || '',
    }).then(res => setActivities(res.data));
  }, [filters, refresh]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityList;
