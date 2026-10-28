const bcrypt = require("bcryptjs");

const User = require("../models/User");
const TransportPass = require("../models/TransportPass");

// =====================================================
// GET ALL STUDENTS / SEARCH STUDENTS
// =====================================================

const getStudents = async (req, res) => {
    try {
        const search = (req.query.q || "").trim();

        const filter = {
            role: "student"
        };

        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const regex = new RegExp(escapedSearch, "i");

            filter.$or = [
                { name: regex },
                { email: regex }
            ];
        }

        const students = await User.find(filter)
            .select(
                "_id name email role isActive createdAt updatedAt"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            message: "Unable to load student accounts"
        });
    }
};


// =====================================================
// ADMIN CREATES STUDENT
// =====================================================

const createStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({
                message:
                    "Student name must contain at least 2 characters"
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

        const student = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "student",
            isActive: true
        });

        return res.status(201).json({
            message: "Student account created successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                isActive: student.isActive,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error("Create student error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            message: "Unable to create student account"
        });
    }
};


// =====================================================
// DEACTIVATE STUDENT
// Block if a pass is approved and not yet expired.
// =====================================================

const deactivateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.role !== "student") {
            return res.status(400).json({
                message:
                    "Only student accounts can be deactivated"
            });
        }

        if (student.isActive === false) {
            return res.status(400).json({
                message: "Student account is already deactivated"
            });
        }

        const now = new Date();

        // Mark approved passes that have expired.
        await TransportPass.updateMany(
            {
                studentId: student._id,
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now }
            },
            {
                $set: { passStatus: "EXPIRED" }
            }
        );

        // Find any currently active transport pass.
        const activePass = await TransportPass.findOne({
            studentId: student._id,
            passStatus: "APPROVED",
            passExpiryDate: { $gt: now }
        });

        if (activePass) {
            const expiryDate = new Date(
                activePass.passExpiryDate
            ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            return res.status(400).json({
                message:
                    `Cannot deactivate this student because they have an active transport pass valid until ${expiryDate}. The pass must be revoked or expire first.`
            });
        }

        student.isActive = false;

        await student.save();

        return res.status(200).json({
            message: "Student account deactivated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                isActive: student.isActive
            }
        });
    } catch (error) {
        console.error("Deactivate student error:", error);

        return res.status(500).json({
            message: "Unable to deactivate student account"
        });
    }
};


// =====================================================
// REACTIVATE STUDENT
// Existing pass records are preserved.
// =====================================================

const activateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.role !== "student") {
            return res.status(400).json({
                message:
                    "Only student accounts can be reactivated"
            });
        }

        if (student.isActive !== false) {
            return res.status(400).json({
                message: "Student account is already active"
            });
        }

        student.isActive = true;

        await student.save();

        return res.status(200).json({
            message: "Student account reactivated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                isActive: student.isActive
            }
        });
    } catch (error) {
        console.error("Activate student error:", error);

        return res.status(500).json({
            message: "Unable to reactivate student account"
        });
    }
};


// =====================================================
// PERMANENTLY DELETE INACTIVE STUDENT
// Deletes the student's pass records as well.
// =====================================================

const permanentlyDeleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.role !== "student") {
            return res.status(400).json({
                message:
                    "Only student accounts can be permanently removed"
            });
        }

        if (student.isActive !== false) {
            return res.status(400).json({
                message:
                    "Please deactivate the student account before permanently removing it"
            });
        }

        await TransportPass.deleteMany({
            studentId: student._id
        });

        await User.deleteOne({
            _id: student._id
        });

        return res.status(200).json({
            message:
                "Student account permanently removed successfully"
        });
    } catch (error) {
        console.error("Permanent student removal error:", error);

        return res.status(500).json({
            message: "Unable to permanently remove student"
        });
    }
};


module.exports = {
    getStudents,
    createStudent,
    deactivateStudent,
    activateStudent,
    permanentlyDeleteStudent
};