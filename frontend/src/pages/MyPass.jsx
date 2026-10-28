import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    BusFront,
    MapPin,
    Clock3,
    UserRound,
    CalendarDays,
    Ticket,
    ArrowLeft,
    Printer,
    CheckCircle2,
    AlertCircle,
    XCircle
} from "lucide-react";

import api from "../services/api";

function MyPass() {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const response = await api.get("/passes/my");

            setPasses(response.data.passes || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your passes."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusIcon = (status) => {
        if (status === "APPROVED") {
            return <CheckCircle2 size={18} />;
        }

        if (
            status === "REJECTED" ||
            status === "REVOKED"
        ) {
            return <XCircle size={18} />;
        }

        return <AlertCircle size={18} />;
    };

    const getStatusClass = (status) => {
        if (status === "APPROVED") {
            return "pass-approved";
        }

        if (status === "REJECTED") {
            return "pass-rejected";
        }

        if (status === "REVOKED") {
            return "pass-revoked";
        }

        if (status === "EXPIRED") {
            return "pass-expired";
        }

        return "pass-pending";
    };

    if (loading) {
        return (
            <div className="pass-state">
                <Ticket size={32} />
                <p>Loading your transport pass...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pass-state">
                <p>{error}</p>

                <Link
                    to="/dashboard"
                    className="dashboard-primary-btn"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <main className="my-pass-page">
            <Link
                to="/dashboard"
                className="back-link"
            >
                <ArrowLeft size={17} />
                Back to Dashboard
            </Link>

            <section className="my-pass-header">
                <div>
                    <span className="dashboard-eyebrow">
                        Student Transport
                    </span>

                    <h1>My Digital Pass</h1>

                    <p>
                        View your transport pass and journey details.
                    </p>
                </div>

                <span className="pass-count">
                    {passes.length} Pass
                    {passes.length !== 1 ? "es" : ""}
                </span>
            </section>

            {passes.length === 0 ? (
                <section className="no-pass-card">
                    <div className="no-pass-icon">
                        <Ticket size={30} />
                    </div>

                    <h2>No transport pass yet</h2>

                    <p>
                        You haven't applied for a transport pass yet.
                    </p>

                    <Link
                        to="/routes"
                        className="dashboard-primary-btn"
                    >
                        Explore Bus Routes
                    </Link>
                </section>
            ) : (
                <section className="passes-list">
                    {passes.map((pass) => (
                        <article
                            className="digital-pass"
                            key={pass._id}
                        >
                            <div className="pass-top">
                                <div className="pass-brand">
                                    <div className="pass-logo">
                                        <BusFront size={22} />
                                    </div>

                                    <div>
                                        <strong>CampusRide</strong>

                                        <span>
                                            Smart Campus Transport
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`pass-status ${getStatusClass(
                                        pass.passStatus
                                    )}`}
                                >
                                    {getStatusIcon(pass.passStatus)}
                                    {pass.passStatus}
                                </div>
                            </div>

                            <div className="pass-title">
                                <span>DIGITAL TRANSPORT PASS</span>

                                <h2>
                                    {pass.routeId?.routeName ||
                                        "Transport Route"}
                                </h2>
                            </div>

                            <div className="pass-info-grid">
                                <div className="pass-info-item">
                                    <span>Pass ID</span>

                                    <strong>
                                        {pass._id
                                            .slice(-8)
                                            .toUpperCase()}
                                    </strong>
                                </div>

                                <div className="pass-info-item">
                                    <span>Application Date</span>

                                    <strong>
                                        {formatDate(
                                            pass.applicationDate
                                        )}
                                    </strong>
                                </div>

                                <div className="pass-info-item">
                                    <span>Valid Until</span>

                                    <strong>
                                        {formatDate(
                                            pass.passExpiryDate
                                        )}
                                    </strong>
                                </div>

                                <div className="pass-info-item">
                                    <span>Bus Number</span>

                                    <strong>
                                        {pass.routeId?.busNumber || "—"}
                                    </strong>
                                </div>
                            </div>

                            <div className="pass-route-section">
                                <div className="pass-route-heading">
                                    <BusFront size={19} />
                                    Route Information
                                </div>

                                <div className="pass-route-grid">
                                    <div>
                                        <MapPin size={17} />

                                        <div>
                                            <small>Pickup Point</small>

                                            <strong>
                                                {pass.routeId
                                                    ?.pickupPoint || "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div>
                                        <Clock3 size={17} />

                                        <div>
                                            <small>Departure</small>

                                            <strong>
                                                {pass.routeId
                                                    ?.departureTime || "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div>
                                        <UserRound size={17} />

                                        <div>
                                            <small>Driver</small>

                                            <strong>
                                                {pass.routeId
                                                    ?.driverName || "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div>
                                        <CalendarDays size={17} />

                                        <div>
                                            <small>Pass Validity</small>

                                            <strong>
                                                {pass.passStatus ===
                                                "APPROVED"
                                                    ? "1 Year"
                                                    : "Not currently active"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {pass.passStatus === "APPROVED" && (
                                <div className="pass-footer">
                                    <p>
                                        This digital pass is valid for
                                        your assigned campus transport
                                        route.
                                    </p>

                                    <button
                                        type="button"
                                        className="print-pass-btn"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={17} />
                                        Print Pass
                                    </button>
                                </div>
                            )}

                            {pass.passStatus === "PENDING" && (
                                <div className="pass-pending-message">
                                    <AlertCircle size={18} />

                                    <span>
                                        Your application is waiting for
                                        administrator approval.
                                    </span>
                                </div>
                            )}

                            {pass.passStatus === "REJECTED" && (
                                <div className="pass-rejected-message">
                                    <XCircle size={18} />

                                    <span>
                                        Your transport pass application
                                        was rejected.
                                    </span>
                                </div>
                            )}

                            {pass.passStatus === "EXPIRED" && (
                                <div className="pass-pending-message">
                                    <AlertCircle size={18} />

                                    <span>
                                        This transport pass has expired.
                                        Contact the administrator about
                                        renewal or apply for another pass.
                                    </span>
                                </div>
                            )}

                            {pass.passStatus === "REVOKED" && (
                                <div className="pass-rejected-message">
                                    <XCircle size={18} />

                                    <span>
                                        This transport pass has been
                                        revoked by the administrator
                                        and is no longer valid.
                                    </span>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default MyPass;