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
                {activePage === "flights" && <AdminFlightManagement />}
                {activePage === "reservations" && <AdminReservationManagement />}
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

function computeFlightStatus(flight) {
    const now = new Date();
    const departure = new Date(`${flight.journeyDate}T${flight.departureTime}`);
    const arrival = new Date(`${flight.journeyDate}T${flight.arrivalTime}`);
    if (!flight.active) return "CANCELLED";
    if (now < departure) return "SCHEDULED";
    if (now < arrival) return "DEPARTED";
    return "COMPLETED";
}

function AdminFlightManagement() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ source: "", destination: "", date: "", flightNumber: "" });
    const [showForm, setShowForm] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);

    function loadAll() {
        setLoading(true);
        AdminApi.getAllAdminFlights().then(setFlights).finally(() => setLoading(false));
    }

    useEffect(() => { loadAll(); }, []);

    function handleSearch() {
        const params = {};
        if (filters.source) params.source = filters.source;
        if (filters.destination) params.destination = filters.destination;
        if (filters.date) params.date = filters.date;
        if (filters.flightNumber) params.flightNumber = filters.flightNumber;

        setLoading(true);
        AdminApi.searchAdminFlights(params).then(setFlights).finally(() => setLoading(false));
    }

    function clearFilters() {
        setFilters({ source: "", destination: "", date: "", flightNumber: "" });
        loadAll();
    }

    function openAddForm() {
        setEditingFlight(null);
        setShowForm(true);
    }

    function openEditForm(flight) {
        setEditingFlight(flight);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Permanently delete this flight? This cannot be undone.")) return;
        try {
            await AdminApi.deleteFlight(id);
            loadAll();
        } catch (err) {
            alert(err.response?.data?.error || "Could not delete flight (it may have existing bookings).");
        }
    }

    async function handleToggleActive(flight) {
        if (flight.active) {
            await AdminApi.deactivateFlight(flight.flightId);
        } else {
            await AdminApi.activateFlight(flight.flightId);
        }
        loadAll();
    }

    return (
        <div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 12 }}>
                    <input placeholder="Source" value={filters.source} onChange={e => setFilters({ ...filters, source: e.target.value })} style={inputStyle} />
                    <input placeholder="Destination" value={filters.destination} onChange={e => setFilters({ ...filters, destination: e.target.value })} style={inputStyle} />
                    <input type="date" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} style={inputStyle} />
                    <input placeholder="Flight Number" value={filters.flightNumber} onChange={e => setFilters({ ...filters, flightNumber: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSearch} style={btnPrimary}>Search</button>
                    <button onClick={clearFilters} style={btnSecondary}>Clear</button>
                    <div style={{ flex: 1 }} />
                    <button onClick={openAddForm} style={btnPrimary}>+ Add Flight</button>
                </div>
            </div>

            {loading ? <p style={{ color: "#94a3b8" }}>Loading flights…</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {["Flight No.", "Source", "Destination", "Date", "Dep.", "Arr.", "Price", "Seats", "Status", "Actions"].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map(f => {
                                const status = computeFlightStatus(f);
                                return (
                                    <tr key={f.flightId} style={{ borderBottom: "1px solid #334155" }}>
                                        <td style={tdStyle}>{f.flightNumber}</td>
                                        <td style={tdStyle}>{f.source}</td>
                                        <td style={tdStyle}>{f.destination}</td>
                                        <td style={tdStyle}>{f.journeyDate}</td>
                                        <td style={tdStyle}>{f.departureTime}</td>
                                        <td style={tdStyle}>{f.arrivalTime}</td>
                                        <td style={tdStyle}>{fmt(f.price)}</td>
                                        <td style={tdStyle}>{f.availableSeats}/{f.totalSeats}</td>
                                        <td style={tdStyle}>
                                            <span style={statusBadgeStyle(status)}>{status}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                <button onClick={() => openEditForm(f)} style={btnTiny}>Edit</button>
                                                <button onClick={() => handleToggleActive(f)} style={btnTiny}>
                                                    {f.active ? "Deactivate" : "Activate"}
                                                </button>
                                                <button onClick={() => handleDelete(f.flightId)} style={btnTinyDanger}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <FlightFormModal
                    flight={editingFlight}
                    onClose={() => setShowForm(false)}
                    onSaved={() => { setShowForm(false); loadAll(); }}
                />
            )}
        </div>
    );
}

function FlightFormModal({ flight, onClose, onSaved }) {
    const [form, setForm] = useState(flight ? {
        airlineCode: flight.airlineCode, airlineName: flight.airlineName,
        flightNumber: flight.flightNumber, source: flight.source, destination: flight.destination,
        departureTime: flight.departureTime, arrivalTime: flight.arrivalTime,
        journeyDate: flight.journeyDate, price: flight.price, totalSeats: flight.totalSeats,
        duration: flight.duration || ""
    } : {
        airlineCode: "", airlineName: "", flightNumber: "", source: "", destination: "",
        departureTime: "", arrivalTime: "", journeyDate: "", price: "", totalSeats: "", duration: ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function update(field, val) {
        setForm({ ...form, [field]: val });
    }

    async function handleSave() {
        setError("");
        setSaving(true);
        try {
            const payload = { ...form, price: parseFloat(form.price), totalSeats: parseInt(form.totalSeats) };
            if (flight) {
                await AdminApi.updateFlight(flight.flightId, payload);
            } else {
                await AdminApi.createFlight(payload);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save flight.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={modalOverlayStyle}>
            <div style={modalCardStyle}>
                <h2 style={{ color: "#fff", marginBottom: 16, fontFamily: "Sora, sans-serif" }}>
                    {flight ? "Edit Flight" : "Add Flight"}
                </h2>
                {error && <div className="admin-error">{error}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <FormField label="Airline Code" value={form.airlineCode} onChange={v => update("airlineCode", v)} />
                    <FormField label="Airline Name" value={form.airlineName} onChange={v => update("airlineName", v)} />
                    <FormField label="Flight Number" value={form.flightNumber} onChange={v => update("flightNumber", v)} />
                    <FormField label="Duration (e.g. 2h 10m)" value={form.duration} onChange={v => update("duration", v)} />
                    <FormField label="Source" value={form.source} onChange={v => update("source", v)} />
                    <FormField label="Destination" value={form.destination} onChange={v => update("destination", v)} />
                    <FormField label="Journey Date" type="date" value={form.journeyDate} onChange={v => update("journeyDate", v)} />
                    <FormField label="Price" type="number" value={form.price} onChange={v => update("price", v)} />
                    <FormField label="Departure Time" type="time" value={form.departureTime} onChange={v => update("departureTime", v)} />
                    <FormField label="Arrival Time" type="time" value={form.arrivalTime} onChange={v => update("arrivalTime", v)} />
                    <FormField label="Total Seats" type="number" value={form.totalSeats} onChange={v => update("totalSeats", v)} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button onClick={handleSave} disabled={saving} style={btnPrimary}>
                        {saving ? "Saving…" : "Save Flight"}
                    </button>
                    <button onClick={onClose} style={btnSecondary}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
}

// ── Shared inline styles for admin tables/forms ──
const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #334155", fontSize: "0.875rem" };
const btnPrimary = { padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 };
const btnSecondary = { padding: "8px 16px", background: "#334155", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 };
const btnTiny = { padding: "5px 10px", background: "#334155", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem" };
const btnTinyDanger = { padding: "5px 10px", background: "#7f1d1d", color: "#fecaca", border: "none", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem" };
const tableStyle = { width: "100%", borderCollapse: "collapse", background: "#1e293b", borderRadius: 8 };
const thStyle = { textAlign: "left", padding: "10px 12px", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #334155" };
const tdStyle = { padding: "10px 12px", fontSize: "0.875rem", color: "#e2e8f0" };
const modalOverlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" };
const modalCardStyle = { background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "1.5rem", maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" };

function statusBadgeStyle(status) {
    const colors = {
        SCHEDULED: { bg: "#1e3a5f", fg: "#60a5fa" },
        DEPARTED: { bg: "#3f2d1e", fg: "#fbbf24" },
        COMPLETED: { bg: "#1e3a2e", fg: "#4ade80" },
        CANCELLED: { bg: "#3f1e1e", fg: "#f87171" },
    };
    const c = colors[status] || colors.SCHEDULED;
    return { background: c.bg, color: c.fg, padding: "3px 10px", borderRadius: 12, fontSize: "0.6875rem", fontWeight: 700 };
}

function AdminReservationManagement() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ pnr: "", passengerName: "", flightNumber: "", email: "", bookingDate: "" });
    const [expandedPnr, setExpandedPnr] = useState(null);

    function loadAll() {
        setLoading(true);
        AdminApi.getAllAdminReservations().then(setReservations).finally(() => setLoading(false));
    }

    useEffect(() => { loadAll(); }, []);

    function handleSearch() {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        setLoading(true);
        AdminApi.searchAdminReservations(params).then(setReservations).finally(() => setLoading(false));
    }

    function clearFilters() {
        setFilters({ pnr: "", passengerName: "", flightNumber: "", email: "", bookingDate: "" });
        loadAll();
    }

    return (
        <div>
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 12 }}>
                    <input placeholder="PNR" value={filters.pnr} onChange={e => setFilters({ ...filters, pnr: e.target.value })} style={inputStyle} />
                    <input placeholder="Passenger Name" value={filters.passengerName} onChange={e => setFilters({ ...filters, passengerName: e.target.value })} style={inputStyle} />
                    <input placeholder="Flight Number" value={filters.flightNumber} onChange={e => setFilters({ ...filters, flightNumber: e.target.value })} style={inputStyle} />
                    <input placeholder="Email" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} style={inputStyle} />
                    <input type="date" value={filters.bookingDate} onChange={e => setFilters({ ...filters, bookingDate: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSearch} style={btnPrimary}>Search</button>
                    <button onClick={clearFilters} style={btnSecondary}>Clear</button>
                </div>
            </div>

            {loading ? <p style={{ color: "#94a3b8" }}>Loading reservations…</p> : (
                reservations.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>No reservations found.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {reservations.map(r => {
                            const isExpanded = expandedPnr === r.pnr;
                            return (
                                <div key={r.pnr} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "1rem 1.25rem" }}>
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                                        onClick={() => setExpandedPnr(isExpanded ? null : r.pnr)}
                                    >
                                        <div>
                                            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#60a5fa", marginRight: 12 }}>{r.pnr}</span>
                                            <span style={{ color: "#e2e8f0" }}>{r.flight?.source} → {r.flight?.destination}</span>
                                            <span style={{ color: "#94a3b8", marginLeft: 12, fontSize: "0.8125rem" }}>
                                                {r.flight?.flightNumber} · {r.flight?.journeyDate}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={statusBadgeStyle(r.status === "ACTIVE" ? "SCHEDULED" : "CANCELLED")}>{r.status}</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>{isExpanded ? "▲" : "▼"}</span>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #334155" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 12, fontSize: "0.8125rem" }}>
                                                <DetailItem label="Customer Email" value={r.user?.email} />
                                                <DetailItem label="Booked At" value={new Date(r.bookedAt).toLocaleString()} />
                                                <DetailItem label="Cancelled At" value={r.cancelledAt ? new Date(r.cancelledAt).toLocaleString() : "—"} />
                                                <DetailItem label="Total Paid" value={fmt(r.totalPrice)} />
                                                <DetailItem label="Refund Amount" value={r.refundAmount > 0 ? fmt(r.refundAmount) : "—"} />
                                            </div>
                                            <table style={{ ...tableStyle, background: "#0f172a" }}>
                                                <thead>
                                                    <tr>
                                                        {["Passenger", "Seat", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {r.passengers?.map(p => (
                                                        <tr key={p.passengerId} style={{ borderBottom: "1px solid #334155" }}>
                                                            <td style={tdStyle}>{p.passengerName}</td>
                                                            <td style={tdStyle}>{p.seatNumber}</td>
                                                            <td style={tdStyle}>
                                                                <span style={statusBadgeStyle(p.status === "CONFIRMED" ? "SCHEDULED" : "CANCELLED")}>
                                                                    {p.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div>
            <div style={{ color: "#94a3b8", fontSize: "0.6875rem", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
            <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{value || "—"}</div>
        </div>
    );
}