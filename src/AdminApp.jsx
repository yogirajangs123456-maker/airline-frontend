import { useState, useCallback } from "react";
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
  .admin-logo {
    text-align: center;
    margin-bottom: 2rem;
  }
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
  .admin-field input:focus {
    border-color: #3b82f6;
  }
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

function AdminDashboardPlaceholder({ admin, onLogout }) {
    return (
        <div style={{ padding: "2rem", color: "#f1f5f9" }}>
            <h1>Welcome, {admin.name}</h1>
            <p style={{ color: "#94a3b8", marginTop: 8 }}>
                Dashboard content will be built in Phase 2.
            </p>
            <button
                onClick={onLogout}
                style={{
                    marginTop: "1.5rem", padding: "10px 20px", background: "#dc2626",
                    color: "#fff", border: "none", borderRadius: 8, cursor: "pointer"
                }}
            >
                Logout
            </button>
        </div>
    );
}

export default function AdminApp() {
    const [admin, setAdmin] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useState(() => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            AdminApi.verifyAdminSession()
                .then(data => setAdmin({ name: data.name, email: data.email }))
                .catch(() => localStorage.removeItem("admin_token"))
                .finally(() => setCheckingAuth(false));
        } else {
            setCheckingAuth(false);
        }
    });

    function handleLogout() {
        localStorage.removeItem("admin_token");
        setAdmin(null);
    }

    return (
        <>
            <style>{adminStyles}</style>
            {checkingAuth ? null : admin ? (
                <AdminDashboardPlaceholder admin={admin} onLogout={handleLogout} />
            ) : (
                <AdminLoginPage onLoginSuccess={setAdmin} />
            )}
        </>
    );
}