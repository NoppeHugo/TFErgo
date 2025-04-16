import React, { useEffect, useState } from "react";
import { getAllAppointments } from "../../api/appointmentAPI.js";
import { useNavigate } from "react-router-dom";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const all = await getAllAppointments();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const filtered = all.filter((apt) => {
        const aptDate = new Date(apt.date).toISOString().split("T")[0];
        return aptDate === todayStr;
      });

      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(filtered);
    };

    fetchAppointments();
  }, []);

  if (appointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous aujourd’hui.</p>;
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3 text-[#776B89]">📅 Rendez-vous aujourd’hui</h2>
      <ul className="space-y-3">
        {appointments.map((apt) => (
          <li
            key={apt.id}
            className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/patient/${apt.patient?.id}`)}
          >
            <div className="text-sm text-gray-600">
              {new Date(apt.date).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="font-semibold text-gray-800">{apt.title}</div>
            <div className="text-sm text-gray-700">
              {apt.patient?.firstName} {apt.patient?.lastName}
              {" · "}
              {apt.activity?.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayAppointments;
