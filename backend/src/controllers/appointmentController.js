const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAppointments(req, res) {
  const therapistId = req.user.id;
  try {
    const appointments = await prisma.appointment.findMany({
      where: { therapistId },
      include: {
        patient: true,
        activity: {
          include: {
            objectives: {
              include: { objective: true },
            },
          },
        },
      },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement des rendez-vous' });
  }
}

async function getAppointmentById(req, res) {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        patient: true,
        activity: {
          include: {
            objectives: {
              include: { objective: true },
            },
          },
        },
      },
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération du rendez-vous' });
  }
}

async function createAppointment(req, res) {
  const therapistId = req.user.id;
  const {
    patientId, title, date, duration, activityId, description, imageUrl,
  } = req.body;

  console.log('🟢 Reçu pour création :', req.body);

  try {
    const appointment = await prisma.appointment.create({
      data: {
        therapistId,
        patientId: parseInt(patientId),
        activityId: activityId ? parseInt(activityId) : null,
        title,
        date: new Date(date),
        duration: parseInt(duration),
        description,
        imageUrl,
      },
    });
    res.json(appointment);
  } catch (err) {
    console.error('❌ Erreur création du rendez-vous', err);
    res.status(500).json({ error: 'Erreur création du rendez-vous' });
  }
}

async function updateAppointment(req, res) {
  const { id } = req.params;
  const {
    title, date, duration, activityId, description, imageUrl,
  } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        title,
        date: new Date(date),
        duration: parseInt(duration),
        activityId: activityId ? parseInt(activityId) : null,
        description,
        imageUrl,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour du rendez-vous' });
  }
}

async function deleteAppointment(req, res) {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression du rendez-vous' });
  }
}

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
