import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BusFront,
    Ticket,
    MapPin,
    Clock3,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    FileText,
    CalendarDays,
    ChevronRight
} from "lucide-react";
import api from "../services/api";

function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }

        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const response = await api.get("/passes/my");
            setPasses(response.data.passes || []);
        } catch (error) {
            console.error("Failed to fetch passes:", error);
        } finally {
            setLoading(false);
        }
    };

    const activePass = passes.find(
        (pass) => pass.passStatus === "APPROVED"
    );

    const pendingPass = passes.find(
        (pass) => pass.passStatus === "PENDING"
    );

    const currentPass = activePass || pendingPass || passes[0];

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "status-approved";

            case "PENDING":
                return "status-pending";

            case "REJECTED":
                return "status-rejected";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not Available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <main className="dashboard-loading-page">
                <div className="dashboard-loader">
                    <div className="loader-icon">
                        <BusFront size={25} />
                    </div>

                    <h3>Loading your dashboard</h3>
                    <p>Getting your transport information...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="student-dashboard">

            {/* Header */}

            <section className="dashboard-header">

                <div>
                    <span className="dashboard-eyebrow">
                        STUDENT DASHBOARD
                    </span>

                    <h1>
                        Welcome back
                        {user?.name ? `, ${user.name}` : ""} 👋
                    </h1>

                    <p>
                        Manage your campus transport and keep track of
                        your transport pass.
                    </p>
                </div>

                <Link
                    to="/routes"
                    className="dashboard-primary-btn"
                >
                    <BusFront size={18} />
                    Explore Routes
                    <ArrowRight size={16} />
                </Link>

            </section>


            {/* Stats */}

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">

                    <div className="stat-icon blue">
                        <Ticket size={21} />
                    </div>

                    <div>
                        <span>PASS STATUS</span>

                        <strong>
                            {currentPass
                                ? currentPass.passStatus
                                : "NO PASS"}
                        </strong>
                    </div>

                    {currentPass && (
                        <div
                            className={`mini-status ${getStatusClass(
                                currentPass.passStatus
                            )}`}
                        >
                            {currentPass.passStatus === "APPROVED" && (
                                <CheckCircle2 size={13} />
                            )}

                            {currentPass.passStatus === "PENDING" && (
                                <AlertCircle size={13} />
                            )}

                            {currentPass.passStatus}
                        </div>
                    )}

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon green">
                        <BusFront size={21} />
                    </div>

                    <div>
                        <span>CURRENT ROUTE</span>

                        <strong>
                            {currentPass?.routeId?.routeName ||
                                "Not Assigned"}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon orange">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <span>PASS EXPIRY</span>

                        <strong>
                            {activePass?.passExpiryDate
                                ? formatDate(
                                      activePass.passExpiryDate
                                  )
                                : "Not Available"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* Quick Actions */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading">

                    <div>
                        <span className="dashboard-eyebrow">
                            QUICK ACTIONS
                        </span>

                        <h2>What would you like to do?</h2>
                    </div>

                </div>


                <div className="quick-actions">

                    <Link
                        to="/routes"
                        className="action-card"
                    >
                        <div className="action-icon">
                            <BusFront size={22} />
                        </div>

                        <div className="action-content">
                            <h3>Explore Bus Routes</h3>
                            <p>
                                Find routes, pickup points and timings.
                            </p>
                        </div>

                        <ChevronRight size={19} />
                    </Link>


                    <Link
                        to="/apply-pass"
                        className="action-card"
                    >
                        <div className="action-icon">
                            <Ticket size={22} />
                        </div>

                        <div className="action-content">
                            <h3>Apply for Pass</h3>
                            <p>
                                Submit a new transport pass application.
                            </p>
                        </div>

                        <ChevronRight size={19} />
                    </Link>


                    <Link
                        to="/my-pass"
                        className="action-card"
                    >
                        <div className="action-icon">
                            <FileText size={22} />
                        </div>

                        <div className="action-content">
                            <h3>My Pass</h3>
                            <p>
                                View your digital transport pass.
                            </p>
                        </div>

                        <ChevronRight size={19} />
                    </Link>

                </div>

            </section>


            {/* Current Transport */}

            <section className="current-transport">

                <div className="current-transport-header">

                    <div>
                        <span className="dashboard-eyebrow">
                            CURRENT TRANSPORT
                        </span>

                        <h2>Your transport details</h2>
                    </div>

                    {currentPass && (
                        <span
                            className={`status-badge ${getStatusClass(
                                currentPass.passStatus
                            )}`}
                        >
                            {currentPass.passStatus === "APPROVED" && (
                                <CheckCircle2 size={15} />
                            )}

                            {currentPass.passStatus === "PENDING" && (
                                <AlertCircle size={15} />
                            )}

                            {currentPass.passStatus === "REJECTED" && (
                                <AlertCircle size={15} />
                            )}

                            {currentPass.passStatus}
                        </span>
                    )}

                </div>


                {currentPass ? (

                    <div className="transport-details">

                        <div className="transport-main">

                            <div className="transport-bus-icon">
                                <BusFront size={30} />
                            </div>

                            <div>
                                <span className="transport-label">
                                    ASSIGNED ROUTE
                                </span>

                                <h3>
                                    {currentPass.routeId?.routeName ||
                                        "Route"}
                                </h3>

                                <p>
                                    Bus{" "}
                                    <strong>
                                        {currentPass.routeId?.busNumber ||
                                            "N/A"}
                                    </strong>
                                </p>
                            </div>

                        </div>


                        <div className="transport-info">

                            <div>
                                <MapPin size={18} />

                                <span>
                                    <small>PICKUP POINT</small>
                                    {currentPass.routeId?.pickupPoint ||
                                        "N/A"}
                                </span>
                            </div>


                            <div>
                                <Clock3 size={18} />

                                <span>
                                    <small>DEPARTURE</small>
                                    {currentPass.routeId?.departureTime ||
                                        "N/A"}
                                </span>
                            </div>


                            <div>
                                <BusFront size={18} />

                                <span>
                                    <small>DRIVER</small>
                                    {currentPass.routeId?.driverName ||
                                        "N/A"}
                                </span>
                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            <Ticket size={28} />
                        </div>

                        <h3>No transport pass yet</h3>

                        <p>
                            Apply for a transport pass to start using
                            campus transportation.
                        </p>

                        <Link
                            to="/routes"
                            className="dashboard-primary-btn"
                        >
                            Find a Route
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                )}

            </section>

        </main>
    );
}

export default StudentDashboard;