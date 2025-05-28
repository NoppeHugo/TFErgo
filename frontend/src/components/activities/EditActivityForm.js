import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { updateActivity, uploadFileToActivity, deleteFile } from '../../api/activityAPI.js';
import { getGoals } from '../../api/goalAPI.js';
import { FiX } from 'react-icons/fi';
import MaterialSelect from './MaterialSelect.js';
import { getMaterials } from '../../api/materialAPI.js';
import Toast, { showErrorToast, showSuccessToast } from '../common/Toast.js';

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
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const nameInputRef = useRef();
  const descriptionInputRef = useRef();

  useEffect(() => {
    getGoals().then(res => {
      setGoals(res.data);
      const mapped = activity.objectives.map(o => ({
        value: o.objective.id,
        label: o.objective.name,
      }));
      setSelectedGoals(mapped);
    });
    getMaterials().then(res => {
      const mapped = activity.materials.map(m => ({
        value: m.material.id,
        label: m.material.name,
      }));
      setSelectedMaterials(mapped);
      setMaterials(res.data);
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

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis.';
    if (selectedGoals.length === 0) newErrors.goals = 'Veuillez sélectionner au moins un objectif.';
    if (!description.trim()) newErrors.description = 'La description est requise.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.name && nameInputRef.current) nameInputRef.current.focus();
      else if (validationErrors.description && descriptionInputRef.current) descriptionInputRef.current.focus();
      setToast({ message: Object.values(validationErrors).join(' '), type: 'error', persistent: false });
      return;
    }
    try {
      await updateActivity(activity.id, {
        name,
        description,
        link,
        objectiveIds: selectedGoals.map(o => o.value),
        materialIds: selectedMaterials.map(m => m.value),
      });
      // Upload en base64 comme pour la création
      const uploads = newImages.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              await uploadFileToActivity(activity.id, {
                fileUrl: reader.result,
                fileType: file.type,
                fileName: file.name,
              });
              resolve();
            } catch (err) {
              showErrorToast(setToast, "Erreur lors de l'upload d'un fichier.");
              resolve();
            }
          };
          reader.readAsDataURL(file);
        });
      });
      await Promise.all(uploads);
      showSuccessToast(setToast, "Activité modifiée !");
      onUpdated();
      onClose();
    } catch (err) {
      showErrorToast(setToast, "Erreur lors de la modification de l'activité.");
    }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border shadow space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold text-purple-700">Modifier l’activité</h2>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom"
          ref={nameInputRef}
          className={`w-full border px-3 py-2 rounded ${formErrors.name ? 'border-red-500' : ''}`}
          aria-invalid={!!formErrors.name}
          aria-describedby={formErrors.name ? 'name-error' : undefined}
        />
        {formErrors.name && <div id="name-error" className="text-red-600 text-sm mb-2">{formErrors.name}</div>}

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          ref={descriptionInputRef}
          className={`w-full border px-3 py-2 rounded ${formErrors.description ? 'border-red-500' : ''}`}
          aria-invalid={!!formErrors.description}
          aria-describedby={formErrors.description ? 'desc-error' : undefined}
        />
        {formErrors.description && <div id="desc-error" className="text-red-600 text-sm mb-2">{formErrors.description}</div>}

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

        <MaterialSelect
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
        />

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
    </>
  );
};

export default EditActivityForm;