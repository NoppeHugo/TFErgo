import React from "react";

const PatientForm = ({ patientData, handleChange, handleSubmit, isEditing, setIsEditing }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{isEditing ? "Modifier le Patient" : "Ajouter un Patient"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={patientData.firstName || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={patientData.lastName || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        
        <input type="text" name="niss" placeholder="NISS" value={patientData.niss || ""} onChange={handleChange} className="border p-2 rounded" />

        <select name="title" value={patientData.title || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Titre</option>
          <option value="M.">M.</option>
          <option value="Mme">Mme</option>
          <option value="Dr">Dr</option>
        </select>

        <select name="sex" value={patientData.sex || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Sexe</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Autre">Autre</option>
        </select>

        <input type="text" name="language" placeholder="Langue" value={patientData.language || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="birthdate" placeholder="Naissance" value={patientData.birthdate || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="nationality" placeholder="Nationalité" value={patientData.nationality || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Adresse" value={patientData.address || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="phone1" placeholder="Téléphone 1" value={patientData.phone1 || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="phone2" placeholder="Téléphone 2" value={patientData.phone2 || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={patientData.email || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="familyDoctor" placeholder="Médecin de famille" value={patientData.familyDoctor || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="profession" placeholder="Profession" value={patientData.profession || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="childrenCount" placeholder="Nombre d'enfants" value={patientData.childrenCount || ""} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="billingInfo" placeholder="Facturer à" value={patientData.billingInfo || ""} onChange={handleChange} className="border p-2 rounded" />

        <select name="residenceZone" value={patientData.residenceZone || ""} onChange={handleChange} className="border p-2 rounded">
          <option value="">Zone de résidence</option>
          <option value="Bruxelles">Bruxelles</option>
          <option value="Wallonie">Wallonie</option>
          <option value="Flandre">Flandre</option>
          <option value="Autre">Autre</option>
        </select>

        <select name="maritalStatus" value={patientData.maritalStatus || ""} onChange={handleChange} className="border p-2 rounded">
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
