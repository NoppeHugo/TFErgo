import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full mt-4">
      <h2 className="text-xl font-bold mb-4">Liste des Patients</h2>
      <ul className="space-y-2">
        {patients.map(patient => (
          <li
            key={patient.id}
            className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => setSelectedPatient(patient)}
          >
            {patient.nom} {patient.prenom}
          </li>
        ))}
      </ul>

      {selectedPatient && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">{selectedPatient.nom} {selectedPatient.prenom}</h3>
          <p>Date de naissance: {selectedPatient.dateNaissance}</p>
          <button
            className="mt-2 text-sm text-blue-500 underline"
            onClick={() => setSelectedPatient(null)}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default Patients;
