const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMaterials = async (req, res) => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(materials);
  } catch (error) {
    console.error('❌ ERREUR GET /materials :', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

const createMaterial = async (req, res) => {
  const { name, description } = req.body;
  try {
    // 🔍 Vérification de doublon insensible à la casse
    const existingMaterial = await prisma.material.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existingMaterial) {
      return res.status(409).json({ error: 'Ce matériel existe déjà.' });
    }

    const material = await prisma.material.create({
      data: { name, description }
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
};

const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedMaterial = await prisma.material.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update material' });
  }
};

const deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.material.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete material' });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial
};
