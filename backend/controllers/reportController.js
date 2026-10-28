const User = require("../models/User");
const TransportPass = require("../models/TransportPass");

const getReports = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalApplications =
            await TransportPass.countDocuments();

        const pendingApplications =
            await TransportPass.countDocuments({
                passStatus: "PENDING"
            });

        const approvedApplications =
            await TransportPass.countDocuments({
                passStatus: "APPROVED"
            });

        const rejectedApplications =
            await TransportPass.countDocuments({
                passStatus: "REJECTED"
            });

        const expiredApplications =
            await TransportPass.countDocuments({
                passStatus: "EXPIRED"
            });

        // Count revoked passes
        const revokedApplications =
            await TransportPass.countDocuments({
                passStatus: "REVOKED"
            });

        // Applications grouped by bus route
        const routeWiseApplications =
            await TransportPass.aggregate([
                {
                    $group: {
                        _id: "$routeId",
                        applications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "busroutes",
                        localField: "_id",
                        foreignField: "_id",
                        as: "route"
                    }
                },
                {
                    $unwind: {
                        path: "$route",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        routeName: {
                            $ifNull: [
                                "$route.routeName",
                                "Unknown Route"
                            ]
                        },
                        busNumber: {
                            $ifNull: [
                                "$route.busNumber",
                                "-"
                            ]
                        },
                        applications: 1
                    }
                },
                {
                    $sort: {
                        applications: -1
                    }
                }
            ]);

        return res.status(200).json({
            report: {
                totalStudents,
                totalApplications,
                pendingApplications,
                approvedApplications,
                rejectedApplications,
                expiredApplications,
                revokedApplications,
                routeWiseApplications
            }
        });
    } catch (error) {
        console.error("Get reports error:", error);

        return res.status(500).json({
            message: "Unable to generate reports."
        });
    }
};

module.exports = {
    getReports
};