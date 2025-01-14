const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const contactController = require("../controllers/contactControllers");

router.post("/", verifyToken, contactController.addContact);
router.get("/", verifyToken, contactController.getContacts);

module.exports = router;
