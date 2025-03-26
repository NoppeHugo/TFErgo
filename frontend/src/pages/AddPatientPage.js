import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../api/patientAPI.js";
import PatientForm from "../components/PatientDetails/PatientForm.js";

const AddPatientPage = () => {
  const [newPatient, setNewPatient] = useState({});
  const navigate = useNavigate();

  // 🔧 Fonction pour nettoyer et formater les données avant envoi
  const sanitizePatientData = (data) => ({
    ...data,
    birthdate: data.birthdate
      ? new Date(data.birthdate + "T00:00:00.000Z").toISOString()
      : null,
    childrenCount:
      data.childrenCount !== "" && !isNaN(data.childrenCount)
        ? parseInt(data.childrenCount, 10)
        : null,
  });

  const handleAddPatient = async () => {
    try {
      const preparedData = sanitizePatientData(newPatient);
      await createPatient(preparedData);
      navigate("/patients");
    } catch (err) {
      console.error("Erreur lors de l'ajout du patient :", err);
      alert("Une erreur est survenue lors de l'ajout du patient.");
    }
  };

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  return (
    <PatientForm
      patientData={newPatient}
      handleChange={handleChange}
      handleSubmit={handleAddPatient}
      isEditing={false}
    />
  );
};

export default AddPatientPage;
