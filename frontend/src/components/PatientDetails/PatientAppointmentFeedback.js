import React, { useEffect, useState } from "react";
import {
  getEvaluationItemsByPatient,
  addAppointmentFeedbacks,
  getAppointmentFeedbacks,
  createEvaluationItem,
} from "../../api/evaluationAPI.js";

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

const PatientAppointmentFeedback = ({ appointmentId, patientId, reloadTrigger }) => {
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [existingFeedbacks, setExistingFeedbacks] = useState([]);

  const loadItems = async () => {
    const data = await getEvaluationItemsByPatient(patientId);
    setItems(data);
  };

  const loadFeedbacks = async () => {
    const data = await getAppointmentFeedbacks(appointmentId);
    setExistingFeedbacks(data);
    const initial = {};
    data.forEach((fb) => {
      initial[fb.evaluationItemId] = fb.rating;
    });
    setFeedbacks(initial);
  };

  const handleSave = async () => {
    const formatted = Object.entries(feedbacks).map(([evaluationItemId, rating]) => ({
      evaluationItemId,
      rating,
    }));
    await addAppointmentFeedbacks(appointmentId, formatted);
    await loadFeedbacks();
  };

  useEffect(() => {
    if (patientId && appointmentId) {
      loadItems();
      loadFeedbacks();
    }
  }, [patientId, appointmentId, reloadTrigger]); 

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">Évaluation de la séance</h3>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="p-3 bg-white border rounded">
            <div className="text-sm font-medium text-gray-700">{item.title}</div>
            <StarRating
              value={feedbacks[item.id] || 0}
              onChange={(val) =>
                setFeedbacks((prev) => ({ ...prev, [item.id]: val }))
              }
            />
          </li>
        ))}
      </ul>

      <button
        onClick={handleSave}
        className="mt-4 bg-dark2GreenErgogo text-white px-4 py-2 rounded hover:brightness-110"
      >
        Enregistrer les évaluations
      </button>
    </div>
  );
};

export default PatientAppointmentFeedback;
