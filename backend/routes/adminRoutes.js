const express = require("express");

const router = express.Router();

const {
    getStudents,
    createStudent,
    deactivateStudent,
    activateStudent,
    permanentlyDeleteStudent
} = require("../controllers/userController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Get and search students
router.get(
    "/students",
    protect,
    adminOnly,
    getStudents
);

// Create student
router.post(
    "/students",
    protect,
    adminOnly,
    createStudent
);

// Deactivate student
router.put(
    "/students/:id/deactivate",
    protect,
    adminOnly,
    deactivateStudent
);

// Reactivate student
router.put(
    "/students/:id/activate",
    protect,
    adminOnly,
    activateStudent
);

// Permanently remove inactive student
router.delete(
    "/students/:id/permanent",
    protect,
    adminOnly,
    permanentlyDeleteStudent
);

module.exports = router;