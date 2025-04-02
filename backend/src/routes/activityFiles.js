import express from 'express';
import { addFileToActivity, deleteFile } from '../controllers/activityFileController.js';

const router = express.Router();

router.post('/:id/files', addFileToActivity);
router.delete('/file/:fileId', deleteFile);

export default router;
