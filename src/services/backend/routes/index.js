const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const userController = require("../controllers/userControllers");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");
const messageControllers = require("../controllers/messageControllers");

// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.use(verifyToken);
router.get("/profile", userController.getProfile);

// User routes
router.get("/users/search", userController.searchUsers);
router.get("/contacts", userController.getContacts);

// Chat ve Message routes
router.use("/", chatRoutes);
router.use("/", messageRoutes);

// Mesaj route'ları
router.get("/messages/:chatId", verifyToken, messageControllers.getMessages);
router.post("/messages", verifyToken, messageControllers.sendMessage);

// Logout route
router.post("/logout", userController.logout);

module.exports = router;
