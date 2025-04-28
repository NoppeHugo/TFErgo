import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../api/patientAPI.js";
import PatientForm from "../components/PatientDetails/PatientForm.js";

const AddPatientPage = () => {
  const [newPatient, setNewPatient] = useState({});
  const [errors, setErrors] = useState({});
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

  // ✅ Validation des données
  const validatePatientData = (data) => {
    const validationErrors = {};

    if (!data.firstName?.trim()) validationErrors.firstName = "Le prénom est obligatoire.";
    if (!data.lastName?.trim()) validationErrors.lastName = "Le nom est obligatoire.";
    if (!data.sex) validationErrors.sex = "Le sexe est obligatoire.";
    if (!data.birthdate) validationErrors.birthdate = "La date de naissance est obligatoire.";
    if (data.birthdate && new Date(data.birthdate) > new Date()) validationErrors.birthdate = "La date de naissance ne peut pas être dans le futur.";
    if (data.niss && !/^\d{11}$/.test(data.niss)) validationErrors.niss = "Le NISS doit contenir exactement 11 chiffres.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleAddPatient = async () => {
    const preparedData = sanitizePatientData(newPatient);
    const isValid = validatePatientData(preparedData);

    if (!isValid) {
      alert("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }

    try {
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
      errors={errors} // 🔥 Passe les erreurs au PatientForm
    />
  );
};

export default AddPatientPage;
