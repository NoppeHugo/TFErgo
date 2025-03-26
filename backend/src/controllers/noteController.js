const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Récupérer toutes les notes d’un patient
async function getPatientNotes(req, res) {
  const { patientId } = req.params
  const therapistId = req.user.id

  try {
    const notes = await prisma.note.findMany({
      where: { patientId: parseInt(patientId), therapistId },
      orderBy: { noteDate: 'desc' },
    })
    res.json(notes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur chargement des notes' })
  }
}

// Ajouter une note
async function addNote(req, res) {
  const { patientId } = req.params
  const therapistId = req.user.id
  const { title, description } = req.body

  try {
    const note = await prisma.note.create({
      data: {
        title,
        description,
        patientId: parseInt(patientId),
        therapistId,
      }
    })
    res.status(201).json(note)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur ajout de note' })
  }
}

// Modifier une note
async function updateNote(req, res) {
  const { id } = req.params
  const therapistId = req.user.id
  const { title, description } = req.body

  try {
    const note = await prisma.note.updateMany({
      where: { id: parseInt(id), therapistId },
      data: { title, description }
    })
    if (note.count === 0) return res.status(404).json({ message: 'Note non trouvée' })
    res.json({ message: 'Note mise à jour' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur update note' })
  }
}

// Supprimer une note
async function deleteNote(req, res) {
  const { id } = req.params
  const therapistId = req.user.id

  try {
    const deleted = await prisma.note.deleteMany({
      where: { id: parseInt(id), therapistId }
    })
    if (deleted.count === 0) return res.status(404).json({ message: 'Note non trouvée' })
    res.json({ message: 'Note supprimée' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur suppression note' })
  }
}

module.exports = { getPatientNotes, addNote, updateNote, deleteNote }
