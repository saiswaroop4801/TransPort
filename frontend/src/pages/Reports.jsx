import { useEffect, useState } from "react";

import {
    BarChart3,
    Users,
    FileText,
    CheckCircle2,
    XCircle,
    Clock3,
    AlertCircle,
    ArrowLeft,
    Route as RouteIcon,
    Download
} from "lucide-react";

import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../services/api";

function Reports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/reports");

            setReport(response.data.report);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    // Download the complete transport report as a PDF
    const downloadReport = () => {
        if (!report) {
            return;
        }

        const doc = new jsPDF();

        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        // Report heading
        doc.setTextColor(16, 35, 63);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("CampusRide", 20, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Smart Campus Transport", 20, 27);

        doc.setTextColor(16, 35, 63);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Transport Report", 20, 42);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${today}`, 20, 50);

        doc.setDrawColor(220, 225, 232);
        doc.line(20, 56, 190, 56);

        // Summary heading
        doc.setTextColor(16, 35, 63);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Summary", 20, 70);

        // Include revoked applications in the PDF summary
        const summary = [
            `Total Students: ${report.totalStudents ?? 0}`,
            `Total Applications: ${report.totalApplications ?? 0}`,
            `Approved Applications: ${report.approvedApplications ?? 0}`,
            `Rejected Applications: ${report.rejectedApplications ?? 0}`,
            `Pending Applications: ${report.pendingApplications ?? 0}`,
            `Expired Applications: ${report.expiredApplications ?? 0}`,
            `Revoked Applications: ${report.revokedApplications ?? 0}`
        ];

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 64, 84);

        summary.forEach((item, index) => {
            doc.text(item, 25, 82 + index * 9);
        });

        // Position route analysis below the summary
        let y = Math.max(
            145,
            82 + summary.length * 9 + 18
        );

        doc.setTextColor(16, 35, 63);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("Route-wise Applications", 20, y);

        y += 12;

        const drawRouteTableHeader = () => {
            doc.setFillColor(248, 250, 252);
            doc.rect(20, y - 7, 170, 10, "F");

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 84, 103);

            doc.text("Route", 23, y);
            doc.text("Bus", 120, y);
            doc.text("Applications", 158, y);

            y += 10;

            doc.setFont("helvetica", "normal");
            doc.setTextColor(52, 64, 84);
        };

        drawRouteTableHeader();

        const routes = report.routeWiseApplications || [];

        if (routes.length === 0) {
            doc.text("No route data available.", 23, y);
            y += 10;
        }

        routes.forEach((route) => {
            const routeName =
                route.routeName || "Unknown Route";

            const busNumber =
                route.busNumber || "-";

            const applications =
                String(route.applications ?? 0);

            const splitRouteName = doc.splitTextToSize(
                routeName,
                88
            );

            const rowHeight = Math.max(
                9,
                splitRouteName.length * 5
            );

            // Add another page before a row would overflow
            if (y + rowHeight > 275) {
                doc.addPage();

                y = 20;

                doc.setTextColor(16, 35, 63);
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");

                doc.text(
                    "Route-wise Applications (Continued)",
                    20,
                    y
                );

                y += 12;

                drawRouteTableHeader();
            }

            doc.text(splitRouteName, 23, y);
            doc.text(busNumber, 120, y);
            doc.text(applications, 165, y);

            y += rowHeight;
        });

        // Footer on every PDF page
        const pageCount = doc.getNumberOfPages();

        for (let page = 1; page <= pageCount; page++) {
            doc.setPage(page);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(120, 128, 140);

            doc.text(
                "CampusRide - Smart Campus Transport",
                20,
                288
            );
        }

        doc.save("CampusRide-Transport-Report.pdf");
    };

    if (loading) {
        return (
            <main className="reports-page">
                <div className="reports-wrapper">
                    <div className="reports-state">
                        <BarChart3 size={34} />

                        <h3>Loading reports</h3>

                        <p>
                            Fetching the latest transport statistics...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="reports-page">
                <div className="reports-wrapper">
                    <Link
                        to="/admin"
                        className="reports-back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <div className="reports-error-card">
                        <AlertCircle size={30} />

                        <h3>Unable to load reports</h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="reports-retry-btn"
                            onClick={fetchReports}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="reports-page">
            <div className="reports-wrapper">
                <Link
                    to="/admin"
                    className="reports-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <section className="reports-header">
                    <div className="reports-header-content">
                        <span className="reports-eyebrow">
                            ADMIN REPORTS
                        </span>

                        <h1>
                            Transport Reports
                            <span>.</span>
                        </h1>

                        <p>
                            View application statistics and
                            route-wise transport activity.
                        </p>
                    </div>

                    <div className="reports-header-actions">
                        <button
                            type="button"
                            className="download-report-btn"
                            onClick={downloadReport}
                            disabled={!report}
                        >
                            <Download size={17} />
                            Download Report
                        </button>

                        <div className="reports-header-card">
                            <div className="reports-header-icon">
                                <BarChart3 size={28} />
                            </div>

                            <div>
                                <strong>Transport Analytics</strong>

                                <span>
                                    Updated from live database
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="reports-stat-grid">
                    <div className="reports-stat-card">
                        <div className="reports-stat-icon blue">
                            <Users size={22} />
                        </div>

                        <div>
                            <span>Total Students</span>

                            <strong>
                                {report?.totalStudents ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="reports-stat-card">
                        <div className="reports-stat-icon purple">
                            <FileText size={22} />
                        </div>

                        <div>
                            <span>Total Applications</span>

                            <strong>
                                {report?.totalApplications ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="reports-stat-card">
                        <div className="reports-stat-icon green">
                            <CheckCircle2 size={22} />
                        </div>

                        <div>
                            <span>Approved</span>

                            <strong>
                                {report?.approvedApplications ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="reports-stat-card">
                        <div className="reports-stat-icon red">
                            <XCircle size={22} />
                        </div>

                        <div>
                            <span>Rejected</span>

                            <strong>
                                {report?.rejectedApplications ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="reports-stat-card">
                        <div className="reports-stat-icon orange">
                            <Clock3 size={22} />
                        </div>

                        <div>
                            <span>Pending</span>

                            <strong>
                                {report?.pendingApplications ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="reports-stat-card">
                        <div className="reports-stat-icon gray">
                            <AlertCircle size={22} />
                        </div>

                        <div>
                            <span>Expired</span>

                            <strong>
                                {report?.expiredApplications ?? 0}
                            </strong>
                        </div>
                    </div>

                    {/* New: Revoked applications */}
                    <div className="reports-stat-card">
                        <div className="reports-stat-icon gray">
                            <XCircle size={22} />
                        </div>

                        <div>
                            <span>Revoked</span>

                            <strong>
                                {report?.revokedApplications ?? 0}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* Route Analysis */}
                <section className="route-analysis-card">
                    <div className="route-analysis-header">
                        <div>
                            <span className="reports-eyebrow">
                                ROUTE ANALYSIS
                            </span>

                            <h2>Route-wise Applications</h2>

                            <p>
                                Number of transport pass applications
                                for each route.
                            </p>
                        </div>

                        <div className="route-analysis-icon">
                            <RouteIcon size={23} />
                        </div>
                    </div>

                    {!report?.routeWiseApplications ||
                    report.routeWiseApplications.length === 0 ? (
                        <div className="route-empty">
                            <RouteIcon size={30} />

                            <h3>No route data available</h3>

                            <p>
                                Transport applications will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="route-analysis-grid">
                            {report.routeWiseApplications.map(
                                (route, index) => (
                                    <div
                                        className="route-report-card"
                                        key={
                                            route.routeName
                                                ? `${route.routeName}-${index}`
                                                : index
                                        }
                                    >
                                        <div className="route-report-top">
                                            <div className="route-report-icon">
                                                <RouteIcon size={21} />
                                            </div>

                                            <span className="route-report-count">
                                                {route.applications ?? 0}
                                            </span>
                                        </div>

                                        <h3>
                                            {route.routeName ||
                                                "Unknown Route"}
                                        </h3>

                                        <p>
                                            Bus {route.busNumber || "-"}
                                        </p>

                                        <div className="route-report-footer">
                                            <span>Applications</span>

                                            <strong>
                                                {route.applications ?? 0}
                                            </strong>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Reports;