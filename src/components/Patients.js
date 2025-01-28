import { useState } from 'react';

const patientsList = [
  { id: 1, name: 'Alice Dupont', age: 32 },
  { id: 2, name: 'Jean Martin', age: 45 },
  { id: 3, name: 'Clara Bernard', age: 29 },
];

export default function Patients() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl w-full mt-4">
      <h2 className="text-xl font-bold mb-4">Patients</h2>
      <ul className="space-y-2">
        {patientsList.map((patient) => (
          <li
            key={patient.id}
            className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => setSelectedPatient(patient)}
          >
            {patient.name}
          </li>
        ))}
      </ul>

      {selectedPatient && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
          <p>Age: {selectedPatient.age}</p>
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
}