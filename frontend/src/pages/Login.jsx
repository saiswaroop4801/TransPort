import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BusFront,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            window.dispatchEvent(
                new Event("authChanged")
            );

            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-wrapper">

                <section className="auth-info">

                    <div className="auth-brand">

                        <div className="auth-brand-icon">
                            <BusFront size={30} />
                        </div>

                        <div>
                            <h2>CampusRide</h2>

                            <p>
                                SMART CAMPUS TRANSPORT
                            </p>
                        </div>

                    </div>

                    <div className="auth-info-content">

                        <span className="auth-eyebrow">
                            CAMPUS TRANSPORT
                        </span>

                        <h1>
                            Your campus commute,
                            <span> made simple.</span>
                        </h1>

                        <p>
                            Manage your transport pass, explore
                            bus routes and stay connected with
                            your campus transport system.
                        </p>

                        <div className="auth-feature">

                            <div className="auth-feature-icon">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <strong>
                                    Secure Access
                                </strong>

                                <span>
                                    Your account is protected with
                                    secure authentication.
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="auth-card">

                    <div className="auth-card-header">

                        <div className="auth-mobile-icon">
                            <BusFront size={24} />
                        </div>

                        <span className="auth-card-label">
                            WELCOME BACK
                        </span>

                        <h1>
                            Sign in to CampusRide
                        </h1>

                        <p>
                            Access your dashboard and manage
                            your campus transport.
                        </p>

                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={18} />

                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <Mail size={18} />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <Lock size={18} />

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                            </div>

                            <Link
                                to="/forgot-password"
                                className="forgot-password-link"
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>
                            New to CampusRide?
                        </span>
                    </div>

                    <Link
                        to="/register"
                        className="auth-secondary-button"
                    >
                        Create an Account
                    </Link>

                </section>

            </div>
        </main>
    );
}

export default Login;