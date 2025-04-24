import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../../api/materialAPI.js';
import { FiEdit2, FiTrash } from 'react-icons/fi';

const MaterialSelect = ({ selectedMaterials, setSelectedMaterials, showToast }) => {
  const [materials, setMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const loadMaterials = async () => {
    const res = await getMaterials();
    const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
    setMaterials(sorted);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleAddMaterial = async () => {
    if (!newMaterialName.trim()) {
      setError("Nom requis");
      return;
    }
    try {
      await createMaterial({ name: newMaterialName });
      setNewMaterialName('');
      await loadMaterials();
      showToast && showToast("Matériel ajouté !");
    } catch {
      setError("Erreur lors de l’ajout");
    }
  };

  const handleEditMaterial = async (id) => {
    if (!editName.trim()) return;
    await updateMaterial(id, { name: editName });
    setEditingId(null);
    await loadMaterials();
    showToast && showToast("Matériel modifié !");
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Supprimer ce matériel ?')) return;
    await deleteMaterial(id);
    await loadMaterials();
    showToast && showToast("Matériel supprimé !");
  };

  // Custom Option renderer
  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    const isEditing = editingId === data.value;

    return (
      <div ref={innerRef} {...innerProps} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer">
        {isEditing ? (
          <>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              onFocus={(e) => e.stopPropagation()} 
              className="border px-2 py-1 text-sm rounded w-full mr-2"
            />

            <button onClick={() => handleEditMaterial(data.value)} className="text-green-600 ml-2 text-xs">✔</button>
            <button onClick={() => setEditingId(null)} className="text-gray-600 ml-1 text-xs">✖</button>
          </>
        ) : (
          <>
            <span>{data.label}</span>
            <div className="flex items-center gap-2 text-xs ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(data.value);
                  setEditName(data.label);
                }}
                className="text-blue-500 hover:text-blue-700"
                title="Modifier"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMaterial(data.value);
                }}
                className="text-red-500 hover:text-red-700"
                title="Supprimer"
              >
                <FiTrash size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700">Matériel requis :</label>
      <Select
        options={materials.map((m) => ({ value: m.id, label: m.name }))}
        isMulti
        value={selectedMaterials}
        onChange={setSelectedMaterials}
        className="mt-1"
        components={{ Option: CustomOption }}
      />

      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={newMaterialName}
          onChange={(e) => setNewMaterialName(e.target.value)}
          placeholder="Nouveau matériel"
          className="border px-2 py-1 rounded text-sm"
        />
        <button
          type="button"
          onClick={handleAddMaterial}
          className="bg-dark2GreenErgogo text-white px-3 py-1 rounded text-sm"
        >
          + Matériel
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default MaterialSelect;
