import { useState, useEffect } from "react";
import * as AdminApi from "./adminApi";

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    font-family: 'Inter', sans-serif;
    background: #0f172a;
    color: #f1f5f9;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  input, select, textarea {
    color-scheme: light;
    background-color: #fff !important;
    color: #1a1a2e !important;
  }

  /* ── Login ── */
  .admin-login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  .admin-login-card {
    background: #1e293b;
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    border: 1px solid #334155;
  }
  .admin-logo { text-align: center; margin-bottom: 2rem; }
  .admin-logo h1 {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }
  .admin-logo p {
    font-size: 0.8125rem;
    color: #94a3b8;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .admin-field { margin-bottom: 1.25rem; }
  .admin-field label {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #cbd5e1;
    margin-bottom: 6px;
  }
  .admin-field input {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #334155;
    border-radius: 8px;
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.18s;
  }
  .admin-field input:focus { border-color: #3b82f6; }
  .admin-submit-btn {
    width: 100%;
    padding: 13px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    margin-top: 0.5rem;
  }
  .admin-submit-btn:hover { background: #2563eb; }
  .admin-submit-btn:disabled { background: #475569; cursor: not-allowed; }
  .admin-error {
    background: #7f1d1d;
    color: #fecaca;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.8125rem;
    margin-bottom: 1rem;
  }

  /* ── Layout ── */
  .admin-shell {
    display: flex;
    min-height: 100vh;
  }
  .admin-sidebar {
    width: 240px;
    background: #1e293b;
    border-right: 1px solid #334155;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;
    flex-shrink: 0;
  }
  .admin-sidebar-logo {
    font-family: 'Sora', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    padding: 0 1.5rem 1.5rem;
    border-bottom: 1px solid #334155;
    margin-bottom: 1rem;
  }
  .admin-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 1.5rem;
    color: #94a3b8;
    cursor: pointer;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.15s;
    border-left: 3px solid transparent;
  }
  .admin-nav-item:hover { background: #273449; color: #e2e8f0; }
  .admin-nav-item.active {
    background: #273449;
    color: #fff;
    border-left-color: #3b82f6;
  }
  .admin-nav-spacer { flex: 1; }
  .admin-main {
    flex: 1;
    padding: 2rem;
    overflow-x: hidden;
  }
  .admin-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  .admin-topbar h1 {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
  }
  .admin-topbar-user {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  /* ── Dashboard cards ── */
  .admin-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  .admin-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
  }
  .admin-card-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .admin-card-value {
    font-size: 1.625rem;
    font-weight: 700;
    color: #fff;
  }
  .admin-card-value.positive { color: #4ade80; }
  .admin-card-value.negative { color: #f87171; }

  @media (max-width: 768px) {
    .admin-shell { flex-direction: column; }
    .admin-sidebar {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      padding: 0.75rem 0;
      border-right: none;
      border-bottom: 1px solid #334155;
    }
    .admin-sidebar-logo { display: none; }
    .admin-nav-item {
      padding: 8px 14px;
      border-left: none;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
    }
    .admin-nav-item.active { border-left-color: transparent; border-bottom-color: #3b82f6; }
    .admin-nav-spacer { display: none; }
    .admin-main { padding: 1rem; }
  }
`;

function AdminLoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const data = await AdminApi.adminLogin(email, password);
            localStorage.setItem("admin_token", data.token);
            onLoginSuccess({ name: data.user.name, email: data.user.email });
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-login-wrap">
            <div className="admin-login-card">
                <div className="admin-logo">
                    <h1>✈ SkyWay Admin</h1>
                    <p>Administrator Portal</p>
                </div>

                {error && <div className="admin-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="admin-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@skyway.com"
                            autoComplete="username"
                        />
                    </div>
                    <div className="admin-field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "flights", label: "Flights", icon: "✈️" },
    { key: "reservations", label: "Reservations", icon: "🎫" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "analytics", label: "Analytics", icon: "📈" },
];

function AdminSidebar({ activePage, onNavigate, onLogout }) {
    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-logo">✈ SkyWay Admin</div>
            {NAV_ITEMS.map(item => (
                <div
                    key={item.key}
                    className={`admin-nav-item ${activePage === item.key ? "active" : ""}`}
                    onClick={() => onNavigate(item.key)}
                >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                </div>
            ))}
            <div className="admin-nav-spacer" />
            <div className="admin-nav-item" onClick={onLogout}>
                <span>🚪</span>
                <span>Logout</span>
            </div>
        </div>
    );
}

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        AdminApi.getDashboardSummary()
            .then(setSummary)
            .catch(() => setError("Failed to load dashboard data."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ color: "#94a3b8" }}>Loading dashboard…</p>;
    if (error) return <p style={{ color: "#f87171" }}>{error}</p>;

    const cards = [
        { label: "Total Users", value: summary.totalUsers },
        { label: "Total Flights", value: summary.totalFlights },
        { label: "Total Reservations", value: summary.totalReservations },
        { label: "Active Reservations", value: summary.activeReservations, cls: "positive" },
        { label: "Cancelled Reservations", value: summary.cancelledReservations, cls: "negative" },
        { label: "Total Revenue", value: fmt(summary.totalRevenue) },
        { label: "Total Refunds", value: fmt(summary.totalRefunds), cls: "negative" },
        { label: "Net Revenue", value: fmt(summary.netRevenue), cls: "positive" },
        { label: "Today's Bookings", value: summary.todaysBookings },
        { label: "Current Month Bookings", value: summary.currentMonthBookings },
    ];

    return (
        <div className="admin-cards-grid">
            {cards.map(c => (
                <div className="admin-card" key={c.label}>
                    <div className="admin-card-label">{c.label}</div>
                    <div className={`admin-card-value ${c.cls || ""}`}>{c.value}</div>
                </div>
            ))}
        </div>
    );
}

function AdminPlaceholder({ title }) {
    return (
        <div style={{ color: "#94a3b8" }}>
            <p>{title} management will be built in the next phase.</p>
        </div>
    );
}

function AdminShell({ admin, onLogout }) {
    const [activePage, setActivePage] = useState("dashboard");

    const titles = {
        dashboard: "Dashboard",
        flights: "Flight Management",
        reservations: "Reservation Management",
        users: "User Management",
        analytics: "Business Analytics",
    };

    return (
        <div className="admin-shell">
            <AdminSidebar activePage={activePage} onNavigate={setActivePage} onLogout={onLogout} />
            <div className="admin-main">
                <div className="admin-topbar">
                    <h1>{titles[activePage]}</h1>
                    <div className="admin-topbar-user">{admin.name}</div>
                </div>

                {activePage === "dashboard" && <AdminDashboard />}
                {activePage === "flights" && <AdminPlaceholder title="Flight" />}
                {activePage === "reservations" && <AdminPlaceholder title="Reservation" />}
                {activePage === "users" && <AdminPlaceholder title="User" />}
                {activePage === "analytics" && <AdminPlaceholder title="Analytics" />}
            </div>
        </div>
    );
}

export default function AdminApp() {
    const [admin, setAdmin] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            AdminApi.verifyAdminSession()
                .then(data => setAdmin({ name: data.name, email: data.email }))
                .catch(() => localStorage.removeItem("admin_token"))
                .finally(() => setCheckingAuth(false));
        } else {
            setCheckingAuth(false);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("admin_token");
        setAdmin(null);
    }

    return (
        <>
            <style>{adminStyles}</style>
            {checkingAuth ? null : admin ? (
                <AdminShell admin={admin} onLogout={handleLogout} />
            ) : (
                <AdminLoginPage onLoginSuccess={setAdmin} />
            )}
        </>
    );
}