import React, { useEffect, useState } from 'react';
import { getMaterials, updateMaterial, deleteMaterial } from '../../api/materialAPI.js';
import { FiEdit2, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import Toast, { showSuccessToast, showErrorToast, showConfirmToast } from '../common/Toast.js';

const MaterialList = ({ searchTerm = '' }) => {
  const [materials, setMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [toast, setToast] = useState(null);

  const loadMaterials = async () => {
    try {
      const res = await getMaterials();
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setMaterials(sorted);
    } catch (err) {
      showErrorToast(setToast, "Erreur lors du chargement des matériels.");
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const startEditing = (material) => {
    setEditingId(material.id);
    setEditName(material.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      showErrorToast(setToast, 'Le nom du matériel est obligatoire.');
      return;
    }
    try {
      await updateMaterial(id, { name: editName });
      setEditingId(null);
      setEditName('');
      await loadMaterials();
      showSuccessToast(setToast, 'Matériel modifié !');
    } catch (err) {
      if (err?.response?.status === 409) {
        showErrorToast(setToast, 'Ce nom de matériel existe déjà.');
      } else {
        showErrorToast(setToast, "Erreur lors de la modification du matériel.");
      }
    }
  };

  const handleDelete = async (id) => {
    showConfirmToast(setToast, (
      <span>
        Supprimer ce matériel ?
        <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={async () => {
          try {
            await deleteMaterial(id);
            await loadMaterials();
            showSuccessToast(setToast, 'Matériel supprimé !');
          } catch (err) {
            showErrorToast(setToast, "Erreur lors de la suppression du matériel.");
          }
          setToast(null);
        }}>Oui</button>
        <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
      </span>
    ));
  };

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      {filteredMaterials.map((m) => (
        <div key={m.id} className="flex items-center justify-between bg-gray-50 p-2 rounded shadow-sm">
          {editingId === m.id ? (
            <div className="flex items-center w-full gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border px-2 py-1 rounded w-full text-sm"
                autoFocus
              />
              <button onClick={() => saveEdit(m.id)} className="text-green-600 text-sm">
                <FiCheck size={18} />
              </button>
              <button onClick={cancelEditing} className="text-gray-500 text-sm">
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm">{m.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEditing(m)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Modifier"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
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

export default MaterialList;
