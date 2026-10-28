
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import StudentDashboard from "./pages/StudentDashboard";
import BusRoutes from "./pages/BusRoutes";
import ApplyPass from "./pages/ApplyPass";
import MyPass from "./pages/MyPass";

import AdminDashboard from "./pages/AdminDashboard";
import ManageRoutes from "./pages/ManageRoutes";
import ManageStudents from "./pages/ManageStudents";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/routes"
                    element={<BusRoutes />}
                />

                {/* STUDENT ROUTES */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/apply-pass"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <ApplyPass />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-pass"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <MyPass />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN ROUTES */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/routes"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <ManageRoutes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/students"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <ManageStudents />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                {/* COMMON AUTHENTICATED ROUTE */}
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
