import React, { useEffect, useState } from 'react';
import { getGoals, updateGoal, deleteGoal } from '../../api/goalAPI.js';
import { FiEdit2, FiTrash, FiCheck, FiX } from 'react-icons/fi';

const GoalList = ({ showToast, searchTerm = '' }) => {
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const loadGoals = async () => {
    const res = await getGoals();
    const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
    setGoals(sorted);
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
    if (!editName.trim()) return;
    await updateGoal(id, { name: editName });
    setEditingId(null);
    setEditName('');
    await loadGoals();
    showToast && showToast('Objectif modifié !');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet objectif ?')) {
      await deleteGoal(id);
      await loadGoals();
      showToast && showToast('Objectif supprimé !');
    }
  };

  const filteredGoals = goals.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
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
