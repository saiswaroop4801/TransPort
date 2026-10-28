const express = require("express");
const router = express.Router();

const {
    applyForPass,
    getMyPasses,
    getAllPasses,
    updatePassStatus,
    renewPass,
    revokePass
} = require("../controllers/passController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

// Student routes
router.post("/apply", protect, applyForPass);
router.get("/my", protect, getMyPasses);

// Admin routes
router.get("/all", protect, adminOnly, getAllPasses);

router.put("/:id", protect, adminOnly, updatePassStatus);

router.put("/:id/renew", protect, adminOnly, renewPass);

router.put("/:id/revoke", protect, adminOnly, revokePass);

module.exports = router;