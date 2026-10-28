import { Link } from "react-router-dom";
import {
    ArrowRight,
    BusFront,
    CheckCircle2,
    Clock3,
    MapPin,
    ShieldCheck,
    Users,
    Sparkles
} from "lucide-react";

function Home() {
    return (
        <main className="home-page">

            <section className="hero">
                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>

                <div className="hero-container">

                    <div className="hero-content">

                        <div className="hero-badge">
                            <Sparkles size={15} />
                            Smart Campus Transportation
                        </div>

                        <h1>
                            Your campus commute,
                            <span> made simple.</span>
                        </h1>

                        <p>
                            Apply for your transport pass, explore bus
                            routes, and track your application from one
                            simple and secure platform.
                        </p>

                        <div className="hero-actions">
                            <Link to="/register" className="primary-btn">
                                Get Started
                                <ArrowRight size={18} />
                            </Link>

                            <Link to="/routes" className="secondary-btn">
                                <BusFront size={18} />
                                Explore Routes
                            </Link>
                        </div>

                        <div className="hero-trust">
                            <div>
                                <CheckCircle2 size={18} />
                                Easy Application
                            </div>

                            <div>
                                <ShieldCheck size={18} />
                                Secure Access
                            </div>
                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="floating-label floating-label-top">
                            <CheckCircle2 size={17} />
                            <div>
                                <strong>Pass Approved</strong>
                                <span>Just now</span>
                            </div>
                        </div>

                        <div className="bus-card">

                            <div className="bus-card-top">

                                <div className="bus-icon">
                                    <BusFront size={30} />
                                </div>

                                <span className="status-badge">
                                    <span className="status-dot"></span>
                                    On Schedule
                                </span>

                            </div>

                            <div className="bus-card-heading">
                                <span>ACTIVE ROUTE</span>
                                <h3>Tadepalligudem → College</h3>
                                <p>Campus Express</p>
                            </div>

                            <div className="bus-number">
                                <span>BUS NUMBER</span>
                                <strong>AP37B1234</strong>
                            </div>

                            <div className="route-info">

                                <div>
                                    <MapPin size={18} />

                                    <span>
                                        <small>Pickup Point</small>
                                        Tadepalligudem Bus Stand
                                    </span>
                                </div>

                                <div>
                                    <Clock3 size={18} />

                                    <span>
                                        <small>Departure</small>
                                        08:15 AM
                                    </span>
                                </div>

                            </div>

                            <div className="seat-info">

                                <div>
                                    <Users size={18} />
                                    <span>35 seats available</span>
                                </div>

                                <span className="route-active">
                                    Active
                                </span>

                            </div>

                        </div>

                        <div className="floating-label floating-label-bottom">
                            <BusFront size={18} />

                            <div>
                                <strong>Daily Service</strong>
                                <span>Campus Transport</span>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


            <section className="stats-section">

                <div className="stats-container">

                    <div className="stat-card">
                        <div className="stat-icon">
                            <BusFront size={23} />
                        </div>

                        <div>
                            <strong>24+</strong>
                            <span>Bus Routes</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Users size={23} />
                        </div>

                        <div>
                            <strong>1,200+</strong>
                            <span>Students</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShieldCheck size={23} />
                        </div>

                        <div>
                            <strong>Secure</strong>
                            <span>Digital Passes</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Clock3 size={23} />
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Access</span>
                        </div>
                    </div>

                </div>

            </section>


            <section className="features-section">

                <div className="section-heading">

                    <span>WHY CAMPUSRIDE</span>

                    <h2>
                        Everything you need for your
                        <br />
                        daily commute.
                    </h2>

                    <p>
                        A simple digital experience for students
                        and administrators.
                    </p>

                </div>

                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            <BusFront size={25} />
                        </div>

                        <div className="feature-number">01</div>

                        <h3>Explore Bus Routes</h3>

                        <p>
                            Find available routes, pickup points,
                            departure times, and seat availability.
                        </p>

                        <Link to="/routes" className="feature-link">
                            View Routes
                            <ArrowRight size={16} />
                        </Link>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <CheckCircle2 size={25} />
                        </div>

                        <div className="feature-number">02</div>

                        <h3>Apply Online</h3>

                        <p>
                            Submit your transport pass application
                            without paperwork or long queues.
                        </p>

                        <Link to="/register" className="feature-link">
                            Apply Now
                            <ArrowRight size={16} />
                        </Link>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <ShieldCheck size={25} />
                        </div>

                        <div className="feature-number">03</div>

                        <h3>Track Your Pass</h3>

                        <p>
                            Check your application status and access
                            your approved pass anytime.
                        </p>

                        <Link to="/login" className="feature-link">
                            Check Status
                            <ArrowRight size={16} />
                        </Link>

                    </div>

                </div>

            </section>


            <section className="cta-section">

                <div className="cta-content">

                    <span>READY TO GET STARTED?</span>

                    <h2>
                        Make your campus commute easier.
                    </h2>

                    <p>
                        Create your account and manage your transport
                        pass digitally.
                    </p>

                </div>

                <Link to="/register" className="primary-btn">
                    Create Account
                    <ArrowRight size={18} />
                </Link>

            </section>

        </main>
    );
}

export default Home;