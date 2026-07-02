const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive
} = require("../controllers/driveController");

router.post(
    "/",
    protect,
    adminOnly,
    createDrive
);

// UPDATE DRIVE
router.put(
    "/:id",
    protect,
    adminOnly,
    updateDrive
);

//DELETE DRIVE

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteDrive
);

// GET ALL DRIVES
router.get("/", getAllDrives);

//Get Drive By ID
router.get("/:id", getDriveById);


module.exports = router;