const Company = require("../models/Company");

const addCompany = async (req, res) => {

    try {

        // const company = await Company.create(req.body);

        const {
            companyName,
            role,
            package,
            minCGPA,
            eligibleSemester,
            location,
            description
        } = req.body;

        const company = await Company.create({
            companyName,
            role,
            package,
            minCGPA,
            eligibleSemester,
            location,
            description
        });

        res.status(201).json({
            success: true,
            message: "Company Added Successfully",
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Companys
const getAllCompanies = async (req, res) => {

    try {

        const companies = await Company.find();

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Company by id
const getCompanyById = async (req, res) => {

    try {

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company Not Found"
            });
        }

        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Company by ID
const updateCompany = async (req, res) => {

    try {

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Company Updated Successfully",
            company
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Company by ID

const deleteCompany = async (req, res) => {

    try {

        const companyId = req.params.id;

        // Check if any drive is using this company
        const existingDrive = await Drive.findOne({
            companyId: companyId
        });

        if (existingDrive) {

            return res.status(400).json({
                success: false,
                message:
                "Cannot delete this company because placement drives are associated with it. Delete the drives first."
            });

        }

        await Company.findByIdAndDelete(companyId);

        res.status(200).json({
            success: true,
            message: "Company Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};