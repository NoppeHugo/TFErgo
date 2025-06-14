import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { createActivity, uploadFileToActivity, getActivities } from '../../api/activityAPI.js';
import { getGoals, createGoal } from '../../api/goalAPI.js';
import MaterialSelect from './MaterialSelect.js';
import GoalSelect from './GoalSelect.js';
import Toast, { showErrorToast, showConfirmToast } from '../common/Toast.js';
import { useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';

const ActivityForm = ({ onCreated, showToast }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [files, setFiles] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [errors, setErrors] = useState({});
  const [fadeErrors, setFadeErrors] = useState(false);
  const [goalError, setGoalError] = useState('');
  const [fadeGoalError, setFadeGoalError] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  const nameInputRef = useRef();
  const descriptionInputRef = useRef();

  const loadGoals = () => {
    getGoals().then(res => {
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setGoals(sorted);
    });
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const goalOptions = goals.map(goal => ({ value: goal.id, label: goal.name }));

  const handleFileChange = (e) => setFiles([...e.target.files]);

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
      const existingActivities = await getActivities();
      const duplicateActivity = existingActivities.data.find(activity => activity.name.trim().toLowerCase() === name.trim().toLowerCase());
      if (duplicateActivity) {
        setToast({ message: 'Une activité avec ce nom existe déjà.', type: 'error', persistent: false });
        return;
      }
      const newActivity = await createActivity({
        therapistId: 1,
        name,
        description,
        link,
        objectiveIds: selectedGoals.map(g => g.value),
        materialIds: selectedMaterials.map(m => m.value),
      });
      const activityId = newActivity.data.id;
      const uploads = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              await uploadFileToActivity(activityId, {
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
      showToast && showToast("Activité ajoutée !");
      onCreated();
      resetForm();
    } catch (err) {
      if (err?.response?.data?.error?.includes('requis')) {
        setToast({ message: "L'API attend plus d'éléments (objectifs, description, etc.). Veuillez compléter tous les champs obligatoires.", type: 'error', persistent: false });
      } else {
        showErrorToast(setToast, "Erreur lors de la création de l'activité.");
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLink('');
    setSelectedGoals([]);
    setSelectedMaterials([]);
    setFiles([]);
    setVisible(false);
    setErrors({});
    setIsDirty(false);
  };

  const handleAddGoal = async () => {
    if (!newGoalName.trim()) {
      setGoalError("Veuillez écrire un objectif.");
      setFadeGoalError(false);
      setTimeout(() => setFadeGoalError(true), 2500);
      setTimeout(() => setGoalError(''), 3000);
      return;
    }
    await createGoal({ name: newGoalName });
    setNewGoalName('');
    await loadGoals();
    showToast && showToast("Objectif ajouté !");
  };

  // Détecte toute modification sur les champs du formulaire
  useEffect(() => {
    if (name || description || link || selectedGoals.length > 0 || selectedMaterials.length > 0 || files.length > 0) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [name, description, link, selectedGoals, selectedMaterials, files]);

  // Confirmation lors d'un rafraîchissement ou fermeture d'onglet
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Confirmation lors d'une navigation interne (React Router)
  // Remplace le window.confirm par un toast UX pour la navigation interne
  function useBlockerWithToast(blocker, when = true) {
    const { navigator } = React.useContext(UNSAFE_NavigationContext);
    useEffect(() => {
      if (!when) return;
      const push = navigator.push;
      navigator.push = (...args) => {
        if (blocker()) {
          showConfirmToast(setToast, (
            <span>
              Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?
              <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={() => {
                navigator.push = push;
                push(...args);
                setToast(null);
              }}>Oui</button>
              <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
            </span>
          ));
        } else {
          push(...args);
        }
      };
      return () => {
        navigator.push = push;
      };
    }, [blocker, when, navigator]);
  }
  useBlockerWithToast(() => isDirty, isDirty);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="bg-lightPurpleErgogo hover:bg-violetErgogo/90 text-white px-4 py-2 rounded-md text-sm transition"
      >
        + Ajouter une activité
      </button>
    );
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      <form onSubmit={handleSubmit} className="w-full bg-white p-3 sm:p-6 rounded-2xl shadow-md space-y-4 animate-fade-in max-w-5xl mx-auto">
        {/* Nom */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nom de l’activité :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de l’activité"
            ref={nameInputRef}
            className={`border px-3 py-1.5 rounded-md text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={!!formErrors.name}
            aria-describedby={formErrors.name ? 'name-error' : undefined}
          />
          {formErrors.name && (
            <div id="name-error" className="text-red-600 text-sm mb-2">{formErrors.name}</div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de l’activité"
            ref={descriptionInputRef}
            className={`border px-4 py-2 rounded-md resize-none ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows={2}
            aria-invalid={!!formErrors.description}
            aria-describedby={formErrors.description ? 'desc-error' : undefined}
          />
          {formErrors.description && (
            <div id="desc-error" className="text-red-600 text-sm mb-2">{formErrors.description}</div>
          )}
        </div>

        {/* Lien */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Lien externe :</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Lien externe (optionnel)"
            className="border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <GoalSelect
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
          showToast={showToast}
        />


        {/* Matériel */}
        <MaterialSelect
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
          showToast={showToast}
        />

        {/* Fichiers */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Fichiers :</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {/* Boutons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-dark2GreenErgogo hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            Créer
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="text-gray-600 hover:underline"
          >
            Annuler
          </button>
        </div>
      </form>
    </>
  );
};

export default ActivityForm;
