import { useEffect, useState } from "react";

import {
    BusFront,
    CheckCircle2,
    Clock3,
    XCircle,
    Users,
    Ticket,
    RefreshCw,
    ArrowRight,
    Activity,
    ShieldCheck
} from "lucide-react";

import api from "../services/api";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/passes/all");

            setPasses(response.data.passes || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    // Approve or reject a pending application
    const updateStatus = async (passId, status) => {
        try {
            setUpdatingId(passId);
            setMessage("");
            setError("");

            const response = await api.put(
                `/passes/${passId}`,
                { status }
            );

            setMessage(
                response.data.message ||
                `Pass ${status.toLowerCase()} successfully.`
            );

            await fetchPasses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update pass status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Renew an existing pass
    const handleRenew = async (pass) => {
        const studentName =
            pass.studentId?.name || "this student";

        const confirmed = window.confirm(
            `Renew the transport pass for ${studentName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingId(pass._id);
            setMessage("");
            setError("");

            const response = await api.put(
                `/passes/${pass._id}/renew`
            );

            setMessage(
                response.data.message ||
                "Transport pass renewed successfully."
            );

            await fetchPasses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to renew transport pass."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Revoke an active pass and release its reserved seat
    const handleRevokePass = async (pass) => {
        const studentName =
            pass.studentId?.name || "this student";

        const confirmed = window.confirm(
            `Revoke the active transport pass for ${studentName}?\n\n` +
            "The pass will become invalid and its reserved seat will be released."
        );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingId(pass._id);
            setMessage("");
            setError("");

            const response = await api.put(
                `/passes/${pass._id}/revoke`
            );

            setMessage(
                response.data.message ||
                "Transport pass revoked successfully."
            );

            await fetchPasses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to revoke transport pass."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const totalApplications = passes.length;

    const pendingApplications = passes.filter(
        (pass) => pass.passStatus === "PENDING"
    ).length;

    const approvedApplications = passes.filter(
        (pass) => pass.passStatus === "APPROVED"
    ).length;

    const rejectedApplications = passes.filter(
        (pass) => pass.passStatus === "REJECTED"
    ).length;

    const revokedApplications = passes.filter(
        (pass) => pass.passStatus === "REVOKED"
    ).length;

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const isPassActive = (pass) => {
        return (
            pass.passStatus === "APPROVED" &&
            pass.passExpiryDate &&
            new Date(pass.passExpiryDate) > new Date()
        );
    };

    return (
        <main className="admin-dashboard">
            <div className="admin-dashboard-wrapper">

                {/* Header */}
                <section className="admin-header">
                    <div>
                        <div className="admin-page-badge">
                            <ShieldCheck size={14} />
                            Administration
                        </div>

                        <h1>
                            Admin
                            <span> Dashboard.</span>
                        </h1>

                        <p>
                            Manage student transport applications and
                            campus bus services from one place.
                        </p>
                    </div>

                    <div className="admin-header-actions">
                        <Link
                            to="/admin/routes"
                            className="manage-routes-btn"
                        >
                            <BusFront size={17} />
                            Manage Routes
                            <ArrowRight size={15} />
                        </Link>

                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={fetchPasses}
                            disabled={loading}
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "refresh-spinning"
                                        : ""
                                }
                            />
                            Refresh
                        </button>
                    </div>
                </section>

                {/* Statistics */}
                <section className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon blue">
                            <Ticket size={21} />
                        </div>

                        <div className="admin-stat-content">
                            <span>Total Applications</span>
                            <strong>{totalApplications}</strong>
                            <small>All applications</small>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon orange">
                            <Clock3 size={21} />
                        </div>

                        <div className="admin-stat-content">
                            <span>Pending</span>
                            <strong>{pendingApplications}</strong>
                            <small>Awaiting review</small>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon green">
                            <CheckCircle2 size={21} />
                        </div>

                        <div className="admin-stat-content">
                            <span>Approved</span>
                            <strong>{approvedApplications}</strong>
                            <small>Approved passes</small>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon red">
                            <XCircle size={21} />
                        </div>

                        <div className="admin-stat-content">
                            <span>Rejected</span>
                            <strong>{rejectedApplications}</strong>
                            <small>Declined applications</small>
                        </div>
                    </div>
                </section>

                {/* Messages */}
                {message && (
                    <div className="admin-success">
                        <CheckCircle2 size={18} />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="admin-error">
                        <XCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Overview */}
                <section className="admin-overview">
                    <div className="admin-overview-card">
                        <div className="overview-icon">
                            <Activity size={20} />
                        </div>

                        <div>
                            <span>APPLICATION ACTIVITY</span>

                            <strong>
                                {pendingApplications > 0
                                    ? `${pendingApplications} application${
                                          pendingApplications !== 1
                                              ? "s"
                                              : ""
                                      } need review`
                                    : "All applications reviewed"}
                            </strong>
                        </div>
                    </div>

                    <div className="admin-overview-card">
                        <div className="overview-icon">
                            <Users size={20} />
                        </div>

                        <div>
                            <span>PASS MANAGEMENT</span>

                            <strong>
                                {approvedApplications} approved pass
                                {approvedApplications !== 1 ? "es" : ""}
                            </strong>

                            <small>
                                {revokedApplications} revoked pass
                                {revokedApplications !== 1 ? "es" : ""}
                            </small>
                        </div>
                    </div>
                </section>

                {/* Applications */}
                <section className="applications-section">
                    <div className="applications-heading">
                        <div>
                            <span className="dashboard-eyebrow">
                                PASS MANAGEMENT
                            </span>

                            <h2>Transport Applications</h2>

                            <p>
                                Review applications, renew passes,
                                and revoke active passes when necessary.
                            </p>
                        </div>

                        <div className="application-count">
                            <Ticket size={15} />
                            {totalApplications} Application
                            {totalApplications !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-empty">
                            <div className="admin-loading-icon">
                                <RefreshCw
                                    size={27}
                                    className="refresh-spinning"
                                />
                            </div>

                            <h3>Loading applications</h3>

                            <p>
                                Getting the latest transport applications...
                            </p>
                        </div>
                    ) : passes.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-loading-icon">
                                <Ticket size={29} />
                            </div>

                            <h3>No applications yet</h3>

                            <p>
                                Student transport pass applications
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="applications-table-wrapper">
                            <table className="applications-table">
                                <thead>
                                    <tr>
                                        <th>STUDENT</th>
                                        <th>ROUTE</th>
                                        <th>BUS</th>
                                        <th>APPLIED ON</th>
                                        <th>VALID UNTIL</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {passes.map((pass) => (
                                        <tr key={pass._id}>
                                            <td>
                                                <div className="student-cell">
                                                    <div className="student-avatar">
                                                        <Users size={16} />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {pass.studentId?.name ||
                                                                "Unknown Student"}
                                                        </strong>

                                                        <small>
                                                            {pass.studentId?.email ||
                                                                "No email"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="route-cell">
                                                    <div className="table-route-icon">
                                                        <BusFront size={15} />
                                                    </div>

                                                    <span>
                                                        {pass.routeId?.routeName ||
                                                            "Unknown Route"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="bus-number">
                                                    {pass.routeId?.busNumber ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date-value">
                                                    {formatDate(
                                                        pass.applicationDate
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date-value">
                                                    {formatDate(
                                                        pass.passExpiryDate
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-status ${
                                                        (
                                                            pass.passStatus ||
                                                            "PENDING"
                                                        ).toLowerCase()
                                                    }`}
                                                >
                                                    {pass.passStatus ===
                                                        "APPROVED" && (
                                                        <CheckCircle2
                                                            size={13}
                                                        />
                                                    )}

                                                    {pass.passStatus ===
                                                        "PENDING" && (
                                                        <Clock3 size={13} />
                                                    )}

                                                    {[
                                                        "REJECTED",
                                                        "REVOKED"
                                                    ].includes(
                                                        pass.passStatus
                                                    ) && (
                                                        <XCircle size={13} />
                                                    )}

                                                    {pass.passStatus}
                                                </span>
                                            </td>

                                            <td>
                                                {pass.passStatus ===
                                                "PENDING" ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            type="button"
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    pass._id,
                                                                    "APPROVED"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                pass._id
                                                            }
                                                        >
                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                            {updatingId ===
                                                            pass._id
                                                                ? "Updating..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    pass._id,
                                                                    "REJECTED"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                pass._id
                                                            }
                                                        >
                                                            <XCircle size={14} />

                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="action-buttons">
                                                        {[
                                                            "APPROVED",
                                                            "EXPIRED"
                                                        ].includes(
                                                            pass.passStatus
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                className="renew-btn"
                                                                onClick={() =>
                                                                    handleRenew(
                                                                        pass
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingId ===
                                                                    pass._id
                                                                }
                                                            >
                                                                <RefreshCw
                                                                    size={14}
                                                                />

                                                                {updatingId ===
                                                                pass._id
                                                                    ? "Processing..."
                                                                    : "Renew Pass"}
                                                            </button>
                                                        )}

                                                        {isPassActive(pass) && (
                                                            <button
                                                                type="button"
                                                                className="revoke-btn"
                                                                onClick={() =>
                                                                    handleRevokePass(
                                                                        pass
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingId ===
                                                                    pass._id
                                                                }
                                                            >
                                                                <XCircle
                                                                    size={14}
                                                                />

                                                                {updatingId ===
                                                                pass._id
                                                                    ? "Processing..."
                                                                    : "Revoke Pass"}
                                                            </button>
                                                        )}

                                                        {![
                                                            "APPROVED",
                                                            "EXPIRED"
                                                        ].includes(
                                                            pass.passStatus
                                                        ) && (
                                                            <span className="no-action">
                                                                No action
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;