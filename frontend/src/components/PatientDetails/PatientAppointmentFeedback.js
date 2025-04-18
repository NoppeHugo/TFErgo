import React, { useEffect, useState } from "react";
import axios from "axios";

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i)}
          className={`cursor-pointer text-xl ${i <= value ? "text-yellow-500" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const PatientAppointmentFeedback = ({ appointmentId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ objective: "", rating: 3 });

  const fetchFeedbacks = async () => {
    const res = await axios.get(`http://localhost:3001/appointments/${appointmentId}/feedbacks`, { withCredentials: true });
    setFeedbacks(res.data);
  };

  const handleAdd = async () => {
    if (!newFeedback.objective) return;
    await axios.post(
      `http://localhost:3001/appointments/${appointmentId}/feedbacks`,
      newFeedback,
      { withCredentials: true }
    );
    setNewFeedback({ objective: "", rating: 3 });
    fetchFeedbacks();
  };

  const handleUpdate = async (id, updates) => {
    await axios.patch(`http://localhost:3001/appointments/feedbacks/${id}`, updates, { withCredentials: true });
    fetchFeedbacks();
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [appointmentId]);

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">Retour sur la séance</h3>

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          value={newFeedback.objective}
          onChange={(e) => setNewFeedback((prev) => ({ ...prev, objective: e.target.value }))}
          placeholder="Ex : Objectif ou ressenti"
          className="px-3 py-2 rounded border w-full md:w-auto"
        />
        <StarRating
          value={newFeedback.rating}
          onChange={(val) => setNewFeedback((prev) => ({ ...prev, rating: val }))}
        />
        <button
          onClick={handleAdd}
          className="bg-dark2GreenErgogo text-white rounded px-3 py-2 text-sm hover:brightness-110"
        >
          Ajouter
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {feedbacks.map((fb) => (
          <li key={fb.id} className="p-3 bg-white border rounded">
            <div className="text-sm text-gray-700 mb-1">{fb.objective}</div>
            <StarRating
              value={fb.rating}
              onChange={(val) => handleUpdate(fb.id, { rating: val })}
            />
            <div className="mt-1 text-xs">
              <label className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={fb.completed}
                  onChange={(e) => handleUpdate(fb.id, { completed: e.target.checked })}
                />
                Objectif terminé
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientAppointmentFeedback;