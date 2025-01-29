import React from 'react';
import Patients from '../components/Patients.js';

const PatientsPage = () => {
  return (
    <div className="w-full flex-grow flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Patients />
      </div>
    </div>
  );
};

export default PatientsPage;