const Student = require("../models/Student");

const createProfile = async (req, res) => {

    try {

        const {
            rollNumber,
            branch,
            currentSemester,
            cgpa,
            passingYear,
            skills,
            mobile
        } = req.body;

        const existingProfile = await Student.findOne({
            userId: req.user.id
        });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists"
            });
        }

        const student = await Student.create({
            userId: req.user.id,
            rollNumber,
            branch,
            currentSemester,
            cgpa,
            passingYear,
            skills,
            mobile
        });

        res.status(201).json({
            success: true,
            message: "Profile Created Successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// To viwe the profile when logged in


const getProfile = async (req, res) => {

    try {

        const student = await Student.findOne({
            userId: req.user.id
        }).populate(
            "userId",
            "name email role"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Profile Not Found"
            });
        }

        res.status(200).json({
            success: true,
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update the Profile

const updateProfile = async (req, res) => {

    try {

        const student = await Student.findOneAndUpdate(
            {
                userId: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!student) {
        return res.status(404).json({
            success: false,
            message: "Profile Not Found"
        });
}

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// RESUME UPLOAD
const uploadResume = async (req,res) => {

    try {
        

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const student =
        await Student.findOneAndUpdate(
            {
                userId: req.user.id
            },
            {
                resume: req.file.filename
            },
            {   
                new: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Profile Not Found"
            });
        }

        res.status(200).json({
            success:true,
            message:
            "Resume Uploaded Successfully",
            student
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

// CHECK WHETHER PROFILE EXISTS

const checkProfile = async (req, res) => {

    try {

        const student = await Student.findOne({

            userId: req.user.id

        });

        if (!student) {

            return res.status(404).json({

                success: false,

                profileExists: false,

                message: "Profile not found."

            });

        }

        res.status(200).json({

            success: true,

            profileExists: true

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    uploadResume,
    checkProfile
};