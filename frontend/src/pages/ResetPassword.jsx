import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    LockKeyhole,
    ArrowLeft,
    CheckCircle
} from "lucide-react";
import api from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    newPassword
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successfully."
            );

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="forgot-password-page">

            <div className="forgot-password-card">

                <div className="forgot-password-icon">
                    <LockKeyhole size={30} />
                </div>

                <span className="forgot-password-label">
                    ACCOUNT SECURITY
                </span>

                <h1>
                    Create New Password
                </h1>

                <p>
                    Enter and confirm your new password.
                </p>

                {error && (
                    <div className="forgot-message error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="forgot-message success">
                        <CheckCircle size={17} />
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label htmlFor="new-password">
                        New Password
                    </label>

                    <div className="forgot-input">
                        <LockKeyhole size={18} />

                        <input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>

                    <div className="forgot-input">
                        <LockKeyhole size={18} />

                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

                <Link
                    to="/login"
                    className="forgot-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </Link>

            </div>

        </main>
    );
}

export default ResetPassword;