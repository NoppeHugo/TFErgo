import React, { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import ActivityFileViewer from './ActivityFileViewer.js';

const ActivityCard = ({ activity, onEdit, onDelete, onOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative bg-white rounded shadow-sm p-4 border hover:shadow-md transition cursor-pointer flex flex-col justify-between h-[480px]"
      onClick={() => onOpen(activity)}
    >
      {/* Menu bouton 3 points */}
      <div className="absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="text-gray-500 hover:text-gray-800"
        >
          <FiMoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 bg-white border rounded shadow w-32 z-30 animate-fade-in">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-100"
            >
              Modifier
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <h2 className="text-xl font-bold text-purple-700">{activity.name}</h2>
      <p className="text-gray-600 text-sm mt-1 whitespace-pre-line line-clamp-2">{activity.description}</p>

      {activity.link && (
        <a
          href={activity.link}
          className="text-purple-600 text-sm underline mt-2 inline-block"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Lien externe
        </a>
      )}

      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700">Objectifs :</p>
        {activity.objectives?.length ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {activity.objectives.map((o) => (
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

      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700">Fichiers :</p>
        <ActivityFileViewer files={activity.files} />
      </div>
    </div>
  );
};

export default ActivityCard;
