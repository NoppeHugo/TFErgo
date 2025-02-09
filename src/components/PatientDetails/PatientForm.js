import React from "react";

const PatientForm = ({ patientData, handleChange, handleSubmit, isEditing, setIsEditing }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{isEditing ? "Modifier le Patient" : "Ajouter un Patient"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="nom" placeholder="Nom" value={patientData.nom || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="prenom" placeholder="Prénom" value={patientData.prenom || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="niss" placeholder="NISS" value={patientData.niss || ""} onChange={handleChange} className="border p-2 rounded" />
        
        <select name="titre" value={patientData.titre || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Titre</option>
          <option value="M.">M.</option>
          <option value="Mme">Mme</option>
          <option value="Dr">Dr</option>
        </select>

        <select name="sexe" value={patientData.sexe || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Sexe</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Autre">Autre</option>
        </select>

        <input type="text" name="langue" placeholder="Langue" value={patientData.langue || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="dateNaissance" placeholder="Naissance" value={patientData.dateNaissance || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="nationalite" placeholder="Nationalité" value={patientData.nationalite || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="adresse" placeholder="Adresse" value={patientData.adresse || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="telephone1" placeholder="Téléphone 1" value={patientData.telephone1 || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="telephone2" placeholder="Téléphone 2" value={patientData.telephone2 || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={patientData.email || ""} onChange={handleChange} className="border p-2 rounded" />

        <select name="mutuelle" value={patientData.mutuelle || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Mutuelle</option>
          <option value="Mutualité chrétienne">Mutualité chrétienne</option>
          <option value="Solidaris">Solidaris</option>
          <option value="Autre">Autre</option>
        </select>

        <input type="text" name="ct1_ct2" placeholder="CT1/CT2" value={patientData.ct1_ct2 || ""} onChange={handleChange} className="border p-2 rounded" />

        <select name="tiersPayant" value={patientData.tiersPayant || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Tiers Payant</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>

        <input type="text" name="medecinFamille" placeholder="Médecin de famille" value={patientData.medecinFamille || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="profession" placeholder="Profession" value={patientData.profession || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="nbrEnfants" placeholder="Nombre d'enfants" value={patientData.nbrEnfants || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="facturerA" placeholder="Facturer à" value={patientData.facturerA || ""} onChange={handleChange} className="border p-2 rounded" />

        <select name="zoneResidence" value={patientData.zoneResidence || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Zone de résidence</option>
          <option value="Bruxelles">Bruxelles</option>
          <option value="Wallonie">Wallonie</option>
          <option value="Flandre">Flandre</option>
          <option value="Autre">Autre</option>
        </select>

        <select name="etatCivil" value={patientData.etatCivil || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">État civil</option>
          <option value="Célibataire">Célibataire</option>
          <option value="Marié(e)">Marié(e)</option>
          <option value="Divorcé(e)">Divorcé(e)</option>
          <option value="Veuf(ve)">Veuf(ve)</option>
        </select>
      </div>

      <div className="mt-4 flex space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleSubmit}>
          {isEditing ? "Enregistrer" : "Ajouter"}
        </button>
        {isEditing && (
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={() => setIsEditing(false)}>
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientForm;