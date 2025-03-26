import React from "react";
import PatientForm from "./PatientForm.js";

const PatientDetailsTab = ({ patient, isEditing, updatedPatient, handleChange, handleUpdate, setIsEditing }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Détails du Patient</h3>

      {isEditing ? (
        <PatientForm
          patientData={updatedPatient}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEditing={true}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
          <p><strong>Nom:</strong> {patient.lastName}</p>
          <p><strong>Prénom:</strong> {patient.firstName}</p>
          <p><strong>NISS:</strong> {patient.niss}</p>
          <p><strong>Titre:</strong> {patient.title}</p>
          <p><strong>Sexe:</strong> {patient.sex}</p>
          <p><strong>Langue:</strong> {patient.language}</p>
          <p><strong>Naissance:</strong> {patient.birthdate ? new Date(patient.birthdate).toISOString().split("T")[0] : "Non renseignée"}</p>
          <p><strong>Nationalité:</strong> {patient.nationality}</p>
          <p><strong>Adresse:</strong> {patient.address}</p>
          <p><strong>Téléphone 1:</strong> {patient.phone1}</p>
          <p><strong>Téléphone 2:</strong> {patient.phone2}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Mutuelle:</strong> {patient.insurance}</p>
          <p><strong>Médecin de famille:</strong> {patient.familyDoctor}</p>
          <p><strong>Profession:</strong> {patient.profession}</p>
          <p><strong>Nombre d'enfants:</strong> {patient.childrenCount}</p>
          <p><strong>Facturer à:</strong> {patient.billingInfo}</p>
          <p><strong>Zone de résidence:</strong> {patient.residenceZone}</p>
          <p><strong>État civil:</strong> {patient.maritalStatus}</p>
        </div>
      )}

      {!isEditing && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetailsTab;
