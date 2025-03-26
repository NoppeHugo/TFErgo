import React, { useEffect, useState } from "react";
import {
  getPatientNotes,
  addNoteToPatient,
  updateNote,
  deleteNote,
} from "../../api/noteAPI.js";

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
        const notesList = await getPatientNotes(patient.id);
        setNotes(notesList || []);
      } catch (error) {
        console.error("Error loading notes:", error);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [patient?.id]);

  const handleAddNote = async () => {
    if (!newTitle.trim() || !newText.trim() || !patient?.id) return;

    setLoading(true);
    try {
      const noteData = {
        title: newTitle,
        description: newText,
      };

      const newNote = await addNoteToPatient(patient.id, noteData);
      setNotes((prev) => [newNote, ...prev]);
      setNewTitle("");
      setNewText("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
    setLoading(false);
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditText(note.description);
  };

  const handleSaveEdit = async (noteId) => {
    try {
      await updateNote(noteId, {
        title: editTitle,
        description: editText,
      });

      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, title: editTitle, description: editText }
            : note
        )
      );
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditText("");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Notes</h3>

      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Note"}
      </button>

      {showForm && (
        <div className="mb-4 border p-4 rounded-lg bg-gray-100">
          <input
            type="text"
            className="w-full mb-2 border rounded-lg p-2"
            placeholder="Note title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full mb-2 border rounded-lg p-2"
            placeholder="Note description"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handleAddNote}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      )}

      {notes.length > 0 ? (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="border-b pb-4">
              {editingNoteId === note.id ? (
                <>
                  <input
                    className="w-full mb-2 border rounded-lg p-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full mb-2 border rounded-lg p-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-lg"
                      onClick={() => handleSaveEdit(note.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-1 rounded-lg"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">{note.title}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(note.noteDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-gray-700">{note.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notes available.</p>
      )}
    </div>
  );
};

export default PatientNotesTab;
