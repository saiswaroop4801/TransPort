
const TransportPass = require("../models/TransportPass");
const BusRoute = require("../models/BusRoute");

// Calculate expiry one calendar year after a date.
// Handles February 29 when the following year is not a leap year.
const addOneYear = (date = new Date()) => {
    const expiryDate = new Date(date);
    const originalMonth = expiryDate.getMonth();

    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    if (expiryDate.getMonth() !== originalMonth) {
        expiryDate.setDate(0);
    }

    return expiryDate;
};

// Apply for a transport pass
const applyForPass = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { routeId } = req.body;
        const now = new Date();

        if (!routeId) {
            return res.status(400).json({
                message: "Please select a bus route."
            });
        }

        // Mark expired approved passes as expired.
        await TransportPass.updateMany(
            {
                studentId,
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now }
            },
            {
                $set: {
                    passStatus: "EXPIRED"
                }
            }
        );

        // A student cannot have another pending or approved pass.
        const existingPass = await TransportPass.findOne({
            studentId,
            passStatus: {
                $in: ["PENDING", "APPROVED"]
            }
        });

        if (existingPass) {
            return res.status(400).json({
                message:
                    "You already have a pending application or an approved pass."
            });
        }

        const route = await BusRoute.findById(routeId);

        if (!route) {
            return res.status(404).json({
                message: "Bus route not found."
            });
        }

        if (route.availableSeats <= 0) {
            return res.status(400).json({
                message: "No seats are currently available on this route."
            });
        }

        const pass = await TransportPass.create({
            studentId,
            routeId,
            applicationDate: now,
            passExpiryDate: null,
            passStatus: "PENDING"
        });

        return res.status(201).json({
            message: "Transport pass application submitted successfully.",
            pass
        });
    } catch (error) {
        console.error("Apply for pass error:", error);

        return res.status(500).json({
            message: "Unable to submit transport pass application."
        });
    }
};

// Get the logged-in student's passes
const getMyPasses = async (req, res) => {
    try {
        const studentId = req.user._id;
        const now = new Date();

        await TransportPass.updateMany(
            {
                studentId,
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now }
            },
            {
                $set: {
                    passStatus: "EXPIRED"
                }
            }
        );

        const passes = await TransportPass.find({
            studentId
        })
            .populate(
                "routeId",
                "routeName busNumber driverName pickupPoint departureTime availableSeats"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            passes
        });
    } catch (error) {
        console.error("Get my passes error:", error);

        return res.status(500).json({
            message: "Unable to load your transport passes."
        });
    }
};

// Get all passes for the admin
const getAllPasses = async (req, res) => {
    try {
        const now = new Date();

        await TransportPass.updateMany(
            {
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now }
            },
            {
                $set: {
                    passStatus: "EXPIRED"
                }
            }
        );

        const passes = await TransportPass.find()
            .populate("studentId", "name email")
            .populate(
                "routeId",
                "routeName busNumber driverName pickupPoint departureTime availableSeats"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            passes
        });
    } catch (error) {
        console.error("Get all passes error:", error);

        return res.status(500).json({
            message: "Unable to load transport applications."
        });
    }
};

// Approve or reject a pending pass
const updatePassStatus = async (req, res) => {
    let reservedRouteId = null;

    try {
        const { status } = req.body;
        const now = new Date();

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid transport pass status."
            });
        }

        const pass = await TransportPass.findById(req.params.id);

        if (!pass) {
            return res.status(404).json({
                message: "Transport pass not found."
            });
        }

        if (pass.passStatus !== "PENDING") {
            return res.status(400).json({
                message:
                    "Only pending transport pass applications can be approved or rejected."
            });
        }

        if (status === "REJECTED") {
            pass.passStatus = "REJECTED";
            await pass.save();

            return res.status(200).json({
                message: "Transport pass rejected successfully.",
                pass
            });
        }

        // Mark expired approved passes for this student as expired.
        await TransportPass.updateMany(
            {
                studentId: pass.studentId,
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now }
            },
            {
                $set: {
                    passStatus: "EXPIRED"
                }
            }
        );

        // Prevent the student from having two active passes.
        const otherActivePass = await TransportPass.findOne({
            studentId: pass.studentId,
            passStatus: "APPROVED",
            passExpiryDate: { $gt: now },
            _id: { $ne: pass._id }
        });

        if (otherActivePass) {
            return res.status(400).json({
                message:
                    "This student already has an active transport pass."
            });
        }

        // Reserve a seat only if one is still available.
        const route = await BusRoute.findOneAndUpdate(
            {
                _id: pass.routeId,
                availableSeats: { $gt: 0 }
            },
            {
                $inc: {
                    availableSeats: -1
                }
            },
            {
                new: true
            }
        );

        if (!route) {
            return res.status(400).json({
                message:
                    "No seats are available on this bus route."
            });
        }

        reservedRouteId = route._id;

        // A newly approved pass is valid for one year
        // from the approval date.
        pass.passStatus = "APPROVED";
        pass.passExpiryDate = addOneYear(now);

        await pass.save();

        // The pass was saved successfully; keep the reserved seat.
        reservedRouteId = null;

        return res.status(200).json({
            message: "Transport pass approved successfully.",
            pass
        });
    } catch (error) {
        // Restore the seat if approval fails after reserving it.
        if (reservedRouteId) {
            try {
                await BusRoute.updateOne(
                    { _id: reservedRouteId },
                    {
                        $inc: {
                            availableSeats: 1
                        }
                    }
                );
            } catch (rollbackError) {
                console.error(
                    "Seat rollback error:",
                    rollbackError
                );
            }
        }

        console.error("Update pass status error:", error);

        return res.status(500).json({
            message: "Unable to update transport pass status."
        });
    }
};

