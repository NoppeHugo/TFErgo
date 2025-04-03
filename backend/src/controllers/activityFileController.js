const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addFileToActivity = async (req, res) => {
  const { id } = req.params;
  const { fileUrl, fileType, fileName } = req.body;
  try {
    const file = await prisma.activityFile.create({
      data: {
        activityId: Number(id),
        fileUrl,
        fileType,
        fileName
      }
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  try {
    await prisma.activityFile.delete({ where: { id: Number(fileId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  addFileToActivity,
  deleteFile
};
