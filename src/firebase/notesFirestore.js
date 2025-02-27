import { db } from "./firebaseConfig.js";
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

// 🔹 Ajouter une note à un patient
export const addNoteToPatient = async (patientId, noteData) => {
  try {
    const docRef = await addDoc(collection(db, `patients/${patientId}/notes`), noteData);
    return { id: docRef.id, ...noteData };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la note :", error);
    return null;
  }
};

// 🔹 Récupérer les notes d'un patient
export const getPatientNotes = async (patientId) => {
  try {
    const snapshot = await getDocs(collection(db, `patients/${patientId}/notes`));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des notes :", error);
    return [];
  }
};

// 🔹 Mettre à jour une note
export const updateNote = async (patientId, noteId, updatedData) => {
  try {
    await updateDoc(doc(db, `patients/${patientId}/notes/${noteId}`), updatedData);
    console.log("✅ Note mise à jour avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la note :", error);
  }
};

// 🔹 Supprimer une note
export const deleteNote = async (patientId, noteId) => {
  try {
    await deleteDoc(doc(db, `patients/${patientId}/notes/${noteId}`));
    console.log("✅ Note supprimée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la note :", error);
  }
};