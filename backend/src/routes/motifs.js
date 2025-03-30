const express = require('express');
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticateJWT");
const {
  getMotifs,
  addMotif,
  updateMotif,
} = require("../controllers/motifController");

router.use(authenticateJWT);

router.get("/:patientId", getMotifs);
router.post("/:patientId", addMotif);
router.patch("/:id", updateMotif);

module.exports = router;
