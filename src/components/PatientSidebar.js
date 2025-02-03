import React, { useEffect, useState } from "react";
import { getAllPatients } from "../firebase/patientsFirestore.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const PatientSidebar = () => {
  const [patients, setPatients] = useState([]);
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsList = await getAllPatients();
      setPatients(patientsList);
    };

    fetchPatients();
  }, []);

  const handlePatientChange = (newPatientId) => {
    if (!newPatientId || newPatientId === patientId) return;

    // Récupère l'onglet actif (ex: "/patient/michel/carnet")
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const currentTab = pathParts.length > 3 ? `/${pathParts[3]}` : "";

    // Naviguer vers le même onglet pour le nouveau patient
    navigate(`/patient/${newPatientId}${currentTab}`);
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-lg fixed left-0 top-16 overflow-y-auto z-50">
      <h3 className="text-lg font-bold mb-4">Liste des patients</h3>
      <ul className="space-y-2">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className={`p-2 rounded-lg cursor-pointer ${
              patient.id === patientId ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-300"
            }`}
            onClick={() => handlePatientChange(patient.id)}
          >
            {patient.nom} {patient.prenom}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientSidebar;
