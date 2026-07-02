const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadResume");

const multer = require("multer");

const {
    createProfile,
    getProfile,
    updateProfile,
    uploadResume,
    checkProfile
} = require("../controllers/studentController");

//create Profile
router.post(
    "/profile",
    protect,
    createProfile
);
//CHECK STUDENT PROFILE EXISTS
router.get(
    "/check-profile",
    protect,
    checkProfile
);

// View Profile when logged in
router.get(
    "/profile",
    protect,
    getProfile
);
// Update Profile
router.put(
    "/profile",
    protect,
    updateProfile
);


// UPLOAD RESUME
router.post(
    "/upload-resume",
    protect,

    (req, res, next) => {

        upload.single("resume")(req, res, function (err) {

            if (err instanceof multer.MulterError) {

                if (err.code === "LIMIT_FILE_SIZE") {

                    return res.status(400).json({

                        success: false,

                        message: "Resume must be less than 2 MB."

                    });

                }

            }

            if (err) {

                return res.status(400).json({

                    success: false,

                    message: err.message

                });

            }

            next();

        });

    },

    uploadResume
);

module.exports = router;