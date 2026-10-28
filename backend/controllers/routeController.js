const BusRoute = require("../models/BusRoute");

const createRoute = async (req, res) => {
    try {
        let {
            routeName,
            busNumber,
            driverName,
            pickupPoint,
            departureTime,
            availableSeats
        } = req.body;

        if (
            !routeName ||
            !busNumber ||
            !driverName ||
            !pickupPoint ||
            !departureTime ||
            availableSeats === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        busNumber = busNumber.trim().toUpperCase();

        const existingRoute = await BusRoute.findOne({
            busNumber
        });

        if (existingRoute) {
            return res.status(400).json({
                message: `Bus number ${busNumber} already exists`
            });
        }

        const route = await BusRoute.create({
            routeName,
            busNumber,
            driverName,
            pickupPoint,
            departureTime,
            availableSeats
        });

        res.status(201).json({
            message: "Bus route created successfully",
            route
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Bus number already exists"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find();

        res.status(200).json({
            count: routes.length,
            routes
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateRoute = async (req, res) => {
    try {
        let {
            routeName,
            busNumber,
            driverName,
            pickupPoint,
            departureTime,
            availableSeats
        } = req.body;

        if (
            !routeName ||
            !busNumber ||
            !driverName ||
            !pickupPoint ||
            !departureTime ||
            availableSeats === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        busNumber = busNumber.trim().toUpperCase();

        const existingRoute = await BusRoute.findOne({
            busNumber,
            _id: { $ne: req.params.id }
        });

        if (existingRoute) {
            return res.status(400).json({
                message: `Bus number ${busNumber} already exists`
            });
        }

        const route = await BusRoute.findByIdAndUpdate(
            req.params.id,
            {
                routeName,
                busNumber,
                driverName,
                pickupPoint,
                departureTime,
                availableSeats
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!route) {
            return res.status(404).json({
                message: "Bus route not found"
            });
        }

        res.status(200).json({
            message: "Bus route updated successfully",
            route
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Bus number already exists"
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteRoute = async (req, res) => {
    try {
        const route = await BusRoute.findByIdAndDelete(
            req.params.id
        );

        if (!route) {
            return res.status(404).json({
                message: "Bus route not found"
            });
        }

        res.status(200).json({
            message: "Bus route deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute
};