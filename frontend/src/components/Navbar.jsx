import { useEffect, useState } from "react";

import {
    Link,
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    BusFront,
    LayoutDashboard,
    Ticket,
    LogIn,
    UserPlus,
    LogOut,
    Route as RouteIcon,
    Settings,
    Users,
    BarChart3
} from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            setUser(null);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();

        const handleAuthChange = () => {
            loadUser();
        };

        window.addEventListener(
            "authChanged",
            handleAuthChange
        );

        return () => {
            window.removeEventListener(
                "authChanged",
                handleAuthChange
            );
        };
    }, []);

    // CampusRide logo destination based on login and role
    const token = localStorage.getItem("token");

    const logoDestination =
        token && user?.role === "admin"
            ? "/admin"
            : token && user?.role === "student"
            ? "/dashboard"
            : "/";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new Event("authChanged")
        );

        navigate("/login");
    };

    const isHomePage = location.pathname === "/";

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* BRAND / LOGO */}

                <Link
                    to={logoDestination}
                    className="brand"
                >
                    <div className="brand-icon">
                        <BusFront size={28} />
                    </div>

                    <div className="brand-text">
                        <span className="brand-name">
                            CampusRide
                        </span>

                        <span className="brand-tagline">
                            SMART CAMPUS TRANSPORT
                        </span>
                    </div>
                </Link>


                {/* NAVIGATION */}

                <div className="nav-links">

                    {/* PUBLIC NAVIGATION */}

                    {(!user || isHomePage) && (
                        <>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `nav-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/routes"
                                className={({ isActive }) =>
                                    `nav-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >
                                <BusFront size={17} />
                                Bus Routes
                            </NavLink>

                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `nav-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >
                                <LogIn size={17} />
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `nav-register ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >
                                <UserPlus size={17} />
                                Get Started
                            </NavLink>
                        </>
                    )}


                    {/* STUDENT NAVIGATION */}

                    {user?.role === "student" &&
                        !isHomePage && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/routes"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <BusFront size={17} />
                                    Bus Routes
                                </NavLink>

                                <NavLink
                                    to="/my-pass"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <Ticket size={17} />
                                    My Pass
                                </NavLink>

                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <Settings size={17} />
                                    Settings
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="nav-logout"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </>
                        )}


                    {/* ADMIN NAVIGATION */}

                    {user?.role === "admin" &&
                        !isHomePage && (
                            <>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    to="/admin/routes"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <RouteIcon size={17} />
                                    Manage Routes
                                </NavLink>

                                <NavLink
                                    to="/admin/students"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <Users size={17} />
                                    Students
                                </NavLink>

                                <NavLink
                                    to="/admin/reports"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <BarChart3 size={17} />
                                    Reports
                                </NavLink>

                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        `nav-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    <Settings size={17} />
                                    Settings
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="nav-logout"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </>
                        )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;