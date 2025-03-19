import React, { useState } from "react";

const PatientReferences = ({ patient, handleChange, handleSave }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [newEntry, setNewEntry] = useState({});

  // 🟢 Activer l'édition pour une entrée spécifique ou ajouter une nouvelle entrée
  const handleEdit = (index, type) => {
    setEditingIndex(index);
    setEditingType(type);

    if (index !== null) {
      setNewEntry(type === "references" ? patient.references[index] : patient.contacts[index]);
    } else {
      setNewEntry({
        dispensateurNom: "",
        dispensateurPrenom: "",
        dispensateurType: "",
        dispensateurINAMI: "",
        dispensateurTelephone: "",
        dispensateurEmail: "",
        contactNom: "",
        contactPrenom: "",
        contactRelation: "",
        contactTelephone: "",
        contactEmail: "",
        contactCommentaire: ""
      });
    }
  };

  // 🟢 Fermer le formulaire quand on clique sur "Annuler"
  const handleCancel = () => {
    setEditingIndex(null);
    setEditingType(null);
    setNewEntry({});
  };



  // 🟢 Gérer les changements dans le formulaire
  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  // 🟢 Enregistrer une nouvelle entrée ou modification
  const handleSaveEntry = (type) => {
    let updatedList = [...(patient[type] || [])];

    if (editingIndex !== null) {
      updatedList[editingIndex] = newEntry;
    } else {
      updatedList.push(newEntry);
    }

    handleChange({ target: { name: type, value: updatedList } });

    setEditingIndex(null);
    setEditingType(null);
    setNewEntry({});
    handleSave();
  };

  // 🟢 Supprimer une entrée avec confirmation
  const handleDelete = (index, type) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      let updatedList = [...(patient[type] || [])];
      updatedList.splice(index, 1);
      handleChange({ target: { name: type, value: updatedList } });
      handleSave();
    }
  };

  return (
    <div className="h-full overflow-y-auto w-full bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">Références et Contacts</h4>

      <div className="flex-grow overflow-auto p-2">
        {/* 🟦 Tableau des Dispensateurs de soin */}
        <div className="relative mb-8">
          <h5 className="text-lg font-semibold text-gray-700 mb-3">Références et Contacts</h5>
          <button className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => handleEdit(null, "references")}>
            {editingType === "references" ? "Annuler" : "Ajouter"}
          </button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Prénom</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">INAMI</th>
                <th className="border border-gray-300 px-4 py-2">Téléphone</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(patient.references || []).map((ref, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="px-4 py-2">{ref.dispensateurNom}</td>
                  <td className="px-4 py-2">{ref.dispensateurPrenom}</td>
                  <td className="px-4 py-2">{ref.dispensateurType}</td>
                  <td className="px-4 py-2">{ref.dispensateurINAMI}</td>
                  <td className="px-4 py-2">{ref.dispensateurTelephone}</td>
                  <td className="px-4 py-2">{ref.dispensateurEmail}</td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <button className="text-blue-500 hover:underline" onClick={() => handleEdit(index, "references")}>✏️</button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(index, "references")}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingType === "references" && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <input type="text" name="dispensateurNom" placeholder="Nom" value={newEntry.dispensateurNom || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="dispensateurPrenom" placeholder="Prénom" value={newEntry.dispensateurPrenom || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="dispensateurType" placeholder="Type" value={newEntry.dispensateurType || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="dispensateurINAMI" placeholder="INAMI" value={newEntry.dispensateurINAMI || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" />
              <input type="text" name="dispensateurTelephone" placeholder="Téléphone" value={newEntry.dispensateurTelephone || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="dispensateurEmail" placeholder="Email" value={newEntry.dispensateurEmail || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" />
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => handleSaveEntry("references")}>
                Enregistrer
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ml-2" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* 🟦 Tableau des Autres Contacts */}
        <div className="relative">
          <h5 className="text-lg font-semibold text-gray-700 mb-3">Données Santé</h5>
          <button className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => handleEdit(null, "contacts")}>
            {editingType === "contacts" ? "Annuler" : "Ajouter"}
          </button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Prénom</th>
                <th className="border border-gray-300 px-4 py-2">Relation</th>
                <th className="border border-gray-300 px-4 py-2">Téléphone</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Commentaire</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(patient.contacts || []).map((contact, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="px-4 py-2">{contact.contactNom}</td>
                  <td className="px-4 py-2">{contact.contactPrenom}</td>
                  <td className="px-4 py-2">{contact.contactRelation}</td>
                  <td className="px-4 py-2">{contact.contactTelephone}</td>
                  <td className="px-4 py-2">{contact.contactEmail}</td>
                  <td className="px-4 py-2 whitespace-pre-wrap break-words">{contact.contactCommentaire}</td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <button className="text-blue-500 hover:underline" onClick={() => handleEdit(index, "contacts")}>✏️</button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(index, "contacts")}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingType === "contacts" && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <input type="text" name="contactNom" placeholder="Nom" value={newEntry.contactNom || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="contactPrenom" placeholder="Prénom" value={newEntry.contactPrenom || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="contactRelation" placeholder="Relation" value={newEntry.contactRelation || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="contactTelephone" placeholder="Téléphone" value={newEntry.contactTelephone || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" required />
              <input type="text" name="contactEmail" placeholder="Email" value={newEntry.contactEmail || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" />
              <textarea name="contactCommentaire" placeholder="Commentaire" value={newEntry.contactCommentaire || ""} onChange={handleEntryChange} className="border p-2 rounded w-full mb-2" />
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => handleSaveEntry("contacts")}>
                Enregistrer
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 ml-2" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReferences;