const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {

    try {

        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const actualToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "User not found."

            });

        }

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message: "Your account has been deactivated."

            });

        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }
};

module.exports = protect;