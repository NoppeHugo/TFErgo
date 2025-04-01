const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticateJWT");
const {
  addLongTermObjective,
  addShortTermObjective,
  getMotifWithObjectives
} = require("../controllers/objectiveController");

router.use(authenticateJWT);

router.post("/long/:motifId", addLongTermObjective);
router.post("/short/:longTermObjectiveId", addShortTermObjective);
router.get("/:id/objectives", getMotifWithObjectives);

module.exports = router;
