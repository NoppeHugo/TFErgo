import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../api/patientAPI.js";
import PatientForm from "../components/PatientDetails/PatientForm.js";

const AddPatientPage = () => {
  const [newPatient, setNewPatient] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Nettoyage des données avant envoi
  const sanitizePatientData = (data) => {
    const cleaned = { ...data };

    // birthdate → ISO string ou null
    if (!cleaned.birthdate || cleaned.birthdate === "") {
      cleaned.birthdate = null;
    } else {
      cleaned.birthdate = new Date(cleaned.birthdate + "T00:00:00.000Z").toISOString();
    }

    // childrenCount → Int ou null
    if (!cleaned.childrenCount || cleaned.childrenCount === "") {
      cleaned.childrenCount = null;
    } else {
      const parsed = parseInt(cleaned.childrenCount, 10);
      cleaned.childrenCount = isNaN(parsed) ? null : parsed;
    }

    // Chaînes vides → null
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "") cleaned[key] = null;
    });

    return cleaned;
  };

  // ✅ Validation minimale des champs obligatoires
  const validatePatientData = (data) => {
    const validationErrors = {};

    if (!data.firstName?.trim()) validationErrors.firstName = "Le prénom est obligatoire.";
    if (!data.lastName?.trim()) validationErrors.lastName = "Le nom est obligatoire.";
    if (!data.sex) validationErrors.sex = "Le sexe est obligatoire.";
    if (!data.birthdate) validationErrors.birthdate = "La date de naissance est obligatoire.";
    if (data.birthdate && new Date(data.birthdate) > new Date()) {
      validationErrors.birthdate = "La date de naissance ne peut pas être dans le futur.";
    }
    if (data.niss && !/^\d{11}$/.test(data.niss)) {
      validationErrors.niss = "Le NISS doit contenir exactement 11 chiffres.";
    }

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
      errors={errors}
    />
  );
};

export default AddPatientPage;
