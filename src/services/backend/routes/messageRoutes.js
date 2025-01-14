const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageControllers");
const { verifyToken } = require("../middleware/auth");

router.get("/:chatId", verifyToken, getMessages);

module.exports = router;
