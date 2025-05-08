const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticateJWT");
const {
  addLongTermObjective,
  addShortTermObjective,
  getMotifWithObjectives,
  updateLongTermObjective,
  deleteLongTermObjective,
  deleteShortTermObjective,
  updateShortTermObjective,
} = require("../controllers/objectiveController");

router.use(authenticateJWT);

router.post("/long/:motifId", addLongTermObjective);
router.post("/short/:longTermObjectiveId", addShortTermObjective);
router.get("/:id/objectives", getMotifWithObjectives);
router.patch("/long/:id", updateLongTermObjective);
router.delete("/long/:id", deleteLongTermObjective);
router.patch("/short/:id", updateShortTermObjective);
router.delete("/short/:id", deleteShortTermObjective);


module.exports = router;