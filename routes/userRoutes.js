const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  deleteAccount,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", verifyToken, currentUser);
router.post("/forgot-password", forgotPassword);
router.delete("/delete-account", verifyToken,deleteAccount);

module.exports = router;
