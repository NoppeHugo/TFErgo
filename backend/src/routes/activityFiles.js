const express = require('express');
const { addFileToActivity, deleteFile } = require('../controllers/activityFileController');

const router = express.Router();

router.post('/:id/files', addFileToActivity);
router.delete('/file/:fileId', deleteFile);

module.exports = router;
