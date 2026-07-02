const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    createAdmin,
    getAllAdmins,
    deactivateAdmin,
    reactivateAdmin
} = require("../controllers/adminController");

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// Create Admin
router.post("/", createAdmin);

router.get("/", getAllAdmins);

router.put("/deactivate/:id", deactivateAdmin);

router.put("/activate/:id",reactivateAdmin);

module.exports = router;