const express = require("express");

const router = express.Router();

const {
    getReports
} = require("../controllers/reportController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

router.get(
    "/",
    protect,
    adminOnly,
    getReports
);

module.exports = router;