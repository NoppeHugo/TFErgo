const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET motifs d’un patient
async function getMotifs(req, res) {
  const { patientId } = req.params;
  try {
    const motifs = await prisma.interventionReason.findMany({
      where: { patientId: parseInt(patientId) },
      include: { patientRecords: true },
      orderBy: { id: "desc" },
    });
    res.json(motifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur chargement motifs" });
  }
}

// POST nouveau motif
async function addMotif(req, res) {
  const { patientId } = req.params;
  const data = req.body;

  // Validation du champ obligatoire 'title'
  if (!data.title) {
    return res.status(400).json({ error: "Le champ 'title' est obligatoire pour un motif." });
  }

  try {
    const newMotif = await prisma.interventionReason.create({
      data: {
        title: data.title, 
        groupeCible: data.groupeCible || "",
        age: data.age || "",
        batteriesCodeCIF: data.batteriesCodeCIF || "",
        therapeutic: data.perspectiveTherapeutique || {
          assesments: "",
          syntheseEvaluation: "",
          restrictionsSouhaits: "",
        },
        patientId: parseInt(patientId),
      },
    });
    res.status(201).json(newMotif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur création motif" });
  }
}

// PATCH mise à jour d’un motif (et son dossier)
async function updateMotif(req, res) {
  const { id } = req.params;
  const data = req.body;

  // Validation pour les ajouts de compte rendu d'intervention
  if (Array.isArray(data.compteRenduInterventions)) {
    for (const cr of data.compteRenduInterventions) {
      if (!cr.date || !cr.texte || !cr.texte.trim()) {
        return res.status(400).json({ error: "Chaque compte rendu doit avoir une date et un texte non vide." });
      }
    }
  }

  try {
    // on ignore les champs non modifiables
    const {
      id: _,
      createdAt: __,
      patientId: ___,
      patientRecords,
      ...safeData
    } = data;

    const updated = await prisma.interventionReason.update({
      where: { id: parseInt(id) },
      data: safeData,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur update motif" });
  }
}

// DELETE motif d’intervention
async function deleteMotif(req, res) {
  const { id } = req.params;
  try {
    await prisma.interventionReason.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur suppression motif" });
  }
}

module.exports = { getMotifs, addMotif, updateMotif, deleteMotif };
