// Importation avec 'import' (correcte pour les modules ES)
import { addUser, addPatient, addNoteToPatient, addActivity } from "./src/firebase/firestoreFunctions.js";

// Tester l'ajout d'un utilisateur (ergothérapeute)
addUser("userId123", {
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@email.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Tester l'ajout d'un patient
addPatient("patientId123", {
  ergoId: "userId123",
  nom: "Alice Dupont",
  niss: "1234567890",
  dateNaissance: "1992-03-15",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Tester l'ajout d'une note au patient
addNoteToPatient("patientId123", "noteId456", {
  date: new Date().toISOString(),
  note: "Le patient a progressé dans les exercices.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Tester l'ajout d'une activité
addActivity("activityId123", {
  nom: "Exercice de mobilité",
  description: "Mouvements pour améliorer la flexion du genou",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
