const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /contacts/:patientId
async function getContacts(req, res) {
  const { patientId } = req.params;
  const therapistId = req.user.id;

  try {
    const contacts = await prisma.contact.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { id: "desc" }
    });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du chargement des contacts" });
  }
}

// POST /contacts/:patientId
async function addContact(req, res) {
  const { patientId } = req.params;
  const data = req.body;

  // Vérifie que le champ 'type' est bien fourni
  if (!data.type) {
    return res.status(400).json({ message: "Le champ 'type' est obligatoire pour un contact." });
  }

  try {
    const contact = await prisma.contact.create({
      data: { ...data, patientId: parseInt(patientId) }
    });
    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création du contact" });
  }
}

// PATCH /contacts/:id
async function updateContact(req, res) {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.contact.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur mise à jour contact" });
  }
}

// DELETE /contacts/:id
async function deleteContact(req, res) {
  const { id } = req.params;

  try {
    await prisma.contact.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Contact supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur suppression contact" });
  }
}

module.exports = { getContacts, addContact, updateContact, deleteContact };
