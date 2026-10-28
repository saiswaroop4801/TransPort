const mongoose = require("mongoose");

const transportPassSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BusRoute",
            required: true
        },

        applicationDate: {
            type: Date,
            default: Date.now
        },

        passExpiryDate: {
            type: Date,
            default: null
        },

        passStatus: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "EXPIRED",
                "REVOKED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "TransportPass",
    transportPassSchema
);