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
          <p><strong>NISS:</strong> {patient.niss}</p>
          <p><strong>Titre:</strong> {patient.titre}</p>
          <p><strong>Sexe:</strong> {patient.sexe}</p>
          <p><strong>Langue:</strong> {patient.langue}</p>
          <p><strong>Naissance:</strong> {patient.dateNaissance}</p>
          <p><strong>Nationalité:</strong> {patient.nationalite}</p>
          <p><strong>Adresse:</strong> {patient.adresse}</p>
          <p><strong>Téléphone 1:</strong> {patient.telephone1}</p>
          <p><strong>Téléphone 2:</strong> {patient.telephone2}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Mutuelle:</strong> {patient.mutuelle}</p>
          <p><strong>CT1/CT2:</strong> {patient.ct1_ct2}</p>
          <p><strong>Tiers Payant:</strong> {patient.tiersPayant}</p>
          <p><strong>Médecin de famille:</strong> {patient.medecinFamille}</p>
          <p><strong>Profession:</strong> {patient.profession}</p>
          <p><strong>Nombre d'enfants:</strong> {patient.nbrEnfants}</p>
          <p><strong>Facturer à:</strong> {patient.facturerA}</p>
          <p><strong>Zone de résidence:</strong> {patient.zoneResidence}</p>
          <p><strong>État civil:</strong> {patient.etatCivil}</p>
        </div>
      )}

      {/* 🟦 Bouton Modifier */}
      {!isEditing && (
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={() => setIsEditing(true)}>
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetailsTab;
