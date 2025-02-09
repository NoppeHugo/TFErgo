import React, { useState } from "react";

const PatientReferences = ({ patient, handleChange, handleSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="h-full overflow-y-auto">
      <h4 className="text-lg font-semibold mb-4">Références et Contacts</h4>
      {isEditing ? (
        <div>
          <div className="mb-4">
            <h5 className="text-md font-semibold">Dispensateurs de soin</h5>
            <input type="text" name="dispensateurNom" placeholder="Nom" value={patient.dispensateurNom || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="dispensateurPrenom" placeholder="Prénom" value={patient.dispensateurPrenom || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="dispensateurType" placeholder="Type" value={patient.dispensateurType || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="dispensateurINAMI" placeholder="INAMI" value={patient.dispensateurINAMI || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="dispensateurTelephone" placeholder="Téléphone" value={patient.dispensateurTelephone || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="email" name="dispensateurEmail" placeholder="Email" value={patient.dispensateurEmail || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          </div>
          <div>
            <h5 className="text-md font-semibold">Autres contacts</h5>
            <input type="text" name="contactNom" placeholder="Nom" value={patient.contactNom || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="contactPrenom" placeholder="Prénom" value={patient.contactPrenom || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="contactRelation" placeholder="Relation" value={patient.contactRelation || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="text" name="contactTelephone" placeholder="Téléphone" value={patient.contactTelephone || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <input type="email" name="contactEmail" placeholder="Email" value={patient.contactEmail || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
            <textarea name="contactCommentaire" placeholder="Commentaire" value={patient.contactCommentaire || ""} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4" onClick={() => { handleSave(); handleEditToggle(); }}>
            Enregistrer
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mt-4 ml-2" onClick={handleEditToggle}>
            Annuler
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h5 className="text-md font-semibold">Dispensateurs de soin</h5>
            <p className="max-w-md break-words"><strong>Nom:</strong> {patient.dispensateurNom}</p>
            <p className="max-w-md break-words"><strong>Prénom:</strong> {patient.dispensateurPrenom}</p>
            <p className="max-w-md break-words"><strong>Type:</strong> {patient.dispensateurType}</p>
            <p className="max-w-md break-words"><strong>INAMI:</strong> {patient.dispensateurINAMI}</p>
            <p className="max-w-md break-words"><strong>Téléphone:</strong> {patient.dispensateurTelephone}</p>
            <p className="max-w-md break-words"><strong>Email:</strong> {patient.dispensateurEmail}</p>
          </div>
          <div>
            <h5 className="text-md font-semibold">Autres contacts</h5>
            <p className="max-w-md break-words"><strong>Nom:</strong> {patient.contactNom}</p>
            <p className="max-w-md break-words"><strong>Prénom:</strong> {patient.contactPrenom}</p>
            <p className="max-w-md break-words"><strong>Relation:</strong> {patient.contactRelation}</p>
            <p className="max-w-md break-words"><strong>Téléphone:</strong> {patient.contactTelephone}</p>
            <p className="max-w-md break-words"><strong>Email:</strong> {patient.contactEmail}</p>
            <p className="max-w-md break-words"><strong>Commentaire:</strong> {patient.contactCommentaire}</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4" onClick={handleEditToggle}>
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientReferences;