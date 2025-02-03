import { db } from "./firebaseConfig.js";
import { collection, doc, addDoc, getDocs, updateDoc } from "firebase/firestore";

// Ajouter une note pour un patient spécifique
export const addNoteToPatient = async (patientId, noteData) => {
    try {
      console.log("Tentative d'ajout de note pour le patient :", patientId);
      console.log("Données envoyées :", noteData);
  
      const docRef = await addDoc(collection(db, "patients", patientId, "carnetNotes"), noteData);
      
      console.log("Note ajoutée dans Firestore avec ID :", docRef.id);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note :", error);
    }
  };
  

// Récupérer les notes d'un patient spécifique
export const getPatientNotes = async (patientId) => {
  try {
    console.log("Récupération des notes pour le patient :", patientId);
    const notesSnap = await getDocs(collection(db, `patients/${patientId}/carnetNotes`));
    const notes = notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Notes récupérées :", notes);
    return notes;
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    return [];
  }
};

export const updateNote = async (patientId, noteId, updatedData) => {
  try {
    const noteRef = doc(db, `patients/${patientId}/carnetNotes/${noteId}`);
    await updateDoc(noteRef, updatedData);
    console.log("✅ Note mise à jour avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la note :", error);
  }
};

