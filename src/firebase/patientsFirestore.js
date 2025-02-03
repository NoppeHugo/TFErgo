import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";

// 🔹 Ajouter un patient
export const addPatient = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, "patients"), patientData);
    console.log("Patient ajouté avec ID :", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du patient :", error);
  }
};

// 🔹 Récupérer tous les patients
export const getAllPatients = async () => {
  try {
    const patientsSnap = await getDocs(collection(db, "patients"));
    return patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des patients :", error);
  }
};

// 🔹 Récupérer un patient par ID
export const getPatient = async (patientId) => {
  try {
    const patientDoc = await getDoc(doc(db, "patients", patientId));
    return patientDoc.exists() ? patientDoc.data() : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du patient :", error);
  }
};

// 🔹 Supprimer un patient
export const deletePatient = async (patientId) => {
  try {
    await deleteDoc(doc(db, "patients", patientId));
    console.log("Patient supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression du patient :", error);
  }
};

// 🔹 Mettre à jour un patient
export const updatePatient = async (patientId, updatedData) => {
  try {
    await updateDoc(doc(db, "patients", patientId), updatedData);
    console.log("Patient mis à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du patient :", error);
  }
};

// 🔹 Ajouter un motif d'intervention pour un patient
export const addMotifIntervention = async (patientId, motifData) => {
  try {
    const docRef = await addDoc(collection(db, `patients/${patientId}/motifsIntervention`), motifData);
    return { id: docRef.id, ...motifData };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du motif :", error);
    return null;
  }
};

// 🔹 Récupérer tous les motifs d'intervention d'un patient
export const getMotifsIntervention = async (patientId) => {
  try {
    const snapshot = await getDocs(collection(db, `patients/${patientId}/motifsIntervention`));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des motifs :", error);
    return [];
  }
};

// 🔹 Mettre à jour un motif d'intervention
export const updateMotifIntervention = async (patientId, motifId, updatedData) => {
  try {
    await updateDoc(doc(db, `patients/${patientId}/motifsIntervention/${motifId}`), updatedData);
    console.log("✅ Motif mis à jour !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du motif :", error);
  }
};