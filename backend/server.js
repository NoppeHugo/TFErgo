import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.send("API Ergogo est en ligne !");
});

// Récupérer tous les patients
app.get("/api/patients", async (req, res) => {
  const patients = await prisma.patient.findMany();
  res.json(patients);
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
