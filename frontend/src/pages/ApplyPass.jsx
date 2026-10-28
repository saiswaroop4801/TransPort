import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
    BusFront,
    MapPin,
    Clock3,
    UserRound,
    Users,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    FileCheck2,
    AlertCircle
} from "lucide-react";
import api from "../services/api";

function ApplyPass() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const routeId = searchParams.get("routeId");

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!routeId) {
            setError("No bus route selected.");
            setLoading(false);
            return;
        }

        fetchRoute();
    }, [routeId]);

    const fetchRoute = async () => {
        try {
            const response = await api.get("/routes");

            const selectedRoute = response.data.routes.find(
                (item) => item._id === routeId
            );

            if (!selectedRoute) {
                setError("Selected route was not found.");
                return;
            }

            setRoute(selectedRoute);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load route details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        setMessage("");
        setError("");

        try {
            const response = await api.post("/passes/apply", {
                routeId
            });

            setMessage(
                response.data.message ||
                "Transport pass application submitted successfully."
            );

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to submit application."
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <main className="apply-page">

                <div className="apply-state">

                    <div className="apply-loading-icon">
                        <BusFront size={28} />
                    </div>

                    <h3>Loading route details</h3>

                    <p>
                        Please wait while we prepare your application.
                    </p>

                </div>

            </main>
        );
    }

    if (error && !route) {
        return (
            <main className="apply-page">

                <div className="apply-state">

                    <div className="apply-error-icon">
                        <AlertCircle size={28} />
                    </div>

                    <h3>Unable to continue</h3>

                    <p>{error}</p>

                    <Link
                        to="/routes"
                        className="dashboard-primary-btn"
                    >
                        <ArrowLeft size={17} />
                        Back to Routes
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="apply-page">

            <div className="apply-wrapper">

                <Link to="/routes" className="back-link">
                    <ArrowLeft size={17} />
                    Back to Routes
                </Link>


                <section className="apply-heading">

                    <div className="apply-page-badge">
                        <FileCheck2 size={15} />
                        Transport Pass Application
                    </div>

                    <h1>
                        Apply for a transport
                        <span> pass.</span>
                    </h1>

                    <p>
                        Review your selected route and confirm your
                        application. Your request will be sent to the
                        administrator for approval.
                    </p>

                </section>


                <div className="apply-layout">

                    {/* Main Application Card */}

                    <section className="apply-card">

                        <div className="apply-card-header">

                            <div className="apply-route-icon">
                                <BusFront size={29} />
                            </div>

                            <div className="apply-route-title">

                                <span>
                                    SELECTED ROUTE
                                </span>

                                <h2>
                                    {route.routeName}
                                </h2>

                                <p>
                                    <BusFront size={14} />
                                    Bus {route.busNumber}
                                </p>

                            </div>

                            <div
                                className={
                                    route.availableSeats > 0
                                        ? "apply-available"
                                        : "apply-full"
                                }
                            >
                                {route.availableSeats > 0 ? (
                                    <>
                                        <CheckCircle2 size={13} />
                                        Available
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={13} />
                                        Full
                                    </>
                                )}
                            </div>

                        </div>


                        <div className="apply-divider"></div>


                        <div className="apply-details-heading">
                            <div>
                                <span>ROUTE INFORMATION</span>
                                <h3>Transport details</h3>
                            </div>
                        </div>


                        <div className="apply-route-details">

                            <div className="apply-detail">

                                <div className="apply-detail-icon">
                                    <MapPin size={19} />
                                </div>

                                <div>
                                    <small>Pickup Point</small>
                                    <strong>
                                        {route.pickupPoint}
                                    </strong>
                                </div>

                            </div>


                            <div className="apply-detail">

                                <div className="apply-detail-icon">
                                    <Clock3 size={19} />
                                </div>

                                <div>
                                    <small>Departure Time</small>
                                    <strong>
                                        {route.departureTime}
                                    </strong>
                                </div>

                            </div>


                            <div className="apply-detail">

                                <div className="apply-detail-icon">
                                    <UserRound size={19} />
                                </div>

                                <div>
                                    <small>Driver</small>
                                    <strong>
                                        {route.driverName}
                                    </strong>
                                </div>

                            </div>


                            <div className="apply-detail">

                                <div className="apply-detail-icon">
                                    <Users size={19} />
                                </div>

                                <div>
                                    <small>Available Seats</small>
                                    <strong>
                                        {route.availableSeats}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {message && (
                            <div className="apply-success">

                                <CheckCircle2 size={20} />

                                <div>
                                    <strong>
                                        Application submitted
                                    </strong>

                                    <span>
                                        {message}
                                    </span>
                                </div>

                            </div>
                        )}


                        {error && (
                            <div className="apply-error">

                                <AlertCircle size={19} />

                                <span>{error}</span>

                            </div>
                        )}


                        <div className="apply-notice">

                            <div className="notice-icon">
                                <ShieldCheck size={19} />
                            </div>

                            <div>

                                <strong>
                                    What happens next?
                                </strong>

                                <p>
                                    Your application will be submitted
                                    for administrator approval. Once
                                    approved, your digital transport
                                    pass will become active.
                                </p>

                            </div>

                        </div>


                        <button
                            className="apply-confirm-btn"
                            onClick={handleApply}
                            disabled={
                                applying ||
                                route.availableSeats <= 0 ||
                                !!message
                            }
                        >
                            {applying
                                ? "Submitting Application..."
                                : message
                                ? "Application Submitted"
                                : route.availableSeats <= 0
                                ? "Route Full"
                                : "Confirm & Apply"}

                            {!applying &&
                                !message &&
                                route.availableSeats > 0 && (
                                    <CheckCircle2 size={18} />
                                )}
                        </button>

                    </section>


                    {/* Side Information */}

                    <aside className="apply-sidebar">

                        <div className="apply-side-card">

                            <div className="side-card-icon">
                                <ShieldCheck size={21} />
                            </div>

                            <h3>Secure Application</h3>

                            <p>
                                Your application is securely submitted
                                through the CampusRide portal.
                            </p>

                        </div>


                        <div className="apply-side-card">

                            <div className="side-card-icon">
                                <FileCheck2 size={21} />
                            </div>

                            <h3>Admin Approval</h3>

                            <p>
                                Your pass becomes active after the
                                administrator reviews your application.
                            </p>

                        </div>


                        <div className="apply-side-card">

                            <div className="side-card-icon">
                                <TicketIcon />
                            </div>

                            <h3>Digital Pass</h3>

                            <p>
                                Once approved, you can view your pass
                                from the My Pass section.
                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </main>
    );
}

function TicketIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
        </svg>
    );
}

export default ApplyPass;