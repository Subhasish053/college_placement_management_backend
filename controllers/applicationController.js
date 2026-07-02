const Application = require("../models/Application");
const Student = require("../models/Student");
const Drive = require("../models/Drive");
const Company = require("../models/Company");


const applyForDrive = async (req, res) => {

    try {

        const { driveId } = req.params;

        // Logged-in student's profile
        const student = await Student.findOne({
            userId: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Profile Not Found"
            });
        }

        // Drive Details
        const drive = await Drive.findById(driveId);

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: "Drive Not Found"
            });
        }

        // Company Details
        const company = await Company.findById(
            drive.companyId
        );

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company Not Found"
            });

        }

        // CGPA CHECK

        if (
            student.cgpa <
            company.minCGPA
        ) {

            return res.status(400).json({
                success: false,
                message:
                `Minimum CGPA required is ${company.minCGPA}`
            });

        }

        // SEMESTER CHECK

        if (
            student.currentSemester <
            company.eligibleSemester
        ) {

            return res.status(400).json({
                success: false,
                message:
                `Minimum Semester required is ${company.eligibleSemester}`
            });

        }

        // Duplicate Check
        const existingApplication =
        await Application.findOne({
            studentId: student._id,
            driveId
        });

        if (existingApplication) {

            return res.status(400).json({
                success: false,
                message: "Already Applied"
            });

        }

        // Create Application

        const application =
        await Application.create({

            studentId: student._id,

            driveId,

            status: "Applied"

        });

        // const application =
        // await Application.create({

        //     studentId: student._id,

        //     driveId,

        //     status: applicationStatus

        // });

        // Response
        res.status(201).json({

            success: true,

            message:
                "Application Submitted Successfully",

            // message:
            //     applicationStatus === "Rejected"
            //     ? "Application Submitted. You do not meet the CGPA criteria."
            //     : "Application Submitted Successfully",

            application

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET AL APPLICATIONS FOR USER
const getMyApplications = async (req, res) => {

    try {

        

        const student = await Student.findOne({
            userId: req.user.id
        });

        

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Please complete your student profile first."

            });

        }

        const applications = await Application.find({
            studentId: student._id
        })
        .populate({
            path: "driveId",
            populate: {
                path: "companyId",
                select: "companyName role package location"
            }
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const getAllApplications = async (req, res) => {

    try {

        const { companyId } = req.query;
        let applications = await Application.find()

        .populate({
            path: "studentId",
            select: "rollNumber branch currentSemester cgpa passingYear userId",
            populate: {
                path: "userId",
                select: "name email"
            }
        })

        .populate({
            path: "driveId",
            select: "venue driveDate status",
            populate: {
                path: "companyId",
                select:
                "companyName role package location"
            }
        });

        if (companyId) {

            applications = applications.filter(
                (app) =>
                    app.driveId?.companyId?._id.toString() === companyId
            );

        }

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// UPDATE APPLICATION STATUS

const updateApplicationStatus = async (req,res) => {

    try {

        const { status } = req.body;

        const application =
            await Application.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

        if (!application) {

            return res.status(404).json({
                success: false,
                message: "Application Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message:
                "Application Status Updated",
            application
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};




module.exports = {
    applyForDrive,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
};