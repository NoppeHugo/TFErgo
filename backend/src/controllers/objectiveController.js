const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addLongTermObjective(req, res) {
    const { motifId } = req.params;
    const { title, startDate, endDate, status } = req.body;
  
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
  const { title, startDate, endDate, status } = req.body;

  try {
    const newObjective = await prisma.shortTermObjective.create({
      data: {
        longTermObjectiveId: parseInt(longTermObjectiveId),
        title,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
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

module.exports = {
  addLongTermObjective,
  addShortTermObjective,
  getMotifWithObjectives
};
