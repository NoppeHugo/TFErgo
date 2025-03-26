import { useEffect, useState } from "react";
import {
  getPatientContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../../../api/contactAPI.js";

const PatientReferences = ({ patient }) => {
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [formType, setFormType] = useState("reference"); // Pour savoir dans quel tableau afficher le formulaire

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    relation: "",
    inami: "",
    phone: "",
    email: "",
    comment: "",
  });

  useEffect(() => {
    if (patient?.id) loadContacts();
  }, [patient]);

  const loadContacts = async () => {
    try {
      const data = await getPatientContacts(patient.id);
      setContacts(data);
    } catch (err) {
      console.error("Erreur chargement contacts:", err);
    }
  };

  const startEdit = (contact = null, type = "reference") => {
    setFormType(type);
    if (contact) {
      setForm(contact);
      setEditing(contact.id);
      setIsNew(false);
    } else {
      setForm({
        firstName: "",
        lastName: "",
        relation: "",
        inami: "",
        phone: "",
        email: "",
        comment: "",
      });
      setEditing(null);
      setIsNew(true);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsNew(false);
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveContact = async () => {
    const contactData = { ...form, type: formType };

    try {
      if (isNew) {
        await addContact(patient.id, contactData);
      } else {
        await updateContact(editing, contactData);
      }
      await loadContacts();
      cancelEdit();
    } catch (err) {
      console.error("Erreur sauvegarde contact:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce contact ?")) {
      try {
        await deleteContact(id);
        await loadContacts();
      } catch (err) {
        console.error("Erreur suppression contact:", err);
      }
    }
  };

  const references = contacts.filter((c) => c.type === "reference");
  const personals = contacts.filter((c) => c.type === "personal");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Références et Contacts
      </h3>

      {/* Formulaire affiché en haut du bon tableau */}
      {(editing !== null || isNew) && (
        <div className="bg-gray-100 p-4 rounded mb-6 space-y-2">
          <input name="firstName" value={form.firstName || ""} onChange={handleChange} placeholder="Prénom" className="w-full p-2 border rounded" />
          <input name="lastName" value={form.lastName || ""} onChange={handleChange} placeholder="Nom" className="w-full p-2 border rounded" />
          {formType === "personal" && (
            <input name="relation" value={form.relation || ""} onChange={handleChange} placeholder="Relation" className="w-full p-2 border rounded" />
          )}
          {formType === "reference" && (
            <input name="inami" value={form.inami || ""} onChange={handleChange} placeholder="INAMI" className="w-full p-2 border rounded" />
          )}
          <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Téléphone" className="w-full p-2 border rounded" />
          <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
          <textarea name="comment" value={form.comment || ""} onChange={handleChange} placeholder="Commentaire" className="w-full p-2 border rounded" />

          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={saveContact} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer</button>
            <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Annuler</button>
          </div>
        </div>
      )}

      {/* Références */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold text-gray-700">Références et Contacts</h4>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => startEdit(null, "reference")}>
            Ajouter Référence
          </button>
        </div>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Nom</th>
              <th className="p-2">Prénom</th>
              <th className="p-2">Type</th>
              <th className="p-2">INAMI</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {references.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.lastName}</td>
                <td className="p-2">{c.firstName}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">{c.inami}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">
                  <button className="text-blue-600" onClick={() => startEdit(c, "reference")}>✏️</button>
                  <button className="text-red-600 ml-2" onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contacts personnels */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold text-gray-700">Contacts Personnels</h4>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => startEdit(null, "personal")}>
            Ajouter Contact Personnel
          </button>
        </div>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Nom</th>
              <th className="p-2">Prénom</th>
              <th className="p-2">Relation</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Commentaire</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {personals.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.lastName}</td>
                <td className="p-2">{c.firstName}</td>
                <td className="p-2">{c.relation}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.comment}</td>
                <td className="p-2">
                  <button className="text-blue-600" onClick={() => startEdit(c, "personal")}>✏️</button>
                  <button className="text-red-600 ml-2" onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientReferences;
