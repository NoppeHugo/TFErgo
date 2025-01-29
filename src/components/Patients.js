import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  return (
    <motion.div 
      className="p-4 bg-white shadow-lg rounded-xl w-full mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
    >
      <h2 className="text-xl font-bold mb-4">Liste des Patients</h2>
      <ul className="space-y-2">
        {patients.map(patient => (
          <motion.li
            key={patient.id}
            className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToPatientDetails(patient.id)}
          >
            {patient.nom} {patient.prenom}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Patients;
