import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";

// 🔹 Ajouter un rendez-vous
export const addAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, "rendezvous"), appointmentData);
    console.log("Rendez-vous ajouté avec ID :", docRef.id);
  } catch (error) {
    console.error("Erreur lors de l'ajout du rendez-vous :", error);
  }
};

// 🔹 Récupérer tous les rendez-vous
export const getAllAppointments = async () => {
  try {
    const appointmentsSnap = await getDocs(collection(db, "rendezvous"));
    return appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
  }
};
