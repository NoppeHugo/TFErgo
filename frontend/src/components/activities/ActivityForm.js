import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { createActivity, uploadFileToActivity } from '../../api/activityAPI.js';
import { getGoals, createGoal } from '../../api/goalAPI.js';
import MaterialSelect from './MaterialSelect.js';

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


  const loadGoals = () => {
    getGoals().then(res => setGoals(res.data));
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
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFadeErrors(false);
      setTimeout(() => setFadeErrors(true), 2500);
      setTimeout(() => setErrors({}), 3000);
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
          await uploadFileToActivity(activityId, {
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

    showToast && showToast("Activité ajoutée !");
    onCreated();

    // Reset
    setName('');
    setDescription('');
    setLink('');
    setSelectedGoals([]);
    setFiles([]);
    setVisible(false);
    setErrors({});
  };

  const handleAddGoal = async () => {
    if (!newGoalName.trim()) {
      setGoalError("Veuillez écrire un objectif avant de l’ajouter.");
      setFadeGoalError(false);
      setTimeout(() => setFadeGoalError(true), 2500);
      setTimeout(() => setGoalError(''), 3000);
      return;
    }
    await createGoal({ name: newGoalName });
    setNewGoalName('');
    loadGoals();
    onCreated();
    showToast && showToast("Objectif ajouté !");
  };

  if (!visible) {
    return (
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Nouvel objectif"
              className="border px-2 py-1 rounded text-sm shadow-sm"
            />
            <button
              onClick={handleAddGoal}
              className="bg-dark2GreenErgogo hover:bg-greenErgogo/90 text-white px-3 py-1 rounded text-sm transition"
            >
              + Objectif
            </button>
          </div>
          {goalError && (
            <div
              className={`bg-purple-100 border border-purple-300 text-purple-700 text-sm rounded px-3 py-2 animate-fade-in transition-opacity duration-500 ease-in-out ${
                fadeGoalError ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {goalError}
            </div>
          )}
        </div>

        <button
          onClick={() => setVisible(true)}
          className="bg-lightPurpleErgogo hover:bg-violetErgogo/90 text-white px-3 py-1 rounded text-sm transition"
        >
          + Ajouter une activité
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded border shadow space-y-4 animate-fade-in w-full">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de l’activité"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && (
          <div className={`bg-purple-100 border border-purple-300 text-purple-700 text-sm rounded px-3 py-2 animate-fade-in transition-opacity duration-500 ease-in-out ${fadeErrors ? 'opacity-0' : 'opacity-100'}`}>
            {errors.name}
          </div>
        )}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
        rows={3}
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Lien externe"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium text-gray-700">Objectifs liés :</label>
        <Select
          options={goalOptions}
          isMulti
          value={selectedGoals}
          onChange={setSelectedGoals}
          className="text-sm"
          placeholder="Sélectionner des objectifs"
        />
        {errors.goals && (
          <div className={`bg-purple-100 border border-purple-300 text-purple-700 text-sm rounded px-3 py-2 animate-fade-in transition-opacity duration-500 ease-in-out ${fadeErrors ? 'opacity-0' : 'opacity-100'}`}>
            {errors.goals}
          </div>
        )}
      </div>

      <MaterialSelect
        selectedMaterials={selectedMaterials}
        setSelectedMaterials={setSelectedMaterials}
        showToast={showToast}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fichiers :</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="bg-dark2GreenErgogo hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Créer
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-gray-600 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
