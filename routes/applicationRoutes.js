const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const {
    applyForDrive,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

router.post(
    "/apply/:driveId",
    protect,
    applyForDrive
);

//GET MY APPLICATIONS FOR STUDENT
router.get(
    "/my-applications",
    protect,
    getMyApplications
);

//GET ALL APPLICATIONS FOR ADMIN
router.get(
    "/",
    protect,
    adminOnly,
    getAllApplications
);

// UPDATE APPLICATION STATUS
router.put(
    "/:id",
    protect,
    adminOnly,
    updateApplicationStatus
);

module.exports = router;


// =========================
// FOR TESTING APPLICATIONS
// ========================

// POST /api/application/apply/:driveId

// GET  /api/application/my-applications

// GET  /api/application

// PUT  /api/application/:id