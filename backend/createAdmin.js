const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@transport.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        await User.create({
            name: "Transport Admin",
            email: "admin@transport.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");

        process.exit();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();