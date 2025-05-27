const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addLongTermObjective(req, res) {
    const { motifId } = req.params;
    const { title, startDate, endDate, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Le champ 'title' est obligatoire pour un objectif long terme." });
    }
    try {
      // 1. Retrouver le motif
      const motif = await prisma.interventionReason.findUnique({
        where: { id: parseInt(motifId) },
        select: { patientId: true },
      });
  
      if (!motif) return res.status(404).json({ error: "Motif introuvable" });
  
      // 2. Créer l’objectif avec le bon patientId
      const newObjective = await prisma.longTermObjective.create({
        data: {
          interventionReasonId: parseInt(motifId),
          title,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          status: status || "ouvert",
        },
      });      
  
      res.status(201).json(newObjective);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur création objectif long terme" });
    }
  }
  

async function addShortTermObjective(req, res) {
  const { longTermObjectiveId } = req.params;
  const { title, startDate, endDate, status, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Le champ 'title' est obligatoire pour un objectif court terme." });
  }
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Les champs 'startDate' et 'endDate' sont obligatoires pour un objectif court terme." });
  }
  try {
    const newObjective = await prisma.shortTermObjective.create({
      data: {
        longTermObjectiveId: parseInt(longTermObjectiveId),
        title,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        status: status || "ouvert",
      },
    });

    res.status(201).json(newObjective);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur création objectif court terme" });
  }
}
  

async function getMotifWithObjectives(req, res) {
    const { id } = req.params;
    try {
      const motif = await prisma.interventionReason.findUnique({
        where: { id: parseInt(id) },
        include: {
          longTermObjectives: {
            include: {
              shortTermObjectives: true
            }
          }
        }
      });
      res.json(motif);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur fetch objectif complet" });
    }
}

async function updateLongTermObjective(req, res) {
  const { id } = req.params;
  const { title, startDate, endDate, status, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Le champ 'title' est obligatoire pour un objectif long terme." });
  }
  try {
    const updated = await prisma.longTermObjective.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour objectif long terme" });
  }
}

async function deleteLongTermObjective(req, res) {
  const { id } = req.params;
  try {
    await prisma.longTermObjective.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur suppression objectif long terme" });
  }
}

async function deleteShortTermObjective(req, res) {
  const { id } = req.params;
  try {
    await prisma.shortTermObjective.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur suppression objectif court terme" });
  }
}

async function updateShortTermObjective(req, res) {
  const { id } = req.params;
  const { title, startDate, endDate, status, description } = req.body;

  try {
    const updated = await prisma.shortTermObjective.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        status,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour objectif court terme" });
  }
}

module.exports = {
  addLongTermObjective,
  addShortTermObjective,
  getMotifWithObjectives,
  updateLongTermObjective,
  deleteLongTermObjective,
  updateShortTermObjective,
  deleteShortTermObjective,
};
