const express = require('express');
const { getMaterials, createMaterial, updateMaterial, deleteMaterial } = require('../controllers/materialController');
const router = express.Router();

router.get('/', getMaterials);
router.post('/', createMaterial);
router.patch('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;

