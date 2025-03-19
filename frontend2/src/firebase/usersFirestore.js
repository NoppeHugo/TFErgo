import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔹 Ajouter un utilisateur
export const addUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "utilisateurs", userId), userData);
    console.log("Utilisateur ajouté !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
  }
};

// 🔹 Récupérer un utilisateur
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "utilisateurs", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  }
};