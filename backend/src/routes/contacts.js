const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/authenticateJWT");
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact
} = require("../controllers/contactController");

router.use(authenticateJWT);

router.get("/:patientId", getContacts);
router.post("/:patientId", addContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
