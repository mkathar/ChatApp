const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatControllers");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/conversations", chatController.getConversations);
router.post("/conversations", chatController.createConversation);

module.exports = router;
