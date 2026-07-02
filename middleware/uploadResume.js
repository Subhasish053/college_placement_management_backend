const multer = require("multer");
const path = require("path");

const crypto = require("crypto");

// Storage Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            "uploads/resumes"
        );

    },

    

    filename: function (req, file, cb) {

        cb(

            null,

            crypto.randomUUID() +

            path.extname(file.originalname)

        );

    }

});

// Allowed File Types
const allowedFileTypes = [

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

];

// File Filter
const fileFilter = (req, file, cb) => {

    if (allowedFileTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(

            new Error(
                "Only PDF, DOC and DOCX files are allowed."
            ),

            false

        );

    }

};

// Multer Configuration
const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024 // 2 MB

    }

});

module.exports = upload;