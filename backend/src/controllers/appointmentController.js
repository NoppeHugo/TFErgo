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
  const { patientId, title, date, duration, description, imageUrl, sessionReport } = req.body;

  if (!title || !patientId || !date) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  const parsedDate = new Date(date);
  if (parsedDate < new Date()) {
    return res.status(400).json({ error: "La date ne peut pas être dans le passé." });
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        therapistId,
        patientId: parseInt(patientId),
        title,
        date: parsedDate,
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
  const { title, date, duration, description, imageUrl, sessionReport } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  const parsedDate = new Date(date);
  if (parsedDate < new Date()) {
    return res.status(400).json({ error: "La date ne peut pas être dans le passé." });
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        title,
        date: parsedDate,
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

async function getAppointmentsByMonth(req, res) {
  const therapistId = req.user.id;
  const [year, month] = req.params.month.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        therapistId,
        date: { gte: start, lte: end },
      },
      include: {
        patient: true,
        activities: {
          include: {
            activity: {
              include: {
                objectives: { include: { objective: true } },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
    res.json(appointments);
  } catch (err) {
    console.error("❌ getAppointmentsByMonth error:", err);
    res.status(500).json({ error: "Erreur chargement des rendez-vous du mois" });
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

async function getEvaluationItemsByPatient(req, res) {
  const { patientId } = req.params;
  try {
    const items = await prisma.evaluationItem.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    console.error('❌ getEvaluationItemsByPatient error:', error);
    res.status(500).json({ error: 'Erreur chargement des éléments à évaluer' });
  }
}

async function addAppointmentFeedbacks(req, res) {
  const { appointmentId } = req.params;
  const { feedbacks } = req.body;

  try {
    const newFeedbacks = await prisma.appointmentFeedback.createMany({
      data: feedbacks.map((feedback) => ({
        appointmentId: parseInt(appointmentId),
        ...feedback,
      })),
    });
    res.status(201).json(newFeedbacks);
  } catch (err) {
    console.error("❌ addAppointmentFeedbacks error:", err);
    res.status(500).json({ error: 'Erreur ajout des feedbacks' });
  }
}

async function getAppointmentFeedbacksByAppointment(req, res) {
  const { id } = req.params;
  try {
    const feedbacks = await prisma.appointmentFeedback.findMany({
      where: { appointmentId: parseInt(id) },
    });
    res.json(feedbacks);
  } catch (err) {
    console.error("❌ getAppointmentFeedbacksByAppointment error:", err);
    res.status(500).json({ error: "Erreur chargement des feedbacks" });
  }
}


async function updateAppointmentFeedback(req, res) {
  const { id } = req.params;
  const { feedback } = req.body;

  try {
    const updatedFeedback = await prisma.appointmentFeedback.update({
      where: { id: parseInt(id) },
      data: feedback,
    });
    res.json(updatedFeedback);
  } catch (err) {
    console.error("❌ updateAppointmentFeedback error:", err);
    res.status(500).json({ error: 'Erreur mise à jour du feedback' });
  }
}

async function createEvaluationItem(req, res) {
  const { patientId, title } = req.body;
  try {
    const item = await prisma.evaluationItem.create({
      data: {
        patientId: parseInt(patientId),
        title,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ createEvaluationItem error:", err);
    res.status(500).json({ error: "Erreur création élément à évaluer" });
  }
}

async function getAppointmentFeedbacksByAppointment(req, res) {
  const { id } = req.params;

  try {
    const feedbacks = await prisma.appointmentFeedback.findMany({
      where: { appointmentId: parseInt(id) },
      include: {
        evaluationItem: true,
      },
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ getAppointmentFeedbacksByAppointment error:", err);
    res.status(500).json({ error: 'Erreur récupération des feedbacks' });
  }
}

async function createEvaluationItem(req, res) {
  const { patientId, title } = req.body;

  try {
    const newItem = await prisma.evaluationItem.create({
      data: {
        patientId: parseInt(patientId),
        title,
      },
    });
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ createEvaluationItem error:", err);
    res.status(500).json({ error: "Erreur création de l'élément à évaluer" });
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

async function deleteEvaluationItem(req, res) {
  const { id } = req.params;
  try {
    // Supprimer d'abord les feedbacks associés à cet item
    await prisma.appointmentFeedback.deleteMany({
      where: { evaluationItemId: parseInt(id) },
    });

    // Puis supprimer l'élément
    await prisma.evaluationItem.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("deleteEvaluationItem error:", err);
    res.status(500).json({ error: "Erreur suppression de l'élément à évaluer" });
  }
}



module.exports = {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getEvaluationItemsByPatient,
  addAppointmentFeedbacks,
  updateAppointmentFeedback,
  linkActivitiesToAppointment,
  getAppointmentFeedbacksByAppointment,
  createEvaluationItem,
  getAppointmentsByMonth, 
  deleteEvaluationItem,
};
