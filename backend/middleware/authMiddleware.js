const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Not authorized. Token required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select(
            "_id role isActive"
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message:
                    "Your account has been deactivated. Please contact the administrator."
            });
        }

        // Provide both ID formats for existing controllers.
        req.user = {
            id: user._id.toString(),
            _id: user._id,
            role: user.role
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required."
        });
    }

    next();
};

module.exports = {
    protect,
    adminOnly
};