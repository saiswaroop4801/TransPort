import { useEffect, useState } from "react";
import {
    BusFront,
    Plus,
    Pencil,
    Trash2,
    X,
    MapPin,
    Clock3,
    UserRound,
    Users,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Route as RouteIcon,
    Save
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ManageRoutes() {
    const emptyForm = {
        routeName: "",
        busNumber: "",
        driverName: "",
        pickupPoint: "",
        departureTime: "",
        availableSeats: ""
    };

    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/routes");

            setRoutes(response.data.routes || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load routes."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setMessage("");
        setError("");
        setShowForm(true);
    };

    const openEditForm = (route) => {
        setEditingId(route._id);

        setFormData({
            routeName: route.routeName,
            busNumber: route.busNumber,
            driverName: route.driverName,
            pickupPoint: route.pickupPoint,
            departureTime: route.departureTime,
            availableSeats: route.availableSeats
        });

        setMessage("");
        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const data = {
                ...formData,
                availableSeats: Number(formData.availableSeats)
            };

            if (editingId) {
                const response = await api.put(
                    `/routes/${editingId}`,
                    data
                );

                setMessage(
                    response.data.message ||
                    "Route updated successfully."
                );
            } else {
                const response = await api.post(
                    "/routes",
                    data
                );

                setMessage(
                    response.data.message ||
                    "Route created successfully."
                );
            }

            closeForm();
            await fetchRoutes();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save route."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this bus route?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await api.delete(
                `/routes/${id}`
            );

            setMessage(
                response.data.message ||
                "Route deleted successfully."
            );

            await fetchRoutes();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete route."
            );
        }
    };

    return (
        <main className="manage-routes-page">

            <div className="manage-routes-wrapper">

                {/* Top Navigation */}

                <div className="manage-routes-top">

                    <Link
                        to="/admin"
                        className="back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Admin Dashboard
                    </Link>

                    <button
                        className="add-route-btn"
                        onClick={openAddForm}
                    >
                        <Plus size={18} />
                        Add New Route
                    </button>

                </div>


                {/* Header */}

                <section className="manage-routes-header">

                    <div>

                        <div className="manage-page-badge">
                            <RouteIcon size={14} />
                            Route Management
                        </div>

                        <h1>
                            Manage Bus
                            <span> Routes.</span>
                        </h1>

                        <p>
                            Create, update and manage campus
                            transportation routes.
                        </p>

                    </div>


                    <div className="route-total">

                        <div className="route-total-icon">
                            <BusFront size={20} />
                        </div>

                        <div>
                            <strong>
                                {routes.length}
                            </strong>

                            <span>
                                Total Routes
                            </span>
                        </div>

                    </div>

                </section>


                {/* Alerts */}

                {message && (
                    <div className="manage-success">

                        <CheckCircle2 size={18} />

                        <span>{message}</span>

                    </div>
                )}

                {error && (
                    <div className="manage-error">

                        <AlertCircle size={18} />

                        <span>{error}</span>

                    </div>
                )}


                {/* Add / Edit Form */}

                {showForm && (

                    <section className="route-form-card">

                        <div className="route-form-header">

                            <div>

                                <div className="form-heading-badge">
                                    <BusFront size={13} />

                                    {editingId
                                        ? "EDIT ROUTE"
                                        : "NEW ROUTE"}
                                </div>

                                <h2>
                                    {editingId
                                        ? "Update Bus Route"
                                        : "Add Bus Route"}
                                </h2>

                                <p>
                                    Enter the transportation details
                                    below.
                                </p>

                            </div>


                            <button
                                className="close-form-btn"
                                onClick={closeForm}
                                type="button"
                            >
                                <X size={19} />
                            </button>

                        </div>


                        <form
                            className="route-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="route-form-grid">

                                <div className="form-group">

                                    <label>
                                        Route Name
                                    </label>

                                    <div className="input-wrapper">
                                        <RouteIcon size={16} />

                                        <input
                                            type="text"
                                            name="routeName"
                                            placeholder="e.g. Tadepalligudem - College"
                                            value={
                                                formData.routeName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Bus Number
                                    </label>

                                    <div className="input-wrapper">
                                        <BusFront size={16} />

                                        <input
                                            type="text"
                                            name="busNumber"
                                            placeholder="e.g. AP37B1234"
                                            value={
                                                formData.busNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Driver Name
                                    </label>

                                    <div className="input-wrapper">
                                        <UserRound size={16} />

                                        <input
                                            type="text"
                                            name="driverName"
                                            placeholder="Enter driver name"
                                            value={
                                                formData.driverName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Pickup Point
                                    </label>

                                    <div className="input-wrapper">
                                        <MapPin size={16} />

                                        <input
                                            type="text"
                                            name="pickupPoint"
                                            placeholder="Enter pickup point"
                                            value={
                                                formData.pickupPoint
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Departure Time
                                    </label>

                                    <div className="input-wrapper">
                                        <Clock3 size={16} />

                                        <input
                                            type="text"
                                            name="departureTime"
                                            placeholder="e.g. 08:15 AM"
                                            value={
                                                formData.departureTime
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Available Seats
                                    </label>

                                    <div className="input-wrapper">
                                        <Users size={16} />

                                        <input
                                            type="number"
                                            name="availableSeats"
                                            placeholder="e.g. 40"
                                            min="0"
                                            value={
                                                formData.availableSeats
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>

                                </div>

                            </div>


                            <div className="route-form-actions">

                                <button
                                    type="button"
                                    className="cancel-route-btn"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-route-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="button-spinner"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />

                                            {editingId
                                                ? "Update Route"
                                                : "Create Route"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </section>

                )}


                {/* Routes List */}

                <section className="manage-routes-list">

                    <div className="manage-list-header">

                        <div>

                            <span className="dashboard-eyebrow">
                                ALL ROUTES
                            </span>

                            <h2>
                                Campus Bus Routes
                            </h2>

                            <p>
                                Manage the routes currently available
                                to students.
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="manage-empty">

                            <div className="manage-state-icon">
                                <BusFront size={29} />
                            </div>

                            <h3>
                                Loading routes
                            </h3>

                            <p>
                                Getting the latest bus routes...
                            </p>

                        </div>

                    ) : routes.length === 0 ? (

                        <div className="manage-empty">

                            <div className="manage-state-icon">
                                <BusFront size={29} />
                            </div>

                            <h3>
                                No routes found
                            </h3>

                            <p>
                                Add your first campus bus route
                                to get started.
                            </p>

                            <button
                                className="empty-add-btn"
                                onClick={openAddForm}
                            >
                                <Plus size={16} />
                                Add First Route
                            </button>

                        </div>

                    ) : (

                        <div className="manage-route-grid">

                            {routes.map((route) => {

                                const isAvailable =
                                    route.availableSeats > 0;

                                return (

                                    <article
                                        className="manage-route-card"
                                        key={route._id}
                                    >

                                        <div className="manage-card-top">

                                            <div className="manage-bus-icon">
                                                <BusFront size={23} />
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
                                                        <CheckCircle2
                                                            size={12}
                                                        />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle
                                                            size={12}
                                                        />
                                                        Full
                                                    </>
                                                )}
                                            </span>

                                        </div>


                                        <div className="manage-route-title">

                                            <span>
                                                CAMPUS ROUTE
                                            </span>

                                            <h3>
                                                {route.routeName}
                                            </h3>

                                            <strong>
                                                Bus {route.busNumber}
                                            </strong>

                                        </div>


                                        <div className="manage-route-info">

                                            <div>
                                                <MapPin size={16} />

                                                <span>
                                                    <small>
                                                        PICKUP
                                                    </small>

                                                    {route.pickupPoint}
                                                </span>
                                            </div>


                                            <div>
                                                <Clock3 size={16} />

                                                <span>
                                                    <small>
                                                        DEPARTURE
                                                    </small>

                                                    {route.departureTime}
                                                </span>
                                            </div>


                                            <div>
                                                <UserRound size={16} />

                                                <span>
                                                    <small>
                                                        DRIVER
                                                    </small>

                                                    {route.driverName}
                                                </span>
                                            </div>


                                            <div>
                                                <Users size={16} />

                                                <span>
                                                    <small>
                                                        SEATS
                                                    </small>

                                                    {route.availableSeats}{" "}
                                                    available
                                                </span>
                                            </div>

                                        </div>


                                        <div className="route-seat-progress">

                                            <div>
                                                <span>
                                                    Seat availability
                                                </span>

                                                <strong>
                                                    {route.availableSeats}
                                                </strong>
                                            </div>

                                            <div className="route-progress-bar">
                                                <div
                                                    style={{
                                                        width: `${Math.min(
                                                            route.availableSeats,
                                                            100
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>

                                        </div>


                                        <div className="manage-card-actions">

                                            <button
                                                className="edit-route-btn"
                                                onClick={() =>
                                                    openEditForm(route)
                                                }
                                            >
                                                <Pencil size={15} />
                                                Edit
                                            </button>

                                            <button
                                                className="delete-route-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        route._id
                                                    )
                                                }
                                            >
                                                <Trash2 size={15} />
                                                Delete
                                            </button>

                                        </div>

                                    </article>

                                );
                            })}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default ManageRoutes;