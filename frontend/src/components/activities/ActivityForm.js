// src/components/activities/ActivityForm.js
import React, { useState, useEffect } from 'react';
import { createActivity, uploadFileToActivity } from '../../api/activityAPI.js';
import { getGoals } from  '../../api/goalAPI.js';

const ActivityForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getGoals().then(res => setGoals(res.data));
  }, []);

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newActivity = await createActivity({
      therapistId: 1, // À remplacer dynamiquement si besoin
      name,
      description,
      link,
      objectiveIds: selectedGoals,
    });
    const activityId = newActivity.data.id;

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await uploadFileToActivity(activityId, {
          fileUrl: reader.result,
          fileType: file.type,
          fileName: file.name,
        });
        onCreated(); // Refresh
      };
      reader.readAsDataURL(file);
    }
    setName('');
    setDescription('');
    setLink('');
    setSelectedGoals([]);
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de l'activité" className="w-full border px-3 py-2 rounded" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded" />
      <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien externe" className="w-full border px-3 py-2 rounded" />
      
      <label className="block font-medium">Objectifs</label>
      <div className="flex flex-wrap gap-2">
        {goals.map(goal => (
          <label key={goal.id} className="flex items-center gap-1">
            <input type="checkbox" value={goal.id} checked={selectedGoals.includes(goal.id)} onChange={(e) => {
              const id = goal.id;
              setSelectedGoals(prev => e.target.checked ? [...prev, id] : prev.filter(g => g !== id));
            }} />
            {goal.name}
          </label>
        ))}
      </div>

      <label className="block font-medium mt-4">Fichiers associés</label>
      <input type="file" multiple onChange={handleFileChange} />

      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Créer l’activité</button>
    </form>
  );
};

export default ActivityForm;
