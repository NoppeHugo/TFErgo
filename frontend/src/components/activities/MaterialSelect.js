import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getMaterials, createMaterial } from '../../api/materialAPI.js';

const MaterialSelect = ({ selectedMaterials, setSelectedMaterials, showToast }) => {
  const [materials, setMaterials] = useState([]);
  const [newMaterialName, setNewMaterialName] = useState('');
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
      setError('Nom requis');
      return;
    }

    const materialExists = materials.some(
      (material) => material.name.toLowerCase() === newMaterialName.trim().toLowerCase()
    );

    if (materialExists) {
      setError('Le matériel existe déjà');
      return;
    }

    try {
      await createMaterial({ name: newMaterialName });
      setNewMaterialName('');
      await loadMaterials();
      showToast && showToast('Matériel ajouté !');
    } catch {
      setError('Erreur lors de l’ajout');
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Matériel requis :</label>
        <Select
          options={materials.map((m) => ({ value: m.id, label: m.name }))}
          isMulti
          value={selectedMaterials}
          onChange={setSelectedMaterials}
          isSearchable
          className="mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMaterialName}
          onChange={(e) => setNewMaterialName(e.target.value)}
          placeholder="Nouveau matériel"
          className="border px-2 py-1 rounded text-sm flex-1"
        />
        <button
          type="button"
          onClick={handleAddMaterial}
          className="bg-dark2GreenErgogo text-white px-3 py-1 rounded text-sm"
        >
          + Matériel
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MaterialSelect;
