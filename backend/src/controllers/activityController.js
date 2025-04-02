// backend/src/controllers/activityController.js
import prisma from '../prisma/client.js';

export const getAllActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        objectives: {
          include: { objective: true }
        },
        images: true,
        Appointment: true,
        ShortTermObjectiveActivity: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

export const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        objectives: {
          include: { objective: true }
        },
        images: true,
        ActivityFile: true
      }
    });
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

export const createActivity = async (req, res) => {
  const { therapistId, name, description, link, objectiveIds } = req.body;
  try {
    const activity = await prisma.activity.create({
      data: {
        therapistId,
        name,
        description,
        link,
        objectives: {
          create: objectiveIds.map((id) => ({
            objective: { connect: { id: Number(id) } }
          }))
        }
      }
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
};

export const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, description, link, objectiveIds } = req.body;
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
        }
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

export const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.activity.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};

export const searchActivities = async (req, res) => {
  const { name, objectives, fileType } = req.query;
  try {
    const activities = await prisma.activity.findMany({
      where: {
        name: { contains: name || '', mode: 'insensitive' },
        objectives: objectives
          ? {
              some: {
                objectiveId: { in: objectives.split(',').map(Number) }
              }
            }
          : undefined,
        ActivityFile: fileType
          ? {
              some: { fileType: fileType }
            }
          : undefined
      },
      include: {
        objectives: { include: { objective: true } },
        ActivityFile: true
      }
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search activities' });
  }
};
