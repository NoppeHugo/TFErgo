import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import ActivityFileViewer from './ActivityFileViewer.js';

const ActivityCard = ({ activity, onEdit, onDelete, onOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between p-4 sm:p-6 w-full max-w-full"
      onClick={() => onOpen(activity)}
    >
      <div className="absolute top-2 right-2 z-20" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
        >
          <FiMoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-36 py-1 text-sm z-30">
            <button
              onClick={() => { setMenuOpen(false); onEdit(); }}
              className="w-full text-left px-4 py-2 hover:bg-purple-100"
            >
              Modifier
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete(); }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-darkPurpleErgogo">{activity.name}</h2>
      <p className="text-gray-600 text-sm mt-1 whitespace-pre-line line-clamp-2">{activity.description}</p>

      {activity.link && (
        <a
          href={activity.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-darkPurpleErgogo text-sm underline mt-2 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          Lien externe
        </a>
      )}

      <div className="mt-3">
        <p className="text-sm font-semibold text-gray-700">Objectifs :</p>
        {activity.objectives?.length ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {activity.objectives.map(o => (
              <span
                key={o.objective.id}
                className="text-xs px-2 py-1 bg-lightPurpleErgogo text-white rounded-full"
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
        <p className="text-sm font-semibold text-gray-700">Matériel :</p>
        {activity.materials?.length ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {activity.materials.map(m => (
              <span
                key={m.material.id}
                className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full"
              >
                {m.material.name}
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