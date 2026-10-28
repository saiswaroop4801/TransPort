const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema(
    {
        routeName: {
            type: String,
            required: true,
            trim: true
        },

        busNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        driverName: {
            type: String,
            required: true,
            trim: true
        },

        pickupPoint: {
            type: String,
            required: true,
            trim: true
        },

        departureTime: {
            type: String,
            required: true
        },

        availableSeats: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

busRouteSchema.index(
    { busNumber: 1 },
    { unique: true }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);