import React from "react";
import { useNavigate } from "react-router-dom";
import { getAllAppointments } from "../../api/appointmentAPI.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from '../../components/common/Spinner.js';

const TodayAppointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ["appointments", "all"],
    queryFn: getAllAppointments,
  });

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments
    .filter((apt) => new Date(apt.date).toISOString().split("T")[0] === today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (isLoading) {
    return <div className="flex justify-center items-center h-24"><Spinner size={32} /></div>;
  }

  if (todayAppointments.length === 0) {
    return <p className="text-gray-500">Aucun rendez-vous aujourd’hui.</p>;
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3 text-[#776B89]">📅 Rendez-vous aujourd’hui</h2>
      <ul className="space-y-3">
        {todayAppointments.map((apt) => (
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
