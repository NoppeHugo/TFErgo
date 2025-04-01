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

module.exports = { getMotifs, addMotif, updateMotif };
