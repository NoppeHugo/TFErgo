import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

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
      const docRef = await addDoc(collection(db, "patients"), newPatient);
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
          <input 
            type="text" 
            name="nom"
            placeholder="Nom" 
            value={newPatient.nom} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="prenom"
            placeholder="Prénom" 
            value={newPatient.prenom} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="niss"
            placeholder="NISS" 
            value={newPatient.niss} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="date" 
            name="dateNaissance"
            placeholder="Date de Naissance" 
            value={newPatient.dateNaissance} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="adresse"
            placeholder="Adresse" 
            value={newPatient.adresse} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="telephone1"
            placeholder="Téléphone 1" 
            value={newPatient.telephone1} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="telephone2"
            placeholder="Téléphone 2" 
            value={newPatient.telephone2} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={newPatient.email} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="mutuelle"
            placeholder="Mutuelle" 
            value={newPatient.mutuelle} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="ct1_ct2"
            placeholder="CT1/CT2" 
            value={newPatient.ct1_ct2} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="tiersPayant"
            placeholder="Tiers Payant" 
            value={newPatient.tiersPayant} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="medecinFamille"
            placeholder="Médecin de Famille" 
            value={newPatient.medecinFamille} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="profession"
            placeholder="Profession" 
            value={newPatient.profession} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="number" 
            name="nbrEnfants"
            placeholder="Nombre d'Enfants" 
            value={newPatient.nbrEnfants} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="facturerA"
            placeholder="Facturer à" 
            value={newPatient.facturerA} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="zoneResidence"
            placeholder="Zone de Résidence" 
            value={newPatient.zoneResidence} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="etatCivil"
            placeholder="État Civil" 
            value={newPatient.etatCivil} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
        </div>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4"
          onClick={handleAddPatient}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
};

export default AddPatientPage;