import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../api/patientAPI.js";
import { motion } from "framer-motion";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsList = await getAllPatients();
        setPatients(patientsList);
      } catch (error) {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    };

    fetchPatients();
  }, []);

  const goToPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const goToAddPatientPage = () => {
    navigate("/add-patient");
  };

  return (
    <motion.div 
      className="p-4 bg-white shadow-lg rounded-xl w-full max-w-4xl h-[80vh] mt-4 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
    >
      {/* En-tête fixe */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-xl font-bold">Liste des Patients</h2>
        <button 
          className="bg-[#A294F9] text-white px-4 py-2 rounded-lg hover:bg-[#8a7cf9]"
          onClick={goToAddPatientPage}
        >
          Ajouter un patient
        </button>
      </div>

      {/* Liste scrollable sans scrollbar visible */}
      <div className="grow overflow-y-auto custom-scrollbar">
        <ul className="space-y-2 pr-2">
          {patients.map(patient => (
            <motion.li
              key={patient.id}
              className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPatientDetails(patient.id)}
            >
              <span>{patient.lastName} {patient.firstName}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Patients;
