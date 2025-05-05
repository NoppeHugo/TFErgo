const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        objectives: { include: { objective: true } },
        materials: { include: { material: true } },
        images: true,
        files: true,
        appointmentLinks: {
          include: {
            appointment: {
              include: { patient: true, feedbacks: true }
            }
          }
        },
        ShortTermObjectiveActivity: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activities);
  } catch (error) {
    console.error("❌ getAllActivities error:", error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        objectives: { include: { objective: true } },
        materials: { include: { material: true } },
        images: true,
        files: true,
      }
    });
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

const createActivity = async (req, res) => {
  try {
    console.log("🔁 Requête reçue pour créer une activité");
    console.log("📥 Données reçues :", req.body);

    const { therapistId, name, description, link, objectiveIds = [], materialIds = [] } = req.body;

    if (!therapistId || !name) {
      console.log("❌ Données manquantes");
      return res.status(400).json({ error: 'therapistId et name sont requis' });
    }

    const existingActivity = await prisma.activity.findFirst({
      where: { name },
    });    

    if (existingActivity) {
      return res.status(400).json({ error: 'Une activité avec ce nom existe déjà' });
    }

    const newActivity = await prisma.activity.create({
      data: {
        therapist: { connect: { id: therapistId } },
        name,
        description,
        link,
        objectives: {
          create: objectiveIds.map((id) => ({
            objective: { connect: { id } }
          }))
        },
        materials: {
          create: materialIds.map((id) => ({
            material: { connect: { id } }
          }))
        },
      },
      include: {
        objectives: { include: { objective: true } },
        materials: { include: { material: true } },
      }
    });

    console.log("✅ Activité créée :", newActivity);
    res.status(201).json(newActivity);

  } catch (error) {
    console.error("❌ Erreur dans createActivity :", error);
    res.status(500).json({
      error: 'Erreur interne lors de la création de l’activité',
      details: error.message,
    });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, description, link, objectiveIds, materialIds } = req.body;
  try {
    const updated = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        link,
        objectives: {
          deleteMany: {},
          create: objectiveIds.map((id) => ({
            objective: { connect: { id: Number(id) } }
          }))
        },
        materials: {
          deleteMany: {},
          create: materialIds.map((id) => ({
            material: { connect: { id: Number(id) } }
          }))
        }
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.activity.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};

const searchActivities = async (req, res) => {
  const { name, description, objectives, fileType } = req.query;

  let objectiveArray = [];
  if (objectives) {
    try {
      objectiveArray = typeof objectives === 'string'
        ? objectives.split(',').map(Number)
        : Array.isArray(objectives) ? objectives.map(Number) : [];
    } catch (e) {
      return res.status(400).json({ error: 'Invalid objectives format' });
    }
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        name: { contains: name || '', mode: 'insensitive' },
        description: description ? { contains: description, mode: 'insensitive' } : undefined,
        objectives: objectiveArray.length > 0
          ? {
              some: {
                objectiveId: { in: objectiveArray }
              }
            }
          : undefined,
        files: fileType
          ? {
              some: { fileType: fileType }
            }
          : undefined
      },
      include: {
        objectives: { include: { objective: true } },
        materials: { include: { material: true } },
        files: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search activities' });
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  searchActivities
};