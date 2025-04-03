import React from 'react';
import ActivityFileViewer from './ActivityFileViewer.js';

const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-white rounded shadow-sm p-4 border hover:shadow-md transition">
      <h2 className="text-xl font-bold text-gray-800">{activity.name}</h2>
      {<p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{activity.description}</p>}
      {activity.link && (
        <a href={activity.link} className="text-blue-600 text-sm underline mt-2 inline-block" target="_blank" rel="noopener noreferrer">
          Lien externe
        </a>
      )}
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700">Objectifs :</p>
        {activity.objectives?.length ? (
          <ul className="list-disc list-inside text-sm text-gray-700">
            {activity.objectives.map(o => <li key={o.objective.id}>{o.objective.name}</li>)}
          </ul>
        ) : <p className="text-sm text-gray-400">Aucun</p>}
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700">Fichiers :</p>
        {activity.files?.length ? activity.files.map(file => (
          <ActivityFileViewer key={file.id} file={file} />
        )) : <p className="text-sm text-gray-400">Aucun fichier</p>}
      </div>
    </div>
  );
};

export default ActivityCard;
