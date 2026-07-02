const Drive = require("../models/Drive");
const Company = require("../models/Company");

const Application = require("../models/Application");


const createDrive = async (req, res) => {
    // console.log(req.body);

    try {

        const {
            companyId,
            driveDate,
            venue,
            lastDate,
            status
        } = req.body;

        // Check if company exists
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company Not Found"
            });
        }

        const drive = await Drive.create({
            companyId,
            driveDate,
            venue,
            lastDate,
            status
        });

        res.status(201).json({
            success: true,
            message: "Drive Created Successfully",
            drive
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Drives

const getAllDrives = async (req, res) => {

    try {

        const drives = await Drive.find()
            .populate(
                "companyId",
                "companyName role package minCGPA eligibleSemester location description"
            );

        res.status(200).json({
            success: true,
            count: drives.length,
            drives
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//Get Drive By ID

const getDriveById = async (req, res) => {

    try {

        const drive = await Drive.findById(req.params.id)
            .populate(
                "companyId",
                "companyName role package minCGPA eligibleSemester location description"
            );

        if (!drive) {

            return res.status(404).json({
                success: false,
                message: "Drive Not Found"
            });

        }

        res.status(200).json({
            success: true,
            drive
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//UPDATE DRIVE
const updateDrive = async (req, res) => {

    try {

        const drive = await Drive.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Drive Updated Successfully",
            drive
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Delete Drive

const deleteDrive = async (req, res) => {

    try {

        const driveId = req.params.id;

        // Count applications
        const applicationCount = await Application.countDocuments({
            driveId
        });

        // Delete all applications related to this drive
        await Application.deleteMany({
            driveId
        });

        // Delete drive
        await Drive.findByIdAndDelete(
            driveId
        );

        res.status(200).json({

            success: true,

            deletedApplications: applicationCount,

            message:
                `Drive deleted successfully.

                Associated student applications removed: ${applicationCount}.`

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive
};