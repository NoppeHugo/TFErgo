import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";  // Importer useNavigate

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();  // Initialiser useNavigate

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

  // Fonction pour rediriger vers les détails du patient
  const goToPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);  // Redirige vers la page de détails
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full mt-4">
      <h2 className="text-xl font-bold mb-4">Liste des Patients</h2>
      <ul className="space-y-2">
        {patients.map(patient => (
          <li
            key={patient.id}
            className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => goToPatientDetails(patient.id)}  // Redirige à la page de détails
          >
            {patient.nom} {patient.prenom}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Patients;
