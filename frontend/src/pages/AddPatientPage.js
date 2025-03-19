import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../firebase/patientsFirestore.js";
import PatientForm from "../components/PatientDetails/PatientForm.js";


const AddPatientPage = () => {
  const [newPatient, setNewPatient] = useState({});
  const navigate = useNavigate();

  const handleAddPatient = async () => {
    await addPatient(newPatient);
    navigate("/patients");
  };

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  return <PatientForm patientData={newPatient} handleChange={handleChange} handleSubmit={handleAddPatient} isEditing={false} />;
};

export default AddPatientPage;
