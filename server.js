require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");

// Middleware constants
// for user
const protect = require("./middleware/authMiddleware");
// for admin (role based)
const adminOnly = require("./middleware/adminMiddleware");

// Student Routes
const studentRoutes = require("./routes/studentRoutes");

// Company Route
const companyRoutes = require("./routes/companyRoutes");

// Drive Route
const driveRoutes = require("./routes/driveRoutes");

// Application Route
const applicationRoutes = require("./routes/applicationRoutes");

// DASHBORD ROUTE
const dashboardRoutes = require("./routes/dashboardRoutes");

// RESUME UPLOAD
const path = require("path");

// ADMIN MANAGEMENT ROUTES
const adminRoutes = require("./routes/adminRoutes");

// Database Connection
connectDB();

// Middleware
console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                process.env.FRONTEND_URL,
            ];

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json());

// RESUME UPLOAD
app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);

app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Placement Management API Running...");
});

app.get("/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });

});

// Middleware Route for user authentication
app.get("/api/profile", protect, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Protected Route Accessed",
        user: req.user
    });

});

// Student Routes
app.use("/api/student", studentRoutes);

// Company Route
app.use("/api/company", companyRoutes);

// Drive Route
app.use("/api/drive", driveRoutes);

// Application Route
app.use(
    "/api/application",
    applicationRoutes
);

// DASHBORD ROUTE
app.use(
    "/api/dashboard",
    dashboardRoutes
);

// ADMIN MANAGEMENT ROUTE

app.use(
    "/api/admin",
    adminRoutes
);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});