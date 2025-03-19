import { db } from "./firebaseConfig.js";
import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";

// 🔹 Ajouter une activité
export const addActivity = async (activityData) => {
  try {
    const docRef = await addDoc(collection(db, "activites"), activityData);
    console.log("Activité ajoutée avec ID :", docRef.id);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité :", error);
  }
};

// 🔹 Récupérer toutes les activités
export const getAllActivities = async () => {
  try {
    const activitiesSnap = await getDocs(collection(db, "activites"));
    return activitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
  }
};
