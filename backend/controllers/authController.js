
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");

// ========================================
// REGISTER
// ========================================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "student",
            isActive: true
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Unable to register. Please try again."
        });
    }
};

// ========================================
// LOGIN
// ========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message:
                    "Your account has been deactivated. Please contact the administrator."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
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

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Unable to log in. Please try again."
        });
    }
};

// ========================================
// CHANGE PASSWORD - LOGGED-IN USER
// ========================================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required"
            });
        }

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (samePassword) {
            return res.status(400).json({
                message:
                    "New password must be different from current password"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;
        user.passwordChangedAt = new Date();

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            message: "Unable to change password. Please try again."
        });
    }
};

// ========================================
// FORGOT PASSWORD - STUDENTS ONLY
// No email or OTP is sent in this demo flow.
// ========================================
const forgotPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword,
            confirmPassword
        } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            typeof email !== "string" ||
            typeof newPassword !== "string" ||
            typeof confirmPassword !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message:
                    "New password and confirm password do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        // Prevent the Forgot Password page from changing admin passwords.
        if (
            String(user.role).toLowerCase() !== "student"
        ) {
            return res.status(403).json({
                message:
                    "Password reset through this page is available only for student accounts."
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;
        user.passwordChangedAt = new Date();

        // Clear any old reset tokens from the previous email flow.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message:
                "Password reset successfully. You can now log in."
        });
    } catch (error) {
        console.error("Forgot password error:", error.message);

        return res.status(500).json({
            message: "Unable to reset password. Please try again."
        });
    }
};

// ========================================
// OLD TOKEN-BASED RESET ENDPOINT
// Retained for compatibility; students only.
// ========================================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required"
            });
        }

        if (
            typeof newPassword !== "string" ||
            !newPassword
        ) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Reset link is invalid or has expired"
            });
        }

        // The old reset-token route must not reset admin passwords either.
        if (
            String(user.role).toLowerCase() !== "student"
        ) {
            return res.status(403).json({
                message:
                    "Password reset through this endpoint is available only for student accounts."
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;
        user.passwordChangedAt = new Date();

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message:
                "Password reset successfully. You can now log in."
        });
    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(500).json({
            message: "Unable to reset password"
        });
    }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================
module.exports = {
    register,
    login,
    changePassword,
    forgotPassword,
    resetPassword
};
