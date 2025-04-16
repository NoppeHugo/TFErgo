import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { updateActivity, uploadFileToActivity, deleteFile } from '../../api/activityAPI.js';
import { getGoals } from '../../api/goalAPI.js';
import { FiX } from 'react-icons/fi';

const EditActivityForm = ({ activity, onClose, onUpdated }) => {
  const [name, setName] = useState(activity.name || '');
  const [description, setDescription] = useState(activity.description || '');
  const [link, setLink] = useState(activity.link || '');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [existingImages, setExistingImages] = useState(
    activity.files?.filter(f => f.fileType.startsWith('image/')) || []
  );
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    getGoals().then(res => {
      setGoals(res.data);
      const mapped = activity.objectives.map(o => ({
        value: o.objective.id,
        label: o.objective.name,
      }));
      setSelectedGoals(mapped);
    });
  }, [activity]);

  const handleImageRemove = async (fileId) => {
    if (window.confirm('Supprimer cette image ?')) {
      await deleteFile(fileId);
      setExistingImages(prev => prev.filter(img => img.id !== fileId));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateActivity(activity.id, {
      name,
      description,
      link,
      objectiveIds: selectedGoals.map(o => o.value),
    });

    // Upload en base64 comme pour la création
    const uploads = newImages.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadFileToActivity(activity.id, {
            fileUrl: reader.result,
            fileType: file.type,
            fileName: file.name,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });
    await Promise.all(uploads);

    setNewImages([]);
    onUpdated();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded border shadow space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-purple-700">Modifier l’activité</h2>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nom"
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="Lien externe"
        className="w-full border px-3 py-2 rounded"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs :</label>
        <Select
          options={goals.map(g => ({ value: g.id, label: g.name }))}
          isMulti
          value={selectedGoals}
          onChange={setSelectedGoals}
          className="text-sm"
        />
      </div>

      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.fileUrl} alt="fichier activité" className="w-full h-[120px] object-cover rounded" />
              <button
                type="button"
                onClick={() => handleImageRemove(img.id)}
                className="absolute top-1 right-1 bg-white/70 hover:bg-white text-red-600 rounded-full p-1"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter des images :</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm"
        />
        {newImages.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">{newImages.length} image(s) sélectionnée(s)</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-dark2GreenErgogo hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditActivityForm;