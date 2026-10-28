import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BusFront,
    MapPin,
    Clock3,
    UserRound,
    Users,
    ArrowRight,
    Route as RouteIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import api from "../services/api";

function BusRoutes() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setError("");

            const response = await api.get("/routes");
            setRoutes(response.data.routes || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load bus routes."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="routes-page">

            {/* Header */}

            <section className="routes-header">

                <div className="routes-header-content">

                    <div className="routes-page-badge">
                        <RouteIcon size={15} />
                        Campus Transportation
                    </div>

                    <h1>
                        Find your campus
                        <span> bus route.</span>
                    </h1>

                    <p>
                        Explore available routes, pickup points, departure
                        times and seat availability in one place.
                    </p>

                </div>

                <div className="routes-count">

                    <div className="routes-count-icon">
                        <BusFront size={22} />
                    </div>

                    <div>
                        <strong>{routes.length}</strong>
                        <span>Available Routes</span>
                    </div>

                </div>

            </section>


            {/* Loading */}

            {loading && (
                <div className="routes-state">

                    <div className="routes-loading-icon">
                        <BusFront size={28} />
                    </div>

                    <h3>Loading bus routes</h3>

                    <p>
                        Please wait while we get the latest routes.
                    </p>

                </div>
            )}


            {/* Error */}

            {!loading && error && (
                <div className="routes-state error-state">

                    <div className="routes-state-icon error-icon">
                        <AlertCircle size={28} />
                    </div>

                    <h3>Unable to load routes</h3>

                    <p>{error}</p>

                    <button
                        className="route-retry-btn"
                        onClick={fetchRoutes}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* Empty */}

            {!loading && !error && routes.length === 0 && (
                <div className="routes-state">

                    <div className="routes-state-icon">
                        <BusFront size={28} />
                    </div>

                    <h3>No routes available</h3>

                    <p>
                        There are currently no bus routes available.
                        Please check again later.
                    </p>

                </div>
            )}


            {/* Routes */}

            {!loading && !error && routes.length > 0 && (
                <section className="routes-grid">

                    {routes.map((route) => {

                        const isAvailable = route.availableSeats > 0;

                        return (
                            <article
                                className="route-card"
                                key={route._id}
                            >

                                {/* Card Top */}

                                <div className="route-card-top">

                                    <div className="route-bus-icon">
                                        <BusFront size={27} />
                                    </div>

                                    <span
                                        className={
                                            isAvailable
                                                ? "route-available"
                                                : "route-full"
                                        }
                                    >
                                        {isAvailable ? (
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
                                    </span>

                                </div>


                                {/* Route Title */}

                                <div className="route-title">

                                    <span className="route-label">
                                        CAMPUS ROUTE
                                    </span>

                                    <h2>
                                        {route.routeName}
                                    </h2>

                                    <div className="route-bus-number">
                                        <BusFront size={14} />
                                        Bus {route.busNumber}
                                    </div>

                                </div>


                                {/* Route Details */}

                                <div className="route-details">

                                    <div className="route-detail">

                                        <div className="route-detail-icon">
                                            <MapPin size={17} />
                                        </div>

                                        <div>
                                            <small>
                                                PICKUP POINT
                                            </small>

                                            <strong>
                                                {route.pickupPoint}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="route-detail">

                                        <div className="route-detail-icon">
                                            <Clock3 size={17} />
                                        </div>

                                        <div>
                                            <small>
                                                DEPARTURE
                                            </small>

                                            <strong>
                                                {route.departureTime}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="route-detail">

                                        <div className="route-detail-icon">
                                            <UserRound size={17} />
                                        </div>

                                        <div>
                                            <small>
                                                DRIVER
                                            </small>

                                            <strong>
                                                {route.driverName}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="route-detail">

                                        <div className="route-detail-icon">
                                            <Users size={17} />
                                        </div>

                                        <div>
                                            <small>
                                                AVAILABLE SEATS
                                            </small>

                                            <strong>
                                                {route.availableSeats}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* Seats */}

                                <div className="route-seat-bar">

                                    <div className="route-seat-text">
                                        <span>Seat Availability</span>

                                        <strong>
                                            {route.availableSeats} seats
                                        </strong>
                                    </div>

                                    <div className="seat-progress">
                                        <div
                                            className="seat-progress-fill"
                                            style={{
                                                width: `${Math.min(
                                                    route.availableSeats,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                </div>


                                {/* Apply */}

                                <Link
                                    to={`/apply-pass?routeId=${route._id}`}
                                    className={`route-apply-btn ${
                                        !isAvailable
                                            ? "disabled-route-btn"
                                            : ""
                                    }`}
                                    onClick={(e) => {
                                        if (!isAvailable) {
                                            e.preventDefault();
                                        }
                                    }}
                                >

                                    {isAvailable
                                        ? "Apply for This Route"
                                        : "Route Full"}

                                    {isAvailable && (
                                        <ArrowRight size={17} />
                                    )}

                                </Link>

                            </article>
                        );
                    })}

                </section>
            )}

        </main>
    );
}

export default BusRoutes;