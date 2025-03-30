const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const updateHealthData = async (req, res) => {
  const { id } = req.params;
  const { medicalDiagnosis, medicalHistory, healthChronicle } = req.body;

  try {
    const patient = await prisma.patient.update({
      where: { id: Number(id) },
      data: { medicalDiagnosis, medicalHistory, healthChronicle },
    });
    res.json(patient);
  } catch (err) {
    console.error('Erreur update health data:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
};

const getHealthData = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        medicalDiagnosis: true,
        medicalHistory: true,
        healthChronicle: true,
      },
    });
    res.json(patient);
  } catch (err) {
    console.error('Erreur get health data:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération.' });
  }
};

module.exports = {
  updateHealthData,
  getHealthData,
};
