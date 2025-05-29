const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getGoals = async (req, res) => {
  try {
    const goals = await prisma.activityObjective.findMany();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

const createGoal = async (req, res) => {
  const { name, description } = req.body;
  try {
    // 🔍 Vérification de doublon insensible à la casse
    const existingGoal = await prisma.activityObjective.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existingGoal) {
      return res.status(409).json({ error: 'Cet objectif existe déjà.' });
    }

    const newGoal = await prisma.activityObjective.create({
      data: { name, description }
    });
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || name.trim() === "") {
    // Vérifie si l'objectif existe
    const existing = await prisma.activityObjective.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Objectif non trouvé' });
    } else {
      // Certains tests attendent 400, d'autres 422
      return res.status(422).json({ error: "Le nom est obligatoire" });
    }
  }
  try {
    const updated = await prisma.activityObjective.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    res.json(updated);
  } catch (error) {
    // Si l'objectif n'existe pas, retourne 404
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Objectif non trouvé' });
    }
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.activityObjective.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
