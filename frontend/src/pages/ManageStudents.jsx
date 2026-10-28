import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Mail,
    CalendarDays,
    ArrowLeft,
    UserX,
    UserCheck,
    UserPlus,
    X,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async (query = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/admin/students?q=${encodeURIComponent(query)}`
            );

            setStudents(response.data.students || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load student accounts."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);
        fetchStudents(value);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {
        setShowForm(true);
        setMessage("");
        setError("");

        setFormData({
            name: "",
            email: "",
            password: ""
        });
    };

    const closeAddForm = () => {
        setShowForm(false);

        setFormData({
            name: "",
            email: "",
            password: ""
        });
    };

    // Create a student account
    const handleCreateStudent = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please fill in all student details.");
            return;
        }

        if (formData.name.trim().length < 2) {
            setError(
                "Student name must contain at least 2 characters."
            );
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await api.post(
                "/admin/students",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            setMessage(
                response.data.message ||
                "Student account created successfully."
            );

            closeAddForm();

            await fetchStudents(search);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create student account."
            );
        } finally {
            setSaving(false);
        }
    };

    // Deactivate an active student account
    const handleDeactivate = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${student.name}'s account?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(student._id);
            setMessage("");
            setError("");

            const response = await api.put(
                `/admin/students/${student._id}/deactivate`
            );

            setMessage(
                response.data.message ||
                "Student account deactivated successfully."
            );

            await fetchStudents(search);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to deactivate student account."
            );
        } finally {
            setActionLoading("");
        }
    };

    // Reactivate an inactive student account
    const handleActivate = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to activate ${student.name}'s account?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(student._id);
            setMessage("");
            setError("");

            const response = await api.put(
                `/admin/students/${student._id}/activate`
            );

            setMessage(
                response.data.message ||
                "Student account activated successfully."
            );

            await fetchStudents(search);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to activate student account."
            );
        } finally {
            setActionLoading("");
        }
    };

    // Permanently delete an inactive student account
    const handlePermanentDelete = async (student) => {
        if (student.isActive) {
            setError(
                "Deactivate the student account before permanently deleting it."
            );
            return;
        }

        const confirmed = window.confirm(
            `WARNING: Permanently delete ${student.name}'s account?\n\n` +
            "This action cannot be undone. The student's account " +
            "and associated transport pass records will be deleted."
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(student._id);
            setMessage("");
            setError("");

            const response = await api.delete(
                `/admin/students/${student._id}/permanent`
            );

            setMessage(
                response.data.message ||
                "Student account permanently deleted."
            );

            await fetchStudents(search);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to permanently delete student account."
            );
        } finally {
            setActionLoading("");
        }
    };

    // Format dates for display
    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

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

    return (
        <main className="manage-students-page">
            <div className="manage-students-wrapper">

                <Link
                    to="/admin"
                    className="students-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                {/* Page Header */}
                <section className="students-page-header">
                    <div>
                        <span className="students-page-label">
                            STUDENT MANAGEMENT
                        </span>

                        <h1>Student Accounts</h1>

                        <p>
                            Create, search and manage registered
                            student accounts.
                        </p>
                    </div>

                    <div className="students-header-actions">
                        <div className="students-count-box">
                            <Users size={18} />

                            <div>
                                <strong>{students.length}</strong>
                                <span>Students</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="add-student-btn"
                            onClick={openAddForm}
                        >
                            <UserPlus size={17} />
                            Add Student
                        </button>
                    </div>
                </section>

                {/* Success Message */}
                {message && (
                    <div className="students-success">
                        <CheckCircle2 size={18} />
                        <span>{message}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="students-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Add Student Form */}
                {showForm && (
                    <section className="add-student-card">
                        <div className="add-student-heading">
                            <div className="student-heading-icon">
                                <UserPlus size={20} />
                            </div>

                            <div>
                                <h2>Add Student Account</h2>

                                <p>
                                    Create a new student account
                                    directly from the admin panel.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="close-student-form"
                                onClick={closeAddForm}
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            className="student-form"
                            onSubmit={handleCreateStudent}
                        >
                            <div className="student-form-grid">

                                <div className="student-form-group">
                                    <label htmlFor="studentName">
                                        Student Name
                                    </label>

                                    <input
                                        id="studentName"
                                        type="text"
                                        name="name"
                                        placeholder="Enter student name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="student-form-group">
                                    <label htmlFor="studentEmail">
                                        Email Address
                                    </label>

                                    <input
                                        id="studentEmail"
                                        type="email"
                                        name="email"
                                        placeholder="Enter student email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="student-form-group">
                                    <label htmlFor="studentPassword">
                                        Temporary Password
                                    </label>

                                    <input
                                        id="studentPassword"
                                        type="password"
                                        name="password"
                                        placeholder="Minimum 6 characters"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="student-form-note">
                                <ShieldCheck size={17} />

                                <span>
                                    The password will be securely
                                    hashed before it is stored.
                                </span>
                            </div>

                            <div className="student-form-actions">
                                <button
                                    type="button"
                                    className="cancel-student-btn"
                                    onClick={closeAddForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-student-btn"
                                    disabled={saving}
                                >
                                    <UserPlus size={16} />

                                    {saving
                                        ? "Creating..."
                                        : "Create Student"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Students List */}
                <section className="students-list-card">
                    <div className="students-list-header">
                        <div>
                            <h2>All Students</h2>

                            <p>
                                Search by student name or email
                            </p>
                        </div>

                        <div className="student-search">
                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search students..."
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="students-empty">
                            <Users size={38} />

                            <h3>Loading students...</h3>

                            <p>
                                Please wait while the accounts
                                are loaded.
                            </p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="students-empty">
                            <Users size={38} />

                            <h3>No students found</h3>

                            <p>
                                Try another search or add a
                                new student.
                            </p>

                            <button
                                type="button"
                                className="empty-add-student-btn"
                                onClick={openAddForm}
                            >
                                <UserPlus size={16} />
                                Add Student
                            </button>
                        </div>
                    ) : (
                        <div className="students-grid">
                            {students.map((student) => (
                                <article
                                    className="student-card"
                                    key={student._id}
                                >
                                    {/* Student Status */}
                                    <div className="student-card-top">
                                        <div className="student-avatar">
                                            {student.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <span
                                            className={
                                                student.isActive
                                                    ? "student-status active"
                                                    : "student-status inactive"
                                            }
                                        >
                                            {student.isActive
                                                ? "ACTIVE"
                                                : "INACTIVE"}
                                        </span>
                                    </div>

                                    {/* Student Details */}
                                    <h3>{student.name}</h3>

                                    <div className="student-detail">
                                        <Mail size={15} />

                                        <span>{student.email}</span>
                                    </div>

                                    <div className="student-detail">
                                        <CalendarDays size={15} />

                                        <span>
                                            Joined{" "}
                                            {formatDate(student.createdAt)}
                                        </span>
                                    </div>

                                    <div className="student-detail">
                                        {student.isActive ? (
                                            <>
                                                <UserCheck size={15} />

                                                <span>
                                                    Account is active
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <UserX size={15} />

                                                <span>
                                                    Account is inactive
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Student Account Actions */}
                                    <div className="student-card-action">
                                        {student.isActive ? (
                                            <button
                                                type="button"
                                                className="deactivate-student-btn"
                                                disabled={
                                                    actionLoading ===
                                                    student._id
                                                }
                                                onClick={() =>
                                                    handleDeactivate(student)
                                                }
                                            >
                                                <UserX size={16} />

                                                {actionLoading === student._id
                                                    ? "Deactivating..."
                                                    : "Deactivate Account"}
                                            </button>
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "8px",
                                                    width: "100%"
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="activate-student-btn"
                                                    disabled={
                                                        actionLoading ===
                                                        student._id
                                                    }
                                                    onClick={() =>
                                                        handleActivate(student)
                                                    }
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        backgroundColor: "#15803d",
                                                        color: "#ffffff",
                                                        fontWeight: 600,
                                                        cursor: actionLoading === student._id
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        opacity: actionLoading === student._id
                                                            ? 0.7
                                                            : 1
                                                    }}
                                                >
                                                    <UserCheck size={16} />

                                                    {actionLoading === student._id
                                                        ? "Activating..."
                                                        : "Activate Student"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="permanent-delete-student-btn"
                                                    disabled={
                                                        actionLoading ===
                                                        student._id
                                                    }
                                                    onClick={() =>
                                                        handlePermanentDelete(student)
                                                    }
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "8px",
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "1px solid #fecaca",
                                                        borderRadius: "8px",
                                                        backgroundColor: "#fef2f2",
                                                        color: "#b91c1c",
                                                        fontWeight: 600,
                                                        cursor: actionLoading === student._id
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        opacity: actionLoading === student._id
                                                            ? 0.7
                                                            : 1
                                                    }}
                                                >
                                                    <Trash2 size={16} />

                                                    {actionLoading === student._id
                                                        ? "Processing..."
                                                        : "Permanently Delete"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default ManageStudents;