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
  if (!name || name.trim() === "") {
    // Vérifie si le matériel existe
    const existing = await prisma.material.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    } else {
      // Utiliser 422 pour champ obligatoire manquant (comme goalController)
      return res.status(422).json({ error: "Le nom est obligatoire" });
    }
  }
  try {
    const updatedMaterial = await prisma.material.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    res.json(updatedMaterial);
  } catch (error) {
    // Si le matériel n'existe pas, retourne 404
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }
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
