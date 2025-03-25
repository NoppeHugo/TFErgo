const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getMyPatients(req, res) {
  const therapistId = req.user.id // ajouté par le middleware JWT
  try {
    const patients = await prisma.patient.findMany({
      where: { therapistId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des patients' })
  }
}

async function getPatientById(req, res) {
    const { id } = req.params
    const therapistId = req.user.id
  
    try {
      const patient = await prisma.patient.findFirst({
        where: { id: parseInt(id), therapistId },
      })
  
      if (!patient) return res.status(404).json({ message: 'Patient introuvable' })
  
      res.json(patient)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Erreur lors de la récupération du patient" })
    }
}

async function createPatient(req, res) {
  const therapistId = req.user.id
  const data = req.body
  
  try {
    const patient = await prisma.patient.create({
      data: {
        ...data,
        therapistId,
      },
    })

    res.status(201).json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur lors de la création du patient" })
  }
}

async function updatePatient(req, res) {
    const { id } = req.params
    const therapistId = req.user.id
    const data = req.body
  
    try {
      const patient = await prisma.patient.updateMany({
        where: { id: parseInt(id), therapistId },
        data,
      })
  
      if (patient.count === 0) return res.status(404).json({ message: 'Patient non trouvé ou non autorisé' })
  
      res.json({ message: 'Patient mis à jour' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Erreur lors de la mise à jour du patient" })
    }
}

async function deletePatient(req, res) {
    const { id } = req.params
    const therapistId = req.user.id
  
    try {
      const deleted = await prisma.patient.deleteMany({
        where: { id: parseInt(id), therapistId },
      })
  
      if (deleted.count === 0) return res.status(404).json({ message: 'Patient non trouvé ou non autorisé' })
  
      res.json({ message: 'Patient supprimé' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Erreur lors de la suppression du patient" })
    }
}
  
module.exports = { getMyPatients, getPatientById, createPatient, updatePatient, deletePatient }
