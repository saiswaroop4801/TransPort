const express = require("express");
const router = express.Router();

const {
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute
} = require("../controllers/routeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getRoutes);

router.post("/", protect, adminOnly, createRoute);

router.put("/:id", protect, adminOnly, updateRoute);

router.delete("/:id", protect, adminOnly, deleteRoute);

module.exports = router;