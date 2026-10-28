import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Settings as SettingsIcon,
    LockKeyhole,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import api from "../services/api";

function Settings() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.put(
                "/auth/change-password",
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );

            setSuccess(
                response.data.message ||
                "Password changed successfully."
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="settings-page">
            <div className="settings-wrapper">

                <Link
                    to="/dashboard"
                    className="settings-back-link"
                >
                    <ArrowLeft size={17} />
                    Back
                </Link>

                <section className="settings-header">
                    <div className="settings-title-icon">
                        <SettingsIcon size={24} />
                    </div>

                    <div>
                        <span className="settings-label">
                            ACCOUNT SETTINGS
                        </span>

                        <h1>Settings</h1>

                        <p>
                            Manage your account security and preferences.
                        </p>
                    </div>
                </section>

                <section className="settings-card">

                    <div className="settings-card-heading">
                        <div className="settings-section-icon">
                            <LockKeyhole size={21} />
                        </div>

                        <div>
                            <h2>Change Password</h2>
                            <p>
                                Keep your CampusRide account secure by
                                updating your password.
                            </p>
                        </div>
                    </div>

                    {success && (
                        <div className="settings-success">
                            <CheckCircle2 size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="settings-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="settings-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="settings-form-group">
                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                name="currentPassword"
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="settings-form-group">
                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="settings-form-group">
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="password-note">
                            <ShieldCheck size={18} />

                            <span>
                                Use at least 6 characters and choose a
                                password that is different from your
                                current password.
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="change-password-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Change Password"
                            }
                        </button>

                    </form>

                </section>

            </div>
        </main>
    );
}

export default Settings;