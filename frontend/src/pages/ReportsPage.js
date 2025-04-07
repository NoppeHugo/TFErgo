// src/pages/ReportsPage.js
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import ReportBuilder from '../components/ReportBuilder.js';

const ReportsPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:3001/patients', { withCredentials: true });
        setPatients(res.data.map(p => ({ value: p.id, label: `${p.firstName || ''} ${p.lastName || ''}` })));
      } catch (err) {
        console.error('Erreur chargement patients:', err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* En-tête fixe */}
      <div className="p-6 border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rapports</h1>
        </div>
      </div>

      {/* Corps scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un patient :</label>
          <Select
            options={patients}
            value={patients.find(p => p.value === selectedPatient)}
            onChange={(e) => setSelectedPatient(e.value)}
            placeholder="Choisir un patient..."
          />

          {selectedPatient && (
            <div className="mt-8">
              <ReportBuilder patientId={selectedPatient} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
