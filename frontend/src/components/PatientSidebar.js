import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllPatients } from "../api/patientAPI.js";

const PatientSidebar = () => {
  const [patients, setPatients] = useState([]);
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsList = await getAllPatients();
        setPatients(patientsList);
      } catch (err) {
        console.error("Erreur chargement patients sidebar", err);
      }
    };
    fetchPatients();
  }, []);

  const handlePatientChange = (newPatientId) => {
    if (!newPatientId || newPatientId === parseInt(patientId)) return;
    const currentTab = location.pathname.split("/")[3] || "";
    navigate(`/patient/${newPatientId}/${currentTab}`);
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-bold mb-4">Liste des patients</h3>
      <ul className="space-y-2 h-96 overflow-y-auto custom-scrollbar">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className={`p-2 rounded-lg cursor-pointer ${
              patient.id === parseInt(patientId) ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-300"
            }`}
            onClick={() => handlePatientChange(patient.id)}
          >
            {patient.firstName} {patient.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientSidebar;
