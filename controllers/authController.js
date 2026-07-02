// register Controller

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// =======================
//  REGISTERATION CODE 
// =======================


const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            success:true,
            message:"User Registered Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};


// =======================
//  LOGIN CODE 
// =======================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }
// FOR CHECKING THEE ADMIN STATUS(ACTIVE OR DEACTIVE)
    if (!user.isActive) {
        return res.status(403).json({
            success: false,
            message: "Your account has been deactivated. Please contact an administrator."
        });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ============================
// Get ADMIN Logged-In User Profile
// ============================

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        ).select("-password");

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===================
// ADMIN Update Profile
// ===================

const updateProfile = async (req, res) => {

    try {

        const { name, email } = req.body;

        const user =
            await User.findByIdAndUpdate(
                req.user.id,
                {
                    name,
                    email
                },
                {
                    new: true
                }
            ).select("-password");

        res.status(200).json({

            success: true,

            message:
                "Profile Updated Successfully",

            user

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================
// ADMIN Change Password
// ======================

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user =
            await User.findById(
                req.user.id
            );

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message:
                    "Current Password Incorrect"
            });

        }

        const salt =
            await bcrypt.genSalt(10);

        user.password =
            await bcrypt.hash(
                newPassword,
                salt
            );

        await user.save();

        res.status(200).json({

            success: true,

            message:
                "Password Changed Successfully"

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ======================
// Forgot Password
// ======================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;

        user.otpExpiry =
        Date.now() + 2 * 60 * 1000;

        // OTP has not been verified yet
        user.otpVerified = false;


        await user.save();

        await sendEmail(

            email,

            "🔐 Password Reset OTP | College Placement Management System",

            `
            <div style="font-family: Arial, Helvetica, sans-serif;
                        max-width:600px;
                        margin:auto;
                        border:1px solid #ddd;
                        border-radius:10px;
                        overflow:hidden;">

                <div style="background:#0d6efd;
                            color:white;
                            padding:20px;
                            text-align:center;">

                    <h2 style="margin:0;">
                        College Placement Management System
                    </h2>

                </div>

                <div style="padding:30px;">

                    <h3>Hello ${user.name}, 👋</h3>

                    <p>
                        We received a request to reset your account password.
                    </p>

                    <p>
                        Please use the following One-Time Password (OTP):
                    </p>

                    <div style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        text-align:center;
                        background:#f8f9fa;
                        border:2px dashed #0d6efd;
                        color:#0d6efd;
                        padding:20px;
                        margin:25px 0;
                        border-radius:8px;">

                        ${otp}

                    </div>

                    <p>
                        <strong>OTP Validity:</strong> 2 Minutes
                    </p>

                    <p>
                        For your security:
                    </p>

                    <ul>
                        <li>Never share this OTP with anyone.</li>
                        <li>Our team will never ask for your OTP.</li>
                        <li>If you didn't request this reset, simply ignore this email.</li>
                    </ul>

                    <hr>

                    <p style="color:#666;">
                        This is an automated email from the
                        <strong>College Placement Management System</strong>.
                    </p>

                </div>

                <div style="
                    background:#f8f9fa;
                    padding:15px;
                    text-align:center;
                    color:#666;
                    font-size:13px;">

                    © 2026 College Placement Management System<br>
                    Developed using the MERN Stack

                </div>

            </div>
            `

        );

        res.status(200).json({

            success: true,

            message: "OTP sent successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================
// Verify OTP
// ======================

const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        // User never requested an OTP
        if (!user.otp || !user.otpExpiry) {

            return res.status(400).json({

                success: false,

                message: "Please request a new OTP."

            });

        }

        // OTP expired
        if (user.otpExpiry < Date.now()) {

            user.otp = null;
            user.otpExpiry = null;
            user.otpVerified = false;

            await user.save();

            return res.status(400).json({

                success: false,

                message: "OTP has expired."

            });

        }

        if (user.otp !== otp) {

            return res.status(400).json({

                success: false,
                message: "Invalid OTP"

            });

        }

        user.otpVerified = true;

        await user.save();

        return res.status(200).json({

            success: true,
            message: "OTP Verified"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================
// Reset Password
// ======================

const resetPassword = async (req, res) => {

    try {

        const {

            email,

            newPassword

        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }

       if (!user.otp || !user.otpExpiry) {

            return res.status(400).json({

                success: false,

                message: "Please request a new OTP."

            });

        }

        if (!user.otpVerified) {

            return res.status(400).json({

                success: false,

                message: "Please verify OTP first."

            });

        }

        if (user.otpExpiry < Date.now()) {

            user.otp = null;
            user.otpExpiry = null;
            user.otpVerified = false;

            await user.save();

            return res.status(400).json({

                success: false,

                message: "OTP has expired. Please request a new OTP."

            });

        }

        

        if (newPassword.length < 8) {

            return res.status(400).json({

                success:false,

                message:"Password must be at least 8 characters long."

            });

        }

        const salt =
        await bcrypt.genSalt(10);

        user.password =
            await bcrypt.hash(
                newPassword,
                salt
            );

        user.otp = null;

        user.otpExpiry = null;

        user.otpVerified = false;

        await user.save();

        res.status(200).json({

            success: true,

            message:
                "Password Reset Successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = { register,login,getProfile,updateProfile,changePassword,forgotPassword,verifyOTP,resetPassword };