const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createAdmin = async (req, res) => {

    try {

        const {

            name,

            email,

            password,

            confirmPassword

        } = req.body;

        // Check Empty Fields

        if (

            !name ||

            !email ||

            !password ||

            !confirmPassword

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        // Password Match

        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }
        
        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message: "Password must be at least 8 characters long."

            });

        }

        // Existing Email

        const existingUser = await User.findOne({

            email

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message: "Email already exists."

            });

        }

        // Hash Password

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        // Create Admin

        const admin = await User.create({

            name,

            email,

            password: hashedPassword,

            role: "admin",

            // isActive: true,

            createdBy: req.user._id

        });

        // Fetch admin without password

        const createdAdmin = await User.findById(admin._id)
            .select("-password");

        return res.status(201).json({

            success: true,

            message: "Administrator created successfully.",

            admin: createdAdmin

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getAllAdmins = async (req, res) => {

    try {

        const admins = await User.find({

            role: "admin"

        })

        .select("-password -otp -otpExpiry -otpVerified")

        .populate("createdBy", "name");

        return res.status(200).json({

            success: true,

            totalAdmins: admins.length,

            admins

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




const deactivateAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const { password, securityKey } = req.body;

        // Logged in admin
        const loggedInAdmin = await User.findById(req.user.id);

        if (!loggedInAdmin) {

            return res.status(404).json({

                success: false,

                message: "Logged in admin not found."

            });

        }

        // Verify password
        const isMatch = await bcrypt.compare(

            password,

            loggedInAdmin.password

        );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Incorrect password."

            });

        }

        // Verify security key
        if (securityKey !== process.env.ADMIN_SECURITY_KEY) {

            return res.status(400).json({

                success: false,

                message: "Invalid security key."

            });

        }

        // Prevent self deactivation
        if (req.user.id === id) {

            return res.status(400).json({

                success: false,

                message: "You cannot deactivate your own account."

            });

        }

        const admin = await User.findById(id);

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Administrator not found."

            });

        }

        if (admin.role !== "admin") {

            return res.status(400).json({

                success: false,

                message: "Selected user is not an administrator."

            });

        }

        if (!admin.isActive) {

            return res.status(400).json({

                success: false,

                message: "Administrator is already inactive."

            });

        }

        // Count active admins
        const activeAdmins = await User.countDocuments({

            role: "admin",

            isActive: true

        });

        // console.log("Active Admin Count:", activeAdmins);

        if (activeAdmins <= 2) {

            return res.status(400).json({

                success: false,

                message: "At least two active administrators must remain."

            });

        }

        admin.isActive = false;

        await admin.save();

        return res.status(200).json({

            success: true,

            message: "Administrator deactivated successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Reactivating the admin

const reactivateAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const admin = await User.findById(id);

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Administrator not found."

            });

        }

        if (admin.role !== "admin") {

            return res.status(400).json({

                success: false,

                message: "Selected user is not an administrator."

            });

        }

        if (admin.isActive) {

            return res.status(400).json({

                success: false,

                message: "Administrator is already active."

            });

        }

        admin.isActive = true;

        await admin.save();

        return res.status(200).json({

            success: true,

            message: "Administrator activated successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createAdmin,
    getAllAdmins,
    deactivateAdmin,
    reactivateAdmin

};