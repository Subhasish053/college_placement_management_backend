const express = require("express");

const router = express.Router();

const { register,login,getProfile,updateProfile,changePassword,forgotPassword,verifyOTP,resetPassword } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get(
    "/me",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
    "/change-password",
    protect,
    changePassword
);
// NODEMAILER ROUTES

// Forgot Password
router.post(
    "/forgot-password",
    forgotPassword
);

// Verify OTP
router.post(
    "/verify-otp",
    verifyOTP
);

// Reset Password
router.post(
    "/reset-password",
    resetPassword
);

module.exports = router;