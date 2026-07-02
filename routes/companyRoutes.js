const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    addCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../controllers/companyController");

router.post(
    "/",
    protect,
    adminOnly,
    addCompany
);

// Update Company By ID
router.put(
    "/:id",
    protect,
    adminOnly,
    updateCompany
);

// Delete Company By ID

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteCompany
);

// Get All Companies
router.get("/", getAllCompanies);

// Get Company By ID
router.get("/:id", getCompanyById);


module.exports = router;

// ==================
// For Testing
// ==================

// POST   /api/company
// GET    /api/company
// GET    /api/company/:id
// PUT    /api/company/:id
// DELETE /api/company/:id