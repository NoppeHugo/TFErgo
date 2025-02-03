import React, { useEffect, useState } from "react";
import { getPatientNotes, addNoteToPatient, updateNote } from "../../firebase/notesFirestore.js";

const PatientNotesTab = ({ patient }) => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!patient?.id) return;

    const fetchNotes = async () => {
      try {
        console.log("🔍 Récupération des notes pour le patient :", patient.id);
        const notesList = await getPatientNotes(patient.id);

        // S'assurer que notesList est bien un tableau et filtrer les notes invalides
        const validNotes = Array.isArray(notesList) ? notesList.filter(note => note && note.titre) : [];

        console.log("📜 Notes récupérées :", validNotes);
        setNotes(validNotes);
        
      } catch (error) {
        console.error("❌ Erreur lors du chargement des notes :", error);
        setNotes([]); // 🔹 Évite un état undefined
      }
    };

    fetchNotes();
  }, [patient?.id]);

  const handleAddNote = async () => {
    if (newTitle.trim() === "" || newText.trim() === "" || !patient?.id) return;

    setLoading(true);
    try {
      const noteData = {
        titre: newTitle,
        texte: newText || "Pas de texte",
        date: new Date().toISOString(),
      };

      await addNoteToPatient(patient.id, noteData);

      setNotes((prevNotes) => [...prevNotes, noteData]);
      setNewTitle("");
      setNewText("");
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la note :", error);
    }
    setLoading(false);
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.titre);
    setEditText(note.texte);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditText("");
  };

  const handleSaveEdit = async (noteId) => {
    try {
      await updateNote(patient.id, noteId, { titre: editTitle, texte: editText });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, titre: editTitle, texte: editText } : note
        )
      );
      setEditingNoteId(null);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la note :", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Carnet de notes</h3>

      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Annuler" : "Ajouter une note"}
      </button>

      {showForm && (
        <div className="mb-4 border p-4 rounded-lg bg-gray-100">
          <input
            type="text"
            className="w-full mb-2 border rounded-lg p-2"
            placeholder="Titre de la note"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full mb-2 border rounded-lg p-2"
            placeholder="Écrire une note..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handleAddNote}
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      )}

      <div className="mt-4">
        {Array.isArray(notes) && notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li key={index} className="border-b py-2">
                {editingNoteId === note.id ? (
                  <div className="mb-2">
                    <input
                      type="text"
                      className="w-full mb-2 border rounded-lg p-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full mb-2 border rounded-lg p-2"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        onClick={() => handleSaveEdit(note.id)}
                      >
                        Enregistrer
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={handleCancelEdit}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-600">{note?.titre || "Sans titre"}</span>
                      <span className="text-gray-500 text-sm">
                        {note?.date ? new Date(note.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }) : "Date inconnue"}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm">{note?.texte || "Pas de texte"}</p>

                    <button
                      className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      onClick={() => handleEdit(note)}
                    >
                      Modifier
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucune note pour ce patient.</p>
        )}
      </div>
    </div>
  );
};

export default PatientNotesTab;
