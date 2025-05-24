import { useEffect, useState } from "react";
import {
  getPatientContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../../../api/contactAPI.js";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Notification Toast
function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-dark2GreenErgogo text-white px-6 py-3 rounded shadow-lg animate-fade-in-out flex items-center gap-2">
        <span role="img" aria-label="copié">📋</span>
        {message}
        <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
      </div>
    </div>
  );
}

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

  const [toast, setToast] = useState(null);

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`Copié : ${text}`);
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error("Erreur de copie :", err);
    }
  };


  return (
    <div className="flex flex-col grow overflow-y-auto space-y-8 px-2">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
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
            <button className="bg-middleBlueErgogo text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={() => startEdit(null, type)}>
              Ajouter
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-[#e7ecff] to-[#c8d6ff] text-[#2f3e76] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Prénom</th>
                  <th className="px-4 py-3">{type === "reference" ? "INAMI" : "Relation"}</th>
                  <th className="px-4 py-3">Téléphone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Commentaire</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400 italic">Aucun contact</td>
                  </tr>
                ) : (
                  data.map((c, idx) => (
                    <tr key={c.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                      <td className="px-4 py-2 font-semibold text-gray-800">{c.lastName}</td>
                      <td className="px-4 py-2 text-gray-800">{c.firstName}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {type === "reference" ? c.inami : c.relation}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{c.phone}</td>
                      <td
                        className="p-2 text-gray-800 cursor-pointer hover:text-dark2GreenErgogo transition"
                        onClick={() => copyToClipboard(c.email)}
                        title="Clique pour copier"
                      >
                        {c.email}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{c.comment}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            title="Modifier"
                            onClick={() => startEdit(c, type)}
                            className="p-1 rounded hover:bg-blue-100 transition"
                          >
                            <FiEdit2 className="text-blue-600" />
                          </button>
                          <button
                            title="Supprimer"
                            onClick={() => handleDelete(c.id)}
                            className="p-1 rounded hover:bg-red-100 transition"
                          >
                            <FiTrash2 className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientReferences;

// Animation CSS (à ajouter dans index.css ou App.css)
// .animate-fade-in-out {
//   animation: fadeInOut 2s;
// }
// @keyframes fadeInOut {
//   0% { opacity: 0; transform: translateY(20px); }
//   10% { opacity: 1; transform: translateY(0); }
//   90% { opacity: 1; transform: translateY(0); }
//   100% { opacity: 0; transform: translateY(-10px); }
// }