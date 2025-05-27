const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllTherapists(req, res) {
  try {
    const therapists = await prisma.therapist.findMany();
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des thérapeutes' });
  }
}

module.exports = { getAllTherapists };
