import React from 'react';
import ActivityFileViewer from './ActivityFileViewer.js';

const FullscreenActivityView = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white max-w-3xl w-full rounded-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-purple-700 mb-2">{activity.name}</h2>
        <p className="text-gray-700 whitespace-pre-line mb-4">{activity.description}</p>

        {activity.link && (
          <a
            href={activity.link}
            className="text-purple-600 text-sm underline mb-4 block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lien externe
          </a>
        )}

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700">Objectifs :</p>
          {activity.objectives?.length ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {activity.objectives.map(o => (
                <span
                  key={o.objective.id}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                >
                  {o.objective.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Aucun</p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">Fichiers :</p>
          {activity.files?.length ? activity.files.map(file => (
            <ActivityFileViewer key={file.id} file={file} />
          )) : <p className="text-sm text-gray-400">Aucun fichier</p>}
        </div>
      </div>
    </div>
  );
};

export default FullscreenActivityView;
