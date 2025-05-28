import React, { useEffect, useState } from 'react';
import { getGoals, updateGoal, deleteGoal } from '../../api/goalAPI.js';
import { FiEdit2, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import Toast, { showSuccessToast, showErrorToast, showConfirmToast } from '../common/Toast.js';

const GoalList = ({ searchTerm = '' }) => {
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [toast, setToast] = useState(null);

  const loadGoals = async () => {
    try {
      const res = await getGoals();
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setGoals(sorted);
    } catch (err) {
      showErrorToast(setToast, "Erreur lors du chargement des objectifs.");
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditName(goal.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      showErrorToast(setToast, 'Le nom de l\'objectif est obligatoire.');
      return;
    }
    try {
      await updateGoal(id, { name: editName });
      setEditingId(null);
      setEditName('');
      await loadGoals();
      showSuccessToast(setToast, 'Objectif modifié !');
    } catch (err) {
      if (err?.response?.status === 409) {
        showErrorToast(setToast, 'Ce nom d\'objectif existe déjà.');
      } else {
        showErrorToast(setToast, "Erreur lors de la modification de l'objectif.");
      }
    }
  };

  const handleDelete = async (id) => {
    showConfirmToast(setToast, (
      <span>
        Supprimer cet objectif ?
        <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={async () => {
          try {
            await deleteGoal(id);
            await loadGoals();
            showSuccessToast(setToast, 'Objectif supprimé !');
          } catch (err) {
            showErrorToast(setToast, "Erreur lors de la suppression de l'objectif.");
          }
          setToast(null);
        }}>Oui</button>
        <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
      </span>
    ));
  };

  const filteredGoals = goals.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      {filteredGoals.map((g) => (
        <div key={g.id} className="flex items-center justify-between bg-gray-50 p-2 rounded shadow-sm">
          {editingId === g.id ? (
            <div className="flex items-center w-full gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border px-2 py-1 rounded w-full text-sm"
                autoFocus
              />
              <button onClick={() => saveEdit(g.id)} className="text-green-600 text-sm">
                <FiCheck size={18} />
              </button>
              <button onClick={cancelEditing} className="text-gray-500 text-sm">
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm">{g.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditing(g)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Modifier"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <FiTrash size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default GoalList;
