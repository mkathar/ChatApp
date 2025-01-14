const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const userController = require("../controllers/userControllers");

// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", verifyToken, userController.logout);

// User routes
router.get("/profile", verifyToken, userController.getProfile);
router.get("/search", verifyToken, userController.searchUsers);
router.get("/settings", verifyToken, userController.getUserSettings);

module.exports = router;
