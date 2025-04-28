import React from "react";

const PatientForm = ({ patientData, handleChange, handleSubmit, isEditing, setIsEditing, errors = {} }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">{isEditing ? "Modifier le Patient" : "Ajouter un Patient"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={patientData.firstName || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={patientData.lastName || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <input
            type="text"
            name="niss"
            placeholder="NISS"
            value={patientData.niss || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.niss && <p className="text-red-500 text-xs mt-1">{errors.niss}</p>}
        </div>

        <div>
          <select
            name="title"
            value={patientData.title || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Titre</option>
            <option value="M.">M.</option>
            <option value="Mme">Mme</option>
            <option value="Dr">Dr</option>
          </select>
        </div>

        <div>
          <select
            name="sex"
            value={patientData.sex || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
        </div>

        <input
          type="text"
          name="language"
          placeholder="Langue"
          value={patientData.language || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <div>
          <input
            type="date"
            name="birthdate"
            placeholder="Naissance"
            value={patientData.birthdate || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
        </div>

        <input
          type="text"
          name="nationality"
          placeholder="Nationalité"
          value={patientData.nationality || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={patientData.address || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="phone1"
          placeholder="Téléphone 1"
          value={patientData.phone1 || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="phone2"
          placeholder="Téléphone 2"
          value={patientData.phone2 || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={patientData.email || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="familyDoctor"
          placeholder="Médecin de famille"
          value={patientData.familyDoctor || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          value={patientData.profession || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="childrenCount"
          placeholder="Nombre d'enfants"
          value={patientData.childrenCount || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="billingInfo"
          placeholder="Facturer à"
          value={patientData.billingInfo || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <select
          name="residenceZone"
          value={patientData.residenceZone || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Zone de résidence</option>
          <option value="Bruxelles">Bruxelles</option>
          <option value="Wallonie">Wallonie</option>
          <option value="Flandre">Flandre</option>
          <option value="Autre">Autre</option>
        </select>

        <select
          name="maritalStatus"
          value={patientData.maritalStatus || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">État civil</option>
          <option value="Célibataire">Célibataire</option>
          <option value="Marié(e)">Marié(e)</option>
          <option value="Divorcé(e)">Divorcé(e)</option>
          <option value="Veuf(ve)">Veuf(ve)</option>
        </select>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          className="bg-[#B5C99A] text-white px-4 py-2 rounded-lg hover:bg-[#97A97C]"
          onClick={handleSubmit}
        >
          {isEditing ? "Enregistrer" : "Ajouter"}
        </button>
        {isEditing && (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientForm;
