import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../firebase/patientsFirestore.js";

const AddPatientPage = () => {
  const [newPatient, setNewPatient] = useState({
    nom: "",
    prenom: "",
    niss: "",
    dateNaissance: "",
    adresse: "",
    telephone1: "",
    telephone2: "",
    email: "",
    mutuelle: "",
    ct1_ct2: "",
    tiersPayant: "",
    medecinFamille: "",
    profession: "",
    nbrEnfants: "",
    facturerA: "",
    zoneResidence: "",
    etatCivil: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleAddPatient = async () => {
    if (!newPatient.nom || !newPatient.prenom) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addPatient(newPatient);
      setSuccess("Patient ajouté avec succès !");
      setTimeout(() => {
        navigate("/patients");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient :", error);
      setError("Erreur lors de l'ajout du patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-4">Ajouter un Patient</h1>
      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nom" placeholder="Nom" value={newPatient.nom} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="prenom" placeholder="Prénom" value={newPatient.prenom} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4" onClick={handleAddPatient} disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
};

export default AddPatientPage;
