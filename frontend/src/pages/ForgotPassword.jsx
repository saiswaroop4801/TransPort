
import { useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to reset password."
                );
            }

            setMessage(
                data.message || "Password reset successfully."
            );

            setFormData({
                email: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to the backend. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .cr-forgot-page {
                    min-height: 85vh;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    background: #f3f6fc;
                }

                .cr-forgot-card {
                    width: 100%;
                    max-width: 440px;
                    box-sizing: border-box;
                    padding: 35px;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    background: #ffffff;
                    box-shadow: 0 12px 35px rgba(20, 40, 80, 0.09);
                }

                .cr-forgot-icon {
                    width: 62px;
                    height: 62px;
                    margin: 0 auto 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    background: #eaf1ff;
                    font-size: 30px;
                }

                .cr-forgot-card h1 {
                    margin: 0 0 10px;
                    color: #172b4d;
                    font-size: 28px;
                    text-align: center;
                }

                .cr-forgot-subtitle {
                    margin: 0 0 25px;
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.6;
                    text-align: center;
                }

                .cr-forgot-card form {
                    display: flex;
                    flex-direction: column;
                }

                .cr-forgot-card label {
                    margin: 15px 0 7px;
                    color: #334155;
                    font-size: 14px;
                    font-weight: 600;
                }

                .cr-forgot-card input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 13px 14px;
                    border: 1px solid #cbd5e1;
                    border-radius: 9px;
                    outline: none;
                    background: #ffffff;
                    color: #172b4d;
                    font-size: 14px;
                }

                .cr-forgot-card input:focus {
                    border-color: #155eef;
                    box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.12);
                }

                .cr-forgot-submit {
                    width: 100%;
                    margin-top: 25px;
                    padding: 14px;
                    border: none;
                    border-radius: 9px;
                    background: #155eef;
                    color: #ffffff;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .cr-forgot-submit:hover {
                    background: #124dcc;
                }

                .cr-forgot-submit:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .cr-forgot-alert {
                    margin-bottom: 15px;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .cr-forgot-error {
                    border: 1px solid #fecaca;
                    background: #fef2f2;
                    color: #b91c1c;
                }

                .cr-forgot-success {
                    border: 1px solid #bbf7d0;
                    background: #f0fdf4;
                    color: #166534;
                }

                .cr-forgot-back {
                    margin: 23px 0 0;
                    color: #64748b;
                    font-size: 14px;
                    text-align: center;
                }

                .cr-forgot-back a {
                    color: #155eef;
                    font-weight: 600;
                    text-decoration: none;
                }

                .cr-forgot-back a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .cr-forgot-card {
                        padding: 25px 20px;
                    }

                    .cr-forgot-card h1 {
                        font-size: 24px;
                    }
                }
            `}</style>

            <main className="cr-forgot-page">
                <section className="cr-forgot-card">
                    <div className="cr-forgot-icon">🔐</div>

                    <h1>Forgot Password?</h1>

                    <p className="cr-forgot-subtitle">
                        Enter your registered student email and
                        create a new password.
                    </p>

                    {error && (
                        <div
                            className="cr-forgot-alert cr-forgot-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {message && (
                        <div
                            className="cr-forgot-alert cr-forgot-success"
                            role="status"
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">
                            Registered Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />

                        <button
                            className="cr-forgot-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </button>
                    </form>

                    <p className="cr-forgot-back">
                        Remember your password?{" "}
                        <Link to="/login">Back to Login</Link>
                    </p>
                </section>
            </main>
        </>
    );
}