// Renew an approved or expired transport pass
const renewPass = async (req, res) => {
    try {
        const now = new Date();

        const pass = await TransportPass.findById(req.params.id);

        if (!pass) {
            return res.status(404).json({
                message: "Transport pass not found."
            });
        }

        if (!["APPROVED", "EXPIRED"].includes(pass.passStatus)) {
            return res.status(400).json({
                message:
                    "Only approved or expired passes can be renewed."
            });
        }

        // Mark this pass expired if its validity has ended.
        if (
            pass.passStatus === "APPROVED" &&
            pass.passExpiryDate &&
            new Date(pass.passExpiryDate) <= now
        ) {
            pass.passStatus = "EXPIRED";
            await pass.save();
        }

        // Expire older passes before checking for another active pass.
        await TransportPass.updateMany(
            {
                studentId: pass.studentId,
                passStatus: "APPROVED",
                passExpiryDate: { $lte: now },
                _id: { $ne: pass._id }
            },
            {
                $set: {
                    passStatus: "EXPIRED"
                }
            }
        );

        const otherActivePass = await TransportPass.findOne({
            studentId: pass.studentId,
            passStatus: "APPROVED",
            passExpiryDate: { $gt: now },
            _id: { $ne: pass._id }
        });

        if (otherActivePass) {
            return res.status(400).json({
                message:
                    "This student already has another active transport pass."
            });
        }

        // If still valid, extend from the existing expiry date.
        // If expired, start the new validity period from today.
        const currentExpiry =
            pass.passExpiryDate &&
            new Date(pass.passExpiryDate) > now
                ? new Date(pass.passExpiryDate)
                : new Date(now);

        // Every renewal adds one calendar year.
        pass.passExpiryDate = addOneYear(currentExpiry);
        pass.passStatus = "APPROVED";

        await pass.save();

        return res.status(200).json({
            message: "Transport pass renewed successfully.",
            pass
        });
    } catch (error) {
        console.error("Renew pass error:", error);

        return res.status(500).json({
            message: "Unable to renew transport pass."
        });
    }
};

// Revoke an active transport pass
const revokePass = async (req, res) => {
    try {
        const now = new Date();

        // Revoke only an approved pass that is still valid.
        // The status condition also prevents duplicate seat releases.
        const pass = await TransportPass.findOneAndUpdate(
            {
                _id: req.params.id,
                passStatus: "APPROVED",
                passExpiryDate: { $gt: now }
            },
            {
                $set: {
                    passStatus: "REVOKED"
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!pass) {
            const existingPass = await TransportPass.findById(
                req.params.id
            );

            if (!existingPass) {
                return res.status(404).json({
                    message: "Transport pass not found."
                });
            }

            if (
                existingPass.passStatus === "APPROVED" &&
                existingPass.passExpiryDate &&
                new Date(existingPass.passExpiryDate) <= now
            ) {
                existingPass.passStatus = "EXPIRED";
                await existingPass.save();

                return res.status(400).json({
                    message:
                        "This transport pass has expired and cannot be revoked."
                });
            }

            return res.status(400).json({
                message:
                    "Only an active, approved transport pass can be revoked."
            });
        }

        // Release the seat reserved by this pass.
        if (pass.routeId) {
            await BusRoute.updateOne(
                {
                    _id: pass.routeId
                },
                {
                    $inc: {
                        availableSeats: 1
                    }
                }
            );
        }

        return res.status(200).json({
            message:
                "Transport pass revoked successfully. The reserved seat has been released.",
            pass
        });
    } catch (error) {
        console.error("Revoke pass error:", error);

        return res.status(500).json({
            message: "Unable to revoke transport pass."
        });
    }
};

module.exports = {
    applyForPass,
    getMyPasses,
    getAllPasses,
    updatePassStatus,
    renewPass,
    revokePass
};
