import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, deleteActivity } from '../../api/activityAPI.js';
import { FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';

const ActivityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    getActivityById(id).then(res => setActivity(res.data));
  }, [id]);

  if (!activity) return <p className="text-center mt-10">Chargement...</p>;

  const imageFiles = activity.files?.filter(f => f.fileType.startsWith('image/')) || [];

  const goToNext = () => setCurrentImage((currentImage + 1) % imageFiles.length);
  const goToPrev = () => setCurrentImage((currentImage - 1 + imageFiles.length) % imageFiles.length);

  const handleDelete = async () => {
    if (window.confirm("Supprimer cette activité ?")) {
      await deleteActivity(activity.id);
      navigate('/activities');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 md:px-12 py-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto relative">
        {/* Flèche retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 text-gray-600 hover:text-black flex items-center gap-2"
        >
          <FiArrowLeft size={20} />
          Retour
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">{activity.name}</h2>
          <p className="text-gray-700 whitespace-pre-line mb-4">{activity.description}</p>

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

        {/* Objectifs */}
        <div className="my-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Objectifs :</p>
          {activity.objectives?.length ? (
            <div className="flex flex-wrap gap-2">
              {activity.objectives.map(o => (
                <span
                  key={o.objective.id}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                >
                  {o.objective.name}
                </span>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">Aucun</p>}
        </div>

        {/* Galerie d'images */}
        {imageFiles.length > 0 && (
          <div className="relative mt-8">
            <div className="flex items-center overflow-hidden rounded-lg shadow-md">
              <button
                onClick={goToPrev}
                className="h-full px-2 bg-white/70 hover:bg-white text-gray-700 z-10"
              >
                <FiChevronLeft size={24} />
              </button>
              <div className="flex overflow-x-auto gap-2 p-2 scrollbar-hide">
                {imageFiles.map((file, index) => (
                  <img
                    key={file.id}
                    src={file.fileUrl}
                    alt={`Image ${index + 1}`}
                    className="w-[300px] h-[300px] object-cover rounded"
                  />
                ))}
              </div>
              <button
                onClick={goToNext}
                className="h-full px-2 bg-white/70 hover:bg-white text-gray-700 z-10"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Boutons actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate(`/activities/edit/${activity.id}`)}
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
      </div>
    </div>
  );
};

export default ActivityDetailsPage;
