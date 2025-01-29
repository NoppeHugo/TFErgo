import { db } from "./firebaseConfig.js";

// Ton code ici

import { collection, doc, setDoc, addDoc } from "firebase/firestore";

// 🔹 Ajouter un utilisateur
export const addUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "utilisateurs", userId), userData);
    console.log("Utilisateur ajouté !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
  }
};

// 🔹 Ajouter un patient
export const addPatient = async (patientId, patientData) => {
  try {
    await setDoc(doc(db, "patients", patientId), patientData);
    console.log("Patient ajouté !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du patient :", error);
  }
};

// 🔹 Ajouter une note dans "carnetNotes"
export const addNoteToPatient = async (patientId, noteId, noteData) => {
  try {
    await setDoc(doc(db, `patients/${patientId}/carnetNotes`, noteId), noteData);
    console.log("Note ajoutée !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la note :", error);
  }
};

// 🔹 Ajouter une activité
export const addActivity = async (activityId, activityData) => {
  try {
    await setDoc(doc(db, "activites", activityId), activityData);
    console.log("Activité ajoutée !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité :", error);
  }
};
