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
  try {
    const updated = await prisma.activityObjective.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    res.json(updated);
  } catch (error) {
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
