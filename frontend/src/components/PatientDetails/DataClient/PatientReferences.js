import { useEffect, useState } from "react";
import {
  getPatientContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../../../api/contactAPI.js";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const PatientReferences = ({ patient }) => {
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [formType, setFormType] = useState("reference");

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
    <div className="flex flex-col grow overflow-y-auto space-y-8 px-2">
      {(editing !== null || isNew) && (
        <div className="bg-gray-100 p-4 rounded mb-2 space-y-2">
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

      {[{ title: "Références", data: references, type: "reference" }, { title: "Contacts Personnels", data: personals, type: "personal" }].map(({ title, data, type }) => (
        <div key={type}>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => startEdit(null, type)}>
              Ajouter
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar rounded border">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {type === "reference" ? (
                    <>
                      <th className="p-2">Nom</th>
                      <th className="p-2">Prénom</th>
                      <th className="p-2">INAMI</th>
                      <th className="p-2">Téléphone</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="p-2">Nom</th>
                      <th className="p-2">Prénom</th>
                      <th className="p-2">Relation</th>
                      <th className="p-2">Téléphone</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Commentaire</th>
                      <th className="p-2">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-2">{c.lastName}</td>
                    <td className="p-2">{c.firstName}</td>
                    {type === "reference" ? (
                      <>
                        <td className="p-2">{c.inami}</td>
                        <td className="p-2">{c.phone}</td>
                        <td className="p-2">{c.email}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{c.relation}</td>
                        <td className="p-2">{c.phone}</td>
                        <td className="p-2">{c.email}</td>
                        <td className="p-2">{c.comment}</td>
                      </>
                    )}
                    <td className="p-2 flex gap-2">
                      <button title="Modifier" onClick={() => startEdit(c, type)}>
                        <FiEdit2 className="text-blue-600" />
                      </button>
                      <button title="Supprimer" onClick={() => handleDelete(c.id)}>
                        <FiTrash2 className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientReferences;
