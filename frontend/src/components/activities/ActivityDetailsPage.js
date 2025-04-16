import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getActivityById,
  deleteActivity,
  updateActivity,
  uploadFileToActivity,
  deleteFile,
} from '../../api/activityAPI.js';
import { getGoals } from '../../api/goalAPI.js';
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiX,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Select from 'react-select';

const ActivityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [goals, setGoals] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    getActivityById(id).then((res) => {
      const act = res.data;
      setActivity(act);
      setName(act.name);
      setDescription(act.description);
      setLink(act.link);
      setExistingImages(
        act.files?.filter((f) => f.fileType.startsWith('image/')) || []
      );
      setSelectedGoals(
        act.objectives.map((o) => ({
          value: o.objective.id,
          label: o.objective.name,
        }))
      );
    });
    getGoals().then((res) => setGoals(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Supprimer cette activité ?')) {
      await deleteActivity(activity.id);
      navigate('/activities');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateActivity(activity.id, {
      name,
      description,
      link,
      objectiveIds: selectedGoals.map((o) => o.value),
    });
    if (newImages.length > 0) {
      for (const file of newImages) {
        const reader = new FileReader();
        await new Promise((resolve) => {
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
      }
    }

    setEditing(false);
    const updated = await getActivityById(id);
    setActivity(updated.data);
    setExistingImages(
      updated.data.files?.filter((f) => f.fileType.startsWith('image/')) || []
    );
    setNewImages([]);
  };

  const handleRemoveImage = async (fileId) => {
    if (window.confirm('Supprimer cette image ?')) {
      await deleteFile(fileId);
      setExistingImages((prev) => prev.filter((img) => img.id !== fileId));
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const goToNext = () =>
    setCurrentImage((currentImage + 1) % existingImages.length);
  const goToPrev = () =>
    setCurrentImage(
      (currentImage - 1 + existingImages.length) % existingImages.length
    );

  if (!activity) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen bg-white px-4 md:px-12 py-8 overflow-x-hidden"
    >
      <div className="max-w-5xl mx-auto relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 text-gray-600 hover:text-black flex items-center gap-2"
        >
          <FiArrowLeft size={20} /> Retour
        </button>

        {!editing ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-700 mb-2">
                {activity.name}
              </h2>
              <p className="text-gray-700 whitespace-pre-line mb-4">
                {activity.description}
              </p>
              {activity.link && (
                <a
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline text-sm"
                >
                  Lien externe
                </a>
              )}
            </div>

            <div className="my-6">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Objectifs :
              </p>
              {activity.objectives?.length ? (
                <div className="flex flex-wrap gap-2">
                  {activity.objectives.map((o) => (
                    <span
                      key={o.objective.id}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                    >
                      {o.objective.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Aucun</p>
              )}
            </div>

            {existingImages.length > 0 && (
              <div className="relative mt-8 w-full max-w-5xl mx-auto overflow-hidden">
                <div className="relative w-full h-[400px] flex items-center justify-center">
                  <button
                    onClick={goToPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 text-gray-700 z-10 rounded-l"
                  >
                    <FiChevronLeft size={24} />
                  </button>

                  <div className="w-full overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${(100 / 3) * currentImage}%)`,
                        width: `${existingImages.length * (100 / 3)}%`,
                      }}
                    >
                      {existingImages.map((file, index) => (
                        <div
                          key={file.id}
                          className="w-[33.3333%] flex-shrink-0 flex items-center justify-center"
                        >
                          <img
                            src={file.fileUrl}
                            alt={`Image ${index + 1}`}
                            className="max-h-[400px] object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 text-gray-700 z-10 rounded-r"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Image {currentImage + 1} / {existingImages.length}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded border shadow space-y-4 animate-fade-in mt-6"
          >
            <h2 className="text-xl font-semibold text-purple-700">
              Modifier l’activité
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom"
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Lien externe"
              className="w-full border px-3 py-2 rounded"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objectifs :
              </label>
              <Select
                options={goals.map((g) => ({ value: g.id, label: g.name }))}
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
                    <img
                      src={img.fileUrl}
                      alt="fichier activité"
                      className="w-full h-[120px] object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 bg-white/70 hover:bg-white text-red-600 rounded-full p-1"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ajouter des images :
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                className="text-sm"
              />
              {newImages.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {newImages.length} image(s) sélectionnée(s)
                </p>
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
                onClick={() => setEditing(false)}
                className="text-gray-600 hover:underline"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityDetailsPage;
