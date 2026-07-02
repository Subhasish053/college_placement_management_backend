const Student = require("../models/Student");
const Company = require("../models/Company");
const Drive = require("../models/Drive");
const Application = require("../models/Application");

const getDashboardStats = async (req, res) => {

    try {

        const totalStudents =
            await Student.countDocuments();

        const totalCompanies =
            await Company.countDocuments();

        const totalDrives =
            await Drive.countDocuments();

        const totalApplications =
            await Application.countDocuments();

        const selectedStudents =
            await Application.countDocuments({
                status: "Selected"
            });

        const placementPercentage =
            totalStudents > 0
            ? ((selectedStudents / totalStudents) * 100).toFixed(2)
            : 0;

        const applicationStatus =
        await Application.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentApplications =
        await Application.find()
        .populate({
            path: "studentId",
            select: "branch cgpa passingYear userId",
            populate: {
                path: "userId",
                select: "name email"
            }
        })
        .populate({
            path: "driveId",
            populate: {
                path: "companyId",
                select:
                "companyName role package location"
            }
        })
        .sort({ createdAt: -1 })
        .limit(5);

        const branchWisePlacement =
        await Application.aggregate([
        {
            $match: {
                status: "Selected"
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "student"
            }
        },
        {
            $unwind: "$student"
        },
        {
            $group: {
                _id: "$student.branch",
                count: { $sum: 1 }
            }
        }
        ]);

        res.status(200).json({
            success: true,

            stats: {
                totalStudents,
                totalCompanies,
                totalDrives,
                totalApplications,
                selectedStudents,
                placementPercentage
            },

            applicationStatus,

            branchWisePlacement,

            recentApplications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardStats
};