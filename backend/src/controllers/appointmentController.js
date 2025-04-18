const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAppointments(req, res) {
  const therapistId = req.user.id;
  try {
    const appointments = await prisma.appointment.findMany({
      where: { therapistId },
      include: {
        patient: true,
        activities: {
          include: {
            activity: {
              include: {
                objectives: {
                  include: { objective: true },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
    res.json(appointments);
  } catch (err) {
    console.error("❌ getAppointments error:", err);
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
        activities: {
          include: {
            activity: {
              include: {
                objectives: {
                  include: { objective: true },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
    res.json(appointment);
  } catch (err) {
    console.error("❌ getAppointmentById error:", err);
    res.status(500).json({ error: 'Erreur récupération du rendez-vous' });
  }
}

async function getAppointmentsByPatientId(req, res) {
  const therapistId = req.user.id;
  const { patientId } = req.params;
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        therapistId,
        patientId: Number(patientId),
      },
      orderBy: { date: 'desc' },
      include: {
        activities: {
          include: {
            activity: {
              include: {
                objectives: {
                  include: { objective: true },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
    res.json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByPatientId error:", err);
    res.status(500).json({ error: 'Erreur récupération des rendez-vous du patient' });
  }
}

async function createAppointment(req, res) {
  const therapistId = req.user.id;
  const {
    patientId, title, date, duration,
    description, imageUrl, sessionReport,
  } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        therapistId,
        patientId: parseInt(patientId),
        title,
        date: new Date(date),
        duration: parseInt(duration),
        description,
        imageUrl,
        sessionReport,
      },
    });
    res.json(appointment);
  } catch (err) {
    console.error('❌ createAppointment error:', err);
    res.status(500).json({ error: 'Erreur création du rendez-vous' });
  }
}

async function updateAppointment(req, res) {
  const { id } = req.params;
  const {
    title, date, duration,
    description, imageUrl, sessionReport,
  } = req.body;

  try {
    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        title,
        date: new Date(date),
        duration: parseInt(duration),
        description,
        imageUrl,
        sessionReport,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('❌ updateAppointment error:', err);
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
    console.error("❌ deleteAppointment error:", err);
    res.status(500).json({ error: 'Erreur suppression du rendez-vous' });
  }
}

async function addAppointmentFeedback(req, res) {
  const { appointmentId } = req.params;
  const { objective, rating, completed } = req.body;
  try {
    const feedback = await prisma.appointmentFeedback.create({
      data: {
        appointmentId: parseInt(appointmentId),
        objective,
        rating,
        completed: !!completed,
      },
    });
    res.json(feedback);
  } catch (err) {
    console.error("❌ addAppointmentFeedback error:", err);
    res.status(500).json({ error: 'Erreur ajout du retour de rendez-vous' });
  }
}

async function updateAppointmentFeedback(req, res) {
  const { id } = req.params;
  const { rating, completed } = req.body;
  try {
    const updated = await prisma.appointmentFeedback.update({
      where: { id: parseInt(id) },
      data: { rating, completed },
    });
    res.json(updated);
  } catch (err) {
    console.error("❌ updateAppointmentFeedback error:", err);
    res.status(500).json({ error: 'Erreur mise à jour du retour' });
  }
}

async function getAppointmentFeedbacks(req, res) {
  const { appointmentId } = req.params;
  try {
    const feedbacks = await prisma.appointmentFeedback.findMany({
      where: { appointmentId: parseInt(appointmentId) },
    });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ getAppointmentFeedbacks error:", err);
    res.status(500).json({ error: 'Erreur chargement des retours' });
  }
}

async function linkActivitiesToAppointment(req, res) {
  const appointmentId = parseInt(req.params.id);
  const { activityIds } = req.body;

  try {
    await prisma.appointmentActivity.deleteMany({
      where: { appointmentId },
    });

    await prisma.appointmentActivity.createMany({
      data: activityIds.map((activityId) => ({
        appointmentId,
        activityId,
      })),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ linkActivitiesToAppointment error:", err);
    res.status(500).json({ error: "Erreur lors de l'association des activités" });
  }
}


module.exports = {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  addAppointmentFeedback,
  updateAppointmentFeedback,
  getAppointmentFeedbacks,
  linkActivitiesToAppointment,
};
