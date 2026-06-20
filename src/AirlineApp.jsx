import { useState, useEffect, useCallback } from "react";
import * as Api from "./api";

const API = "http://localhost:8080/api";

// ─── Utilities ───────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (t) => t?.slice(0, 5);

function generatePNR() {
  return "PNR" + Math.random().toString(36).toUpperCase().slice(2, 8);
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
  font-family: 'Inter', sans-serif;
  background: #f0f4ff;
  color: #1a1a2e;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

input, select, textarea, button {
  color-scheme: light;
}

input, select, textarea {
  background-color: #fff !important;
  color: #1a1a2e !important;
  caret-color: #1a1a2e;
}

input::placeholder {
  color: #94a3b8 !important;
}

  /* ── Nav ── */
  .nav {
    background: #fff;
    border-bottom: 1px solid #e5e9f2;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }
  .nav-logo {
    font-family: 'Sora', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .nav-logo span { color: #1a1a2e; }
  .nav-links { display: flex; gap: 8px; align-items: center; }
  .nav-btn {
    padding: 8px 18px;
    border-radius: 8px;
    border: 1.5px solid #e5e9f2;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    color: #374151;
  }
  .nav-btn:hover { background: #f0f4ff; border-color: #2563eb; color: #2563eb; }
  .nav-btn.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
  .nav-btn.primary:hover { background: #1d4ed8; }
  .nav-user {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #dbeafe;
    color: #1d4ed8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }

  /* ── Hero / Home ── */
  .hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
    padding: 5rem 2rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    color: #bfdbfe;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .hero h1 {
    font-family: 'Sora', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .hero p {
    color: #bfdbfe;
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── Search Card ── */
  .search-card {
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    max-width: 860px;
    margin: 0 auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    position: relative;
  }
  .search-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 1.5rem;
    background: #f0f4ff;
    padding: 4px;
    border-radius: 10px;
    width: fit-content;
  }
  .search-tab {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    color: #64748b;
    transition: all 0.18s;
  }
  .search-tab.active { background: #fff; color: #2563eb; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .search-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }
  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
  .field-input {
    padding: 12px 14px;
    border: 1.5px solid #e5e9f2;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    color: #1a1a2e;
    outline: none;
    transition: border-color 0.18s;
    width: 100%;
  }
  .field-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .search-btn {
    padding: 12px 28px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    height: 48px;
  }
  .search-btn:hover { background: #1d4ed8; transform: translateY(-1px); }

  /* ── Page container ── */
  .page { max-width: 1100px; margin: 0 auto; padding: 2rem; }
  .page-sm { max-width: 520px; margin: 0 auto; padding: 2rem; }

  /* ── Section heading ── */
  .section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .section-heading h2 {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
  }
  .section-heading p { font-size: 0.875rem; color: #64748b; }

  /* ── Flight Card ── */
  .flight-card {
    background: #fff;
    border: 1.5px solid #e5e9f2;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 14px;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 1.5rem;
    align-items: center;
    transition: all 0.2s;
    cursor: pointer;
  }
  .flight-card:hover { border-color: #2563eb; box-shadow: 0 4px 20px rgba(37,99,235,0.1); transform: translateY(-1px); }
  .airline-logo {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    text-align: center;
    line-height: 1.2;
  }
  .flight-route {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .route-city { text-align: center; }
  .route-time { font-size: 1.375rem; font-weight: 700; color: #1a1a2e; }
  .route-code { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
  .route-line {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .route-duration { font-size: 0.75rem; color: #64748b; }
  .route-dot-line {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 4px;
  }
  .route-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
  .route-dashes { flex: 1; border-top: 1.5px dashed #cbd5e1; }
  .route-plane { font-size: 14px; transform: rotate(90deg); }
  .flight-meta { text-align: center; }
  .flight-class { font-size: 0.75rem; color: #64748b; margin-bottom: 4px; }
  .seats-left { font-size: 0.75rem; font-weight: 600; color: #f59e0b; }
  .flight-price { text-align: right; }
  .price-amount { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
  .price-label { font-size: 0.75rem; color: #94a3b8; }
  .book-btn {
    margin-top: 8px;
    padding: 8px 20px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
  }
  .book-btn:hover { background: #1d4ed8; }

  /* ── Seat Map ── */
  .seat-map-wrap {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #e5e9f2;
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  .plane-body {
    max-width: 400px;
    margin: 0 auto;
    background: #f8fafc;
    border-radius: 40px 40px 20px 20px;
    border: 1.5px solid #e5e9f2;
    padding: 2rem 2rem 2.5rem;
  }
  .plane-nose {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #2563eb;
  }
  .seat-legend {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #64748b; }
  .legend-dot { width: 18px; height: 18px; border-radius: 4px; }
  .seat-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .seat-row-num { font-size: 0.75rem; color: #94a3b8; font-weight: 600; width: 20px; text-align: center; }
  .seat-aisle { width: 16px; }
  .seat-box {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.18s;
    position: relative;
  }
  .seat-box.avail { background: #dcfce7; color: #166534; border-color: #86efac; }
  .seat-box.avail:hover { background: #bbf7d0; transform: scale(1.08); }
  .seat-box.booked { background: #fee2e2; color: #991b1b; border-color: #fca5a5; cursor: not-allowed; }
  .seat-box.selected { background: #2563eb; color: #fff; border-color: #1d4ed8; transform: scale(1.08); }
  .seat-box.locking { background: #fef3c7; color: #92400e; border-color: #fcd34d; cursor: not-allowed; }

  /* ── Auth Card ── */
  .auth-card {
    background: #fff;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 8px 40px rgba(0,0,0,0.1);
    border: 1.5px solid #e5e9f2;
  }
  .auth-logo {
    text-align: center;
    margin-bottom: 2rem;
  }
  .auth-logo h2 {
    font-family: 'Sora', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #2563eb;
  }
  .auth-logo p { font-size: 0.875rem; color: #64748b; margin-top: 4px; }
  .form-field { margin-bottom: 1rem; }
  .form-field label { display: block; font-size: 0.8125rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
  .form-field input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e5e9f2;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.18s;
    color: #1a1a2e;
  }
  .form-field input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .submit-btn {
    width: 100%;
    padding: 13px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 8px;
  }
  .submit-btn:hover { background: #1d4ed8; }
  .submit-btn:disabled { background: #93c5fd; cursor: not-allowed; }
  .auth-switch {
    text-align: center;
    margin-top: 1.25rem;
    font-size: 0.875rem;
    color: #64748b;
  }
  .auth-switch a { color: #2563eb; font-weight: 600; cursor: pointer; text-decoration: none; }
  .auth-switch a:hover { text-decoration: underline; }

  /* ── Payment ── */
  .payment-card {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #e5e9f2;
    padding: 1.75rem;
    margin-bottom: 1rem;
  }
  .payment-card h3 { font-size: 1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; }
  .payment-grid { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start; }
  .expiry-cvv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .payment-summary-col { position: sticky; top: 80px; }
  .seat-col-label { width: 44px; text-align: center; font-size: 0.7rem; font-weight: 700; color: #94a3b8; flex-shrink: 0; }
  .card-number-input {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.1em;
    font-size: 1rem;
  }
  .pay-summary { background: #f0f4ff; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .pay-summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.875rem; color: #374151; }
  .pay-summary-row:last-child { margin-bottom: 0; font-weight: 700; font-size: 1rem; color: #1a1a2e; border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 8px; }

  /* ── Ticket PDF style ── */
  .ticket-preview {
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    border-radius: 16px;
    padding: 2rem;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .ticket-preview::before {
    content: '✈';
    position: absolute;
    right: -20px;
    top: -20px;
    font-size: 120px;
    opacity: 0.05;
  }
  .ticket-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
  .ticket-airline { font-size: 1.25rem; font-weight: 700; }
  .ticket-pnr { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 14px; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.1em; }
  .ticket-route { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .ticket-city { font-size: 2rem; font-weight: 700; }
  .ticket-city-name { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
  .ticket-middle { flex: 1; text-align: center; }
  .ticket-divider { border-top: 1px dashed rgba(255,255,255,0.3); position: relative; margin: 1.5rem 0; }
  .ticket-divider::before, .ticket-divider::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #f0f4ff;
    border-radius: 50%;
    top: -10px;
  }
  .ticket-divider::before { left: -30px; }
  .ticket-divider::after { right: -30px; }
  .ticket-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .ticket-detail-item { }
  .ticket-detail-label { font-size: 0.7rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .ticket-detail-value { font-size: 0.9375rem; font-weight: 600; }

  /* ── Toast / Alert ── */
  .toast {
    position: fixed;
    top: 80px;
    right: 24px;
    background: #fff;
    border-radius: 12px;
    padding: 14px 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    border-left: 4px solid #2563eb;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 999;
    animation: slideIn 0.3s ease;
    max-width: 320px;
  }
  .toast.success { border-left-color: #16a34a; }
  .toast.error { border-left-color: #dc2626; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

  /* ── Badge / Chip ── */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-orange { background: #fef3c7; color: #92400e; }
  .badge-red { background: #fee2e2; color: #991b1b; }

  /* ── Spinner ── */
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid #e5e9f2;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 2rem auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Features row on Home ── */
  .features { max-width: 1100px; margin: -2rem auto 0; padding: 0 2rem 3rem; }
  .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .feature-card {
    background: #fff;
    border: 1.5px solid #e5e9f2;
    border-radius: 14px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s;
  }
  .feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(37,99,235,0.1); }
  .feature-icon { font-size: 2rem; margin-bottom: 0.75rem; }
  .feature-card h3 { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .feature-card p { font-size: 0.8125rem; color: #64748b; line-height: 1.6; }

  /* ── My Bookings ── */
  .booking-item {
    background: #fff;
    border: 1.5px solid #e5e9f2;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 14px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
  }
  .booking-route { font-size: 1.125rem; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .booking-meta { font-size: 0.8125rem; color: #64748b; }
  .booking-pnr { font-size: 0.75rem; font-weight: 700; font-family: monospace; color: #2563eb; background: #dbeafe; padding: 3px 10px; border-radius: 6px; }
  .cancel-btn {
    padding: 8px 16px;
    background: transparent;
    border: 1.5px solid #fca5a5;
    color: #dc2626;
    border-radius: 8px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
  }
  .cancel-btn:hover { background: #fee2e2; }

  /* ── OTP Input ── */
  .otp-wrap { display: flex; gap: 10px; justify-content: center; margin: 1rem 0; }
  .otp-digit {
    width: 48px; height: 56px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    border: 2px solid #e5e9f2;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.18s;
    font-family: monospace;
    color: #1a1a2e;
  }
  .otp-digit:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

  /* ── Misc ── */
  .empty-state { text-align: center; padding: 4rem 2rem; color: #94a3b8; }
  .empty-state .big { font-size: 3rem; margin-bottom: 1rem; }
  .empty-state p { font-size: 0.9375rem; }
  .divider { border: none; border-top: 1px solid #e5e9f2; margin: 1.5rem 0; }
  .back-link { display: inline-flex; align-items: center; gap: 6px; color: #64748b; font-size: 0.875rem; font-weight: 500; cursor: pointer; margin-bottom: 1.5rem; border: none; background: none; transition: color 0.18s; }
  .back-link:hover { color: #2563eb; }
  .success-animation { text-align: center; padding: 2rem; }
  .success-circle { width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; }

  /* ── Responsive: Tablet & Mobile ── */
  @media (max-width: 768px) {
    html, body { font-size: 15px; }

    /* Nav */
    .nav {
      padding: 0 1rem;
      height: auto;
      min-height: 56px;
      flex-wrap: wrap;
      row-gap: 8px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .nav-logo { font-size: 1.15rem; }
    .nav-links {
      flex-wrap: wrap;
      gap: 6px;
      width: 100%;
      justify-content: flex-start;
    }
    .nav-btn {
      padding: 6px 12px;
      font-size: 0.8125rem;
    }
    .nav-user { gap: 6px; font-size: 0.8125rem; }
    .avatar { width: 30px; height: 30px; font-size: 0.75rem; }

    /* Hero */
    .hero { padding: 2rem 1rem 1.75rem; }
    .hero h1 { font-size: 1.75rem; }
    .hero p { font-size: 0.9375rem; margin-bottom: 1.5rem; }
    .hero-badge { font-size: 0.6875rem; padding: 3px 10px; }

    /* Search card */
    .search-card { padding: 1.25rem; max-width: 100%; border-radius: 12px; }
    .search-tabs { width: 100%; }
    .search-tab { flex: 1; text-align: center; padding: 8px 10px; font-size: 0.8125rem; }
    .search-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .search-btn { width: 100%; }

    /* Generic page padding */
    .page, .page-sm { padding: 1rem; }

    /* Features & popular routes */
    .features { padding: 0 1rem 2rem; margin-top: -1rem; }
    .feature-grid { grid-template-columns: 1fr; gap: 12px; }

    /* Flight result cards */
    .flight-card {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 1rem;
    }
    .airline-logo { width: 40px; height: 40px; font-size: 0.6875rem; }
    .flight-route { flex-wrap: wrap; gap: 0.5rem; }
    .route-time { font-size: 1.125rem; }
    .flight-meta, .flight-price { text-align: left; }
    .flight-price { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .book-btn { margin-top: 0; }

    /* Seat map */
    .seat-map-wrap { padding: 1.25rem; }
    .plane-body { padding: 1.25rem 0.75rem 1.5rem; }
    .seat-box { width: 36px; height: 36px; font-size: 0.65rem; }
    .seat-row { gap: 5px; }
    .seat-aisle { width: 10px; }
    .seat-legend { gap: 10px; font-size: 0.75rem; }
    .legend-dot { width: 14px; height: 14px; }

    /* Auth cards (Login/Signup/Cancel wizard) */
    .auth-card { padding: 1.5rem; border-radius: 14px; }
    .auth-logo h2 { font-size: 1.375rem; }

    /* Payment page */
    .payment-card { padding: 1.25rem; }
    .pay-summary { padding: 1rem; }
    .pay-summary-row { font-size: 0.8125rem; flex-wrap: wrap; gap: 4px; }

    /* Ticket preview */
    .ticket-preview { padding: 1.25rem; border-radius: 14px; }
    .ticket-route { gap: 0.5rem; }
    .ticket-city { font-size: 1.5rem; }
    .ticket-details { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .ticket-divider::before, .ticket-divider::after { display: none; }

    /* My Bookings */
    .booking-item {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 1rem;
    }
    .booking-item > div:last-child {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .booking-route { font-size: 1rem; }
    .booking-meta { font-size: 0.75rem; }

    /* OTP input */
    .otp-wrap { gap: 6px; }
    .otp-digit { width: 38px; height: 48px; font-size: 1.25rem; }
    .payment-grid { grid-template-columns: 1fr; }
    .payment-summary-col { position: static; }
    .expiry-cvv-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .seat-col-label { width: 34px; font-size: 0.6rem; }
    .nav-user span { max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .booking-item > div:last-child { display: flex; flex-direction: row; gap: 8px; }
    .booking-item .book-btn, .booking-item .cancel-btn { flex: 1; text-align: center; }

    /* Cancel wizard passenger rows */
    .auth-card label { padding: 10px 12px; }

    /* Toast */
    .toast { left: 16px; right: 16px; top: 70px; max-width: none; }
  }

  /* ── Very small phones ── */
  @media (max-width: 380px) {
    .hero h1 { font-size: 1.5rem; }
    .otp-digit { width: 32px; height: 42px; font-size: 1.1rem; }
    .seat-box { width: 32px; height: 32px; font-size: 0.6rem; }
    .nav-logo { font-size: 1rem; }
  }
`;

// ─── Airline brand map ────────────────────────────────────────────────────────
const AIRLINE_BRANDS = {
  "6E": { name: "IndiGo", color: "#1c2b6e", bg: "#e8ecf7" },
  "AI": { name: "Air India", color: "#8b0000", bg: "#fce8e8" },
  "SG": { name: "SpiceJet", color: "#e55e0e", bg: "#fdeee5" },
  "UK": { name: "Vistara", color: "#541852", bg: "#f0e8f0" },
  "G8": { name: "Go First", color: "#0e7a4e", bg: "#e5f4ed" },
  "IX": { name: "Air Asia", color: "#d00000", bg: "#ffe5e5" },
};

function getAirlineBrand(code) {
  return AIRLINE_BRANDS[code] || { name: code, color: "#2563eb", bg: "#dbeafe" };
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ─── Mock API (replace with real axios calls) ─────────────────────────────────
// In production replace these with real axios calls to Spring Boot

const mockFlights = [
  { flightId: 1, airlineCode: "6E", flightNumber: "6E-201", source: "Chennai", destination: "Mumbai", departureTime: "06:00", arrivalTime: "08:10", journeyDate: "2025-08-15", price: 3499, totalSeats: 30, availableSeats: 22, duration: "2h 10m" },
  { flightId: 2, airlineCode: "AI", flightNumber: "AI-505", source: "Chennai", destination: "Mumbai", departureTime: "10:30", arrivalTime: "12:50", journeyDate: "2025-08-15", price: 4299, totalSeats: 30, availableSeats: 14, duration: "2h 20m" },
  { flightId: 3, airlineCode: "SG", flightNumber: "SG-101", source: "Chennai", destination: "Mumbai", departureTime: "14:15", arrivalTime: "16:30", journeyDate: "2025-08-15", price: 2899, totalSeats: 30, availableSeats: 8, duration: "2h 15m" },
  { flightId: 4, airlineCode: "6E", flightNumber: "6E-310", source: "Madurai", destination: "Delhi", departureTime: "07:45", arrivalTime: "10:30", journeyDate: "2025-08-15", price: 5499, totalSeats: 30, availableSeats: 19, duration: "2h 45m" },
  { flightId: 5, airlineCode: "UK", flightNumber: "UK-811", source: "Bangalore", destination: "Mumbai", departureTime: "09:00", arrivalTime: "11:00", journeyDate: "2025-08-15", price: 6299, totalSeats: 30, availableSeats: 25, duration: "2h 0m" },
  { flightId: 6, airlineCode: "AI", flightNumber: "AI-202", source: "Madurai", destination: "Mumbai", departureTime: "12:00", arrivalTime: "14:30", journeyDate: "2025-08-15", price: 4799, totalSeats: 30, availableSeats: 11, duration: "2h 30m" },
  { flightId: 7, airlineCode: "G8", flightNumber: "G8-411", source: "Chennai", destination: "Delhi", departureTime: "05:30", arrivalTime: "08:15", journeyDate: "2025-08-15", price: 4999, totalSeats: 30, availableSeats: 16, duration: "2h 45m" },
  { flightId: 8, airlineCode: "IX", flightNumber: "IX-563", source: "Coimbatore", destination: "Mumbai", departureTime: "16:00", arrivalTime: "18:10", journeyDate: "2025-08-15", price: 3199, totalSeats: 30, availableSeats: 20, duration: "2h 10m" },
];

const mockBookedSeats = {};
const mockBookings = {};

function searchFlights(source, dest, date) {
  return Api.searchFlights(source, dest, date);
}

async function fetchBookedSeats(flightId) {
  const data = await Api.getSeats(flightId);
  return data.booked || [];
}

async function lockSeat(flightId, seatNumber) {
  try {
    await Api.lockSeat(flightId, seatNumber);
    return true;
  } catch {
    return false;
  }
}

async function unlockSeat(flightId, seatNumber) {
  const key = `${flightId}-${seatNumber}`;
  if (window._seatLocks) delete window._seatLocks[key];
}

async function confirmBooking({ flightId, seatNumber, passengerName, price }) {
  const data = await Api.confirmBooking(flightId, seatNumber, passengerName, price);
  return data.pnr;
}

function sendOTP(pnr) {
  return Api.sendCancelOTP(pnr);
}

function verifyOTPAndCancel(pnr, email, otp) {
  return Api.cancelWithOTP(pnr, otp);
}

function getUserBookings() {
  return Api.getMyBookings();
}

// ─── PDF Generator ────────────────────────────────────────────────────────────


// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [flightContext, setFlightContext] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  function navigate(p, ctx) {
    if (ctx) setFlightContext(ctx);
    setPage(p);
    window.scrollTo(0, 0);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("home");
    showToast("Logged out successfully.", "success");
  }

  return (
    <>
      <style>{styles}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <nav className="nav">
        <a className="nav-logo" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          ✈ <span>Sky</span>Way
        </a>
        <div className="nav-links">
          {user ? (
            <>
              <button className="nav-btn" onClick={() => navigate("bookings")}>My Bookings</button>
              <button className="nav-btn" onClick={() => navigate("cancel")}>Cancel Ticket</button>
              <div className="nav-user">
                <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button className="nav-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => navigate("login")}>Login</button>
              <button className="nav-btn primary" onClick={() => navigate("signup")}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {page === "home" && <HomePage user={user} navigate={navigate} showToast={showToast} />}
      {page === "login" && <LoginPage setUser={setUser} navigate={navigate} showToast={showToast} />}
      {page === "signup" && <SignupPage setUser={setUser} navigate={navigate} showToast={showToast} />}
      {page === "results" && <FlightResults context={flightContext} user={user} navigate={navigate} showToast={showToast} />}
      {page === "seats" && <SeatSelection context={flightContext} user={user} navigate={navigate} showToast={showToast} />}
      {page === "passengers" && <PassengerDetails context={flightContext} user={user} navigate={navigate} showToast={showToast} />}
      {page === "payment" && <PaymentPage context={flightContext} user={user} navigate={navigate} showToast={showToast} setBookingResult={setBookingResult} />}
      {page === "success" && <BookingSuccess booking={bookingResult} navigate={navigate} showToast={showToast} />}
      {page === "bookings" && <MyBookings user={user} navigate={navigate} showToast={showToast} />}
      {page === "cancel" && <CancelTicket user={user} navigate={navigate} showToast={showToast} context={flightContext} />}    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ user, navigate, showToast }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    Api.getCities().then(setCities).catch(() => setCities([]));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();
    if (!trimmedFrom || !trimmedTo) { showToast("Please enter origin and destination.", "error"); return; }
    if (!user) { showToast("Please login to search flights.", "error"); navigate("login"); return; }
    navigate("results", { from: trimmedFrom, to: trimmedTo, date });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-badge">✈ Book smarter. Fly better.</div>
        <h1>Your next adventure<br />starts here</h1>
        <p>Compare flights across IndiGo, Air India, SpiceJet, Vistara and more — all in one place.</p>

        <div className="search-card">
          <div className="search-tabs">
            <button className="search-tab active">One Way</button>
            <button className="search-tab">Round Trip</button>
          </div>
          <form className="search-grid" onSubmit={handleSearch}>
            <div className="field-group">
              <span className="field-label">From</span>
              <CityAutocomplete value={from} onChange={setFrom} placeholder="City or Airport" allCities={cities} />
            </div>
            <div className="field-group">
              <span className="field-label">To</span>
              <CityAutocomplete value={to} onChange={setTo} placeholder="City or Airport" allCities={cities} />
            </div>
            <div className="field-group">
              <span className="field-label">Date</span>
              <input className="field-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <button type="submit" className="search-btn">Search Flights</button>
          </form>
        </div>
      </section>

      <section className="features">
        <div className="feature-grid" style={{ marginTop: "3rem" }}>
          {[
            { icon: "🛡️", title: "Safe & Secure Booking", desc: "PNR-based bookings with OTP-verified cancellations and seat locking to prevent double bookings." },
            { icon: "💺", title: "Live Seat Map", desc: "Interactive graphical seat map with real-time availability — green, red, and blue coded for clarity." },
            { icon: "📄", title: "Instant E-Ticket", desc: "Download your professional boarding pass PDF with PNR, journey details, and fare breakdown immediately after payment." },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "3rem auto", padding: "0 2rem" }}>
        <div className="section-heading"><h2>Popular Routes</h2></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { from: "Chennai", to: "Mumbai", price: "₹2,899" },
            { from: "Delhi", to: "Bangalore", price: "₹3,199" },
            { from: "Mumbai", to: "Kolkata", price: "₹4,499" },
            { from: "Madurai", to: "Delhi", price: "₹4,999" },
          ].map(r => (
            <div key={r.from + r.to}
              onClick={() => { if (user) navigate("results", { from: r.from, to: r.to, date }); else { showToast("Please login first", "error"); navigate("login"); } }}
              style={{ background: "#fff", border: "1.5px solid #e5e9f2", borderRadius: 12, padding: "1.25rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e9f2"}
            >
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>✈ Popular</div>
              <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>{r.from} → {r.to}</div>
              <div style={{ color: "#2563eb", fontWeight: 700, fontSize: "1.125rem", marginTop: 6 }}>from {r.price}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ setUser, navigate, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { showToast("Fill in all fields.", "error"); return; }
    setLoading(true);
    try {
      const data = await Api.loginUser(email, password);
      localStorage.setItem("token", data.token);
      setUser({ email: data.user.email, name: data.user.name });
      showToast("Welcome back! ✈", "success");
      navigate("home");
    } catch (err) {
      showToast(err.response?.data?.error || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-sm" style={{ paddingTop: "3rem" }}>
      <div className="auth-card">
        <div className="auth-logo">
          <h2>✈ SkyWay</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </form>
        <p className="auth-switch">Don't have an account? <a onClick={() => navigate("signup")}>Create one</a></p>
      </div>
    </div>
  );
}

// ─── Signup ───────────────────────────────────────────────────────────────────
function SignupPage({ setUser, navigate, showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    if (!name || !email || !password) { showToast("Fill in all fields.", "error"); return; }
    if (password !== confirm) { showToast("Passwords do not match.", "error"); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters.", "error"); return; }
    setLoading(true);
    // In real app: axios.post(`${API}/auth/signup`, { name, email, password })
    try {
      const data = await Api.signupUser(name, email, password);
      localStorage.setItem("token", data.token);
      setUser({ email: data.user.email, name: data.user.name });
      showToast("Account created! Welcome aboard 🎉", "success");
      navigate("home");
    } catch (err) {
      showToast(err.response?.data?.error || "Signup failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-sm" style={{ paddingTop: "3rem" }}>
      <div className="auth-card">
        <div className="auth-logo">
          <h2>✈ SkyWay</h2>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSignup}>
          <div className="form-field">
            <label>Full Name</label>
            <input type="text" placeholder="Ravi Kumar" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating account…" : "Create Account"}</button>
        </form>
        <p className="auth-switch">Already have an account? <a onClick={() => navigate("login")}>Sign in</a></p>
      </div>
    </div>
  );
}

function CityAutocomplete({ value, onChange, placeholder, allCities }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);

  function handleChange(val) {
    onChange(val);
    const trimmed = val.trim();
    if (trimmed.length === 0) {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }
    const matches = allCities.filter(c =>
      c.toLowerCase().startsWith(trimmed.toLowerCase())
    ).slice(0, 6);
    setFiltered(matches);
    setShowSuggestions(matches.length > 0);
  }

  function selectCity(city) {
    onChange(city);
    setShowSuggestions(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        className="field-input"
        placeholder={placeholder}
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => value && handleChange(value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e5e9f2", borderRadius: 10,
          marginTop: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 50, overflow: "hidden"
        }}>
          {filtered.map(city => (
            <div
              key={city}
              onClick={() => selectCity(city)}
              style={{ padding: "10px 14px", cursor: "pointer", fontSize: "0.9375rem", color: "#1a1a2e" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              ✈ {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Flight Results ───────────────────────────────────────────────────────────
function FlightResults({ context, user, navigate, showToast }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    setLoading(true);
    searchFlights(context.from, context.to, context.date).then(data => {
      setFlights(data);
      setLoading(false);
    });
  }, [context]);

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    return 0;
  });

  function selectFlight(flight) {
    navigate("seats", { ...context, flight });
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate("home")}>← Back to search</button>

      <div className="section-heading">
        <div>
          <h2>{context.from} → {context.to}</h2>
          <p>{fmtDate(context.date)} · {flights.length} flights found</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>Sort by:</span>
          {["price", "departure", "duration"].map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${sortBy === s ? "#2563eb" : "#e5e9f2"}`, background: sortBy === s ? "#dbeafe" : "#fff", color: sortBy === s ? "#1d4ed8" : "#374151", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        sorted.length === 0 ? (
          <div className="empty-state">
            <div className="big">✈</div>
            <p>No flights found for this route. Try a different date or city.</p>
          </div>
        ) : (
          sorted.map(flight => {
            const brand = getAirlineBrand(flight.airlineCode);
            return (
              <div key={flight.flightId} className="flight-card" onClick={() => selectFlight(flight)}>
                <div className="airline-logo" style={{ background: brand.bg, color: brand.color }}>
                  {brand.name.split(" ").map(w => w[0]).join("")}
                  <br />
                  <span style={{ fontSize: "0.6rem", fontWeight: 500 }}>{flight.flightNumber}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1a1a2e", marginBottom: 2 }}>{brand.name}</div>
                  <div className="flight-route">
                    <div className="route-city">
                      <div className="route-time">{fmtTime(flight.departureTime)}</div>
                      <div className="route-code">{flight.source.slice(0, 3).toUpperCase()}</div>
                    </div>
                    <div className="route-line">
                      <div className="route-duration">{flight.duration}</div>
                      <div className="route-dot-line">
                        <div className="route-dot" />
                        <div className="route-dashes" />
                        <div style={{ fontSize: 14 }}>✈</div>
                        <div className="route-dashes" />
                        <div className="route-dot" />
                      </div>
                      <div className="route-duration">Non-stop</div>
                    </div>
                    <div className="route-city">
                      <div className="route-time">{fmtTime(flight.arrivalTime)}</div>
                      <div className="route-code">{flight.destination.slice(0, 3).toUpperCase()}</div>
                    </div>
                  </div>
                </div>
                <div className="flight-meta">
                  <div className="flight-class">Economy</div>
                  <div className="seats-left">⚡ {flight.availableSeats} seats left</div>
                </div>
                <div className="flight-price">
                  <div className="price-amount">{fmt(flight.price)}</div>
                  <div className="price-label">per person</div>
                  <button className="book-btn">Select Seat</button>
                </div>
              </div>
            );
          })
        )
      )}
    </div>
  );
}

// ─── Seat Selection ───────────────────────────────────────────────────────────
function SeatSelection({ context, user, navigate, showToast }) {
  const flight = context.flight;
  const ROWS = 5;
  const COLS = ["A", "B", "C", "D", "E", "F"];
  const MAX_PASSENGERS = 6;

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.getSeats(flight.flightId).then(data => {
      setBookedSeats(data.booked || []);
      setLoading(false);
    });
    return () => {
      selectedSeats.forEach(seat => Api.unlockSeatApi(flight.flightId, seat));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSeatClick(seatNum) {
    if (bookedSeats.includes(seatNum)) return;

    if (selectedSeats.includes(seatNum)) {
      await Api.unlockSeatApi(flight.flightId, seatNum);
      setSelectedSeats(prev => prev.filter(s => s !== seatNum));
      return;
    }

    if (selectedSeats.length >= MAX_PASSENGERS) {
      showToast(`You can select a maximum of ${MAX_PASSENGERS} seats per booking.`, "error");
      return;
    }

    try {
      await Api.lockSeat(flight.flightId, seatNum);
      setSelectedSeats(prev => [...prev, seatNum]);
      showToast(`Seat ${seatNum} selected and held for you.`, "success");
    } catch {
      showToast("Seat just taken! Please choose another.", "error");
    }
  }

  function getSeatNum(row, col) {
    return `${row}${col}`;
  }

  function getSeatClass(seatNum) {
    if (bookedSeats.includes(seatNum)) return "booked";
    if (selectedSeats.includes(seatNum)) return "selected";
    return "avail";
  }

  function proceed() {
    if (selectedSeats.length === 0) { showToast("Please select at least one seat.", "error"); return; }
    navigate("passengers", { ...context, selectedSeats });
  }

  const brand = getAirlineBrand(flight.airlineCode);

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <button className="back-link" onClick={() => navigate("results")}>← Back to flights</button>

      <div style={{ background: "#fff", border: "1.5px solid #e5e9f2", borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "#1a1a2e" }}>{brand.name} · {flight.flightNumber}</div>
          <div style={{ color: "#64748b", fontSize: "0.875rem" }}>{flight.source} → {flight.destination} · {fmtDate(flight.journeyDate)}</div>
          <div style={{ color: "#64748b", fontSize: "0.875rem" }}>{fmtTime(flight.departureTime)} → {fmtTime(flight.arrivalTime)} · {flight.duration}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a2e" }}>{fmt(flight.price)}</div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Economy · per person</div>
        </div>
      </div>

      <div className="seat-map-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a2e" }}>Select Seats</h2>
          <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 600 }}>
            {selectedSeats.length} / {MAX_PASSENGERS} selected
          </span>
        </div>

        <div className="seat-legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: "#dcfce7", border: "2px solid #86efac" }} />Available</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#2563eb" }} />Your Selection</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#fee2e2", border: "2px solid #fca5a5" }} />Booked</div>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="plane-body">
            <div className="plane-nose">✈</div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 20 }} />
              {COLS.map((c, i) => (
                <>
                  {i === 3 && <div className="seat-aisle" key="aisle-lbl" />}
                  <div key={c} className="seat-col-label">{c}</div>
                </>
              ))}
            </div>

            {Array.from({ length: ROWS }, (_, ri) => (
              <div key={ri} className="seat-row">
                <div className="seat-row-num">{ri + 1}</div>
                {COLS.map((col, ci) => {
                  const seatNum = getSeatNum(ri + 1, col);
                  const cls = getSeatClass(seatNum);
                  return (
                    <>
                      {ci === 3 && <div key={`aisle-${ri}`} className="seat-aisle" />}
                      <div
                        key={seatNum}
                        className={`seat-box ${cls}`}
                        onClick={() => cls !== "booked" && handleSeatClick(seatNum)}
                        title={cls === "booked" ? "Already booked" : `Seat ${seatNum}`}
                      >
                        {seatNum}
                      </div>
                    </>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          {selectedSeats.length > 0 && (
            <div style={{ marginBottom: 12, fontSize: "0.9375rem", color: "#374151" }}>
              Selected: <strong style={{ color: "#2563eb" }}>{selectedSeats.join(", ")}</strong> — held for 10 minutes
            </div>
          )}
          <button className="book-btn" onClick={proceed} style={{ padding: "12px 40px", fontSize: "1rem", borderRadius: 10, opacity: selectedSeats.length ? 1 : 0.5 }}>
            Continue with {selectedSeats.length} passenger{selectedSeats.length !== 1 ? "s" : ""} →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Page ─────────────────────────────────────────────────────────────
function PaymentPage({ context, user, navigate, showToast, setBookingResult }) {
  const flight = context.flight;
  const passengers = context.passengers;
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("form");

  const baseFare = flight.price * passengers.length;
  const taxes = Math.round(baseFare * 0.18);
  const total = baseFare + taxes;

  function formatCardNumber(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val) {
    return val.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
  }

  async function handlePay(e) {
    e.preventDefault();
    if (!cardName || cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvv.length < 3) {
      showToast("Please fill in all payment details correctly.", "error"); return;
    }
    setProcessing(true);
    setStep("processing");

    try {
      const result = await Api.confirmBooking(flight.flightId, passengers, total);

      const booking = {
        pnr: result.pnr,
        flight,
        passengers: passengers.map(p => ({ ...p, status: "CONFIRMED" })),
        totalPrice: total,
        status: "ACTIVE",
        bookedAt: new Date().toISOString(),
      };

      setBookingResult(booking);
      navigate("success");
    } catch (err) {
      showToast(err.response?.data?.error || "Payment failed. Please try again.", "error");
      setStep("form");
      setProcessing(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <button className="back-link" onClick={() => navigate("passengers")}>← Back to passenger details</button>

      <div className="payment-grid">
        <div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.25rem", color: "#1a1a2e" }}>💳 Secure Payment</h2>

          {step === "processing" ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ marginTop: "1rem", color: "#64748b" }}>Processing your payment securely…</p>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              <div className="payment-card">
                <h3>🪪 Card Details</h3>
                <div className="form-field">
                  <label>Cardholder Name</label>
                  <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" />
                </div>
                <div className="form-field">
                  <label>Card Number</label>
                  <input className="card-number-input" type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div className="expiry-cvv-grid">
                  <div className="form-field">
                    <label>Expiry (MM/YY)</label>
                    <input type="text" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="08/27" maxLength={5} />
                  </div>
                  <div className="form-field">
                    <label>CVV</label>
                    <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" maxLength={3} />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={processing}>
                Pay {fmt(total)} Securely 🔒
              </button>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", marginTop: 10 }}>
                🔒 256-bit SSL encrypted · Your card details are never stored
              </p>
            </form>
          )}
        </div>

        <div className="payment-summary-col">
          <div className="pay-summary">
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", color: "#1a1a2e" }}>Booking Summary</div>
            <div className="pay-summary-row"><span>Flight</span><span>{flight.flightNumber}</span></div>
            <div className="pay-summary-row"><span>Route</span><span>{flight.source} → {flight.destination}</span></div>
            <div className="pay-summary-row"><span>Date</span><span>{fmtDate(flight.journeyDate)}</span></div>
            <div className="pay-summary-row"><span>Passengers</span><span>{passengers.length}</span></div>
            {passengers.map(p => (
              <div className="pay-summary-row" key={p.seatNumber} style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                <span>{p.passengerName}</span><span>Seat {p.seatNumber}</span>
              </div>
            ))}
            <div className="pay-summary-row"><span>Base Fare ({passengers.length} × {fmt(flight.price)})</span><span>{fmt(baseFare)}</span></div>
            <div className="pay-summary-row"><span>Taxes & Fees (18%)</span><span>{fmt(taxes)}</span></div>
            <div className="pay-summary-row"><span>Total</span><span>{fmt(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Success ──────────────────────────────────────────────────────────
function BookingSuccess({ booking, navigate, showToast }) {
  async function downloadPDF() {
    try {
      const blob = await Api.downloadTicketPdf(booking.pnr);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SkyWay_${booking.pnr}_Ticket.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Ticket PDF downloaded!", "success");
    } catch (err) {
      showToast("Failed to download ticket. Please try again.", "error");
    }
  }

  if (!booking) return null;
  const flight = booking.flight;

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <div className="success-animation">
        <div className="success-circle">✅</div>
        <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>Save your PNR for check-in and cancellation.</p>
      </div>

      <div className="ticket-preview" style={{ marginBottom: "1.5rem" }}>
        <div className="ticket-header">
          <div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>AIRLINE</div>
            <div className="ticket-airline">{getAirlineBrand(flight.airlineCode).name}</div>
          </div>
          <div className="ticket-pnr">PNR: {booking.pnr}</div>
        </div>

        <div className="ticket-route">
          <div>
            <div className="ticket-city">{flight.source?.slice(0, 3).toUpperCase()}</div>
            <div className="ticket-city-name">{flight.source}</div>
          </div>
          <div className="ticket-middle">
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{flight.flightNumber}</div>
            <div style={{ fontSize: "1.5rem" }}>✈</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="ticket-city">{flight.destination?.slice(0, 3).toUpperCase()}</div>
            <div className="ticket-city-name">{flight.destination}</div>
          </div>
        </div>

        <div className="ticket-divider" />

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Passengers</div>
          {booking.passengers.map(p => (
            <div key={p.seatNumber} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem", fontWeight: 600, padding: "4px 0" }}>
              <span>{p.passengerName}</span>
              <span>Seat {p.seatNumber}</span>
            </div>
          ))}
        </div>

        <div className="ticket-details">
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Journey Date</div>
            <div className="ticket-detail-value">{fmtDate(flight.journeyDate)}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Departure</div>
            <div className="ticket-detail-value">{fmtTime(flight.departureTime)}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Arrival</div>
            <div className="ticket-detail-value">{fmtTime(flight.arrivalTime)}</div>
          </div>
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Total Paid</div>
            <div className="ticket-detail-value">{fmt(booking.totalPrice)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="submit-btn" style={{ width: "auto", padding: "12px 32px" }} onClick={downloadPDF}>
          📥 Download E-Ticket PDF
        </button>
        <button className="nav-btn" style={{ padding: "12px 24px", fontSize: "0.9375rem", fontWeight: 600 }} onClick={() => navigate("bookings")}>
          View My Bookings
        </button>
        <button className="nav-btn" style={{ padding: "12px 24px", fontSize: "0.9375rem", fontWeight: 600 }} onClick={() => navigate("home")}>
          Book Another Flight
        </button>
      </div>
    </div>
  );
}
// ─── My Bookings ──────────────────────────────────────────────────────────────
function MyBookings({ user, navigate, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.getMyBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  async function downloadTicket(pnr) {
    try {
      const blob = await Api.downloadTicketPdf(pnr);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SkyWay_${pnr}_Ticket.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Ticket downloaded!", "success");
    } catch (err) {
      showToast("Failed to download ticket. Please try again.", "error");
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-heading">
        <h2>My Bookings</h2>
        <p>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="big">🎫</div>
          <p>No bookings yet. Search for flights to get started!</p>
          <button className="submit-btn" style={{ marginTop: "1rem", width: "auto", padding: "10px 28px" }} onClick={() => navigate("home")}>
            Search Flights
          </button>
        </div>
      ) : (
        bookings.map(b => {
          const confirmedCount = b.passengers.filter(p => p.status === "CONFIRMED").length;
          const cancelledCount = b.passengers.filter(p => p.status === "CANCELLED").length;
          return (
            <div key={b.pnr} className="booking-item" style={{ gridTemplateColumns: "1fr auto", alignItems: "start" }}>
              <div>
                <div className="booking-route">{b.flight?.source} → {b.flight?.destination}</div>
                <div className="booking-meta">{b.flight?.flightNumber} · {fmtDate(b.flight?.journeyDate)} · {fmtTime(b.flight?.departureTime)}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div className="booking-pnr">{b.pnr}</div>
                  <span className={`badge ${b.status === "ACTIVE" ? "badge-green" : "badge-red"}`}>{b.status}</span>
                </div>

                <div style={{ marginTop: 12 }}>
                  {b.passengers.map(p => (
                    <div key={p.passengerId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "4px 0", color: p.status === "CANCELLED" ? "#dc2626" : "#374151" }}>
                      <span>{p.passengerName} — Seat {p.seatNumber}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.75rem" }}>{p.status}</span>
                    </div>
                  ))}
                </div>

                {b.refundAmount > 0 && (
                  <div style={{ marginTop: 10, fontSize: "0.8125rem", color: "#dc2626", fontWeight: 600 }}>
                    Refund Amount: {fmt(b.refundAmount)} Refunded
                  </div>
                )}

                <div style={{ marginTop: 8, fontSize: "0.8125rem", color: "#64748b" }}>
                  Total Paid: {fmt(b.totalPrice)}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="book-btn" onClick={() => downloadTicket(b.pnr)}>📥 Ticket</button>
                {confirmedCount > 0 && (
                  <button className="cancel-btn" onClick={() => navigate("cancel", { pnr: b.pnr })}>Cancel Passengers</button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
// ─── Cancel Ticket ────────────────────────────────────────────────────────────
function CancelTicket({ user, navigate, showToast, context }) {
  const [step, setStep] = useState("pnr"); // pnr | select | refund | otp | done
  const [pnr, setPnr] = useState(context?.pnr || "");
  const [booking, setBooking] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // If we arrived here with a PNR already (from My Bookings), fetch it immediately
  useEffect(() => {
    if (context?.pnr) {
      handleFetchPNR(null, context.pnr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetchPNR(e, prefilledPnr) {
    if (e) e.preventDefault();
    const targetPnr = (prefilledPnr || pnr).trim().toUpperCase();
    if (!targetPnr) { showToast("Enter a PNR number.", "error"); return; }
    setLoading(true);
    try {
      const data = await Api.getBookingByPnr(targetPnr);
      const activePassengers = data.passengers.filter(p => p.status === "CONFIRMED");
      if (activePassengers.length === 0) {
        showToast("All passengers on this PNR are already cancelled.", "error");
        setLoading(false);
        return;
      }
      setBooking(data);
      setPnr(targetPnr);
      setStep("select");
    } catch (err) {
      showToast(err.response?.data?.error || "PNR not found.", "error");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(passengerId) {
    setSelectedIds(prev =>
      prev.includes(passengerId)
        ? prev.filter(id => id !== passengerId)
        : [...prev, passengerId]
    );
  }

  async function handleCalculateRefund() {
    if (selectedIds.length === 0) {
      showToast("Select at least one passenger to cancel.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await Api.getRefundPreview(pnr, selectedIds);
      setRefundAmount(data.refundAmount);
      setStep("refund");
    } catch (err) {
      showToast(err.response?.data?.error || "Could not calculate refund.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmAndSendOtp() {
    setLoading(true);
    try {
      await Api.sendCancelOTP(pnr);
      setStep("otp");
      showToast("OTP sent to your registered email.", "success");
    } catch {
      showToast("Failed to send OTP. Try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  }

  async function handleVerifyAndCancel(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { showToast("Enter the complete 6-digit OTP.", "error"); return; }
    setLoading(true);
    try {
      const data = await Api.cancelWithOTP(pnr, code, selectedIds);
      setResult(data);
      setStep("done");
      showToast("Cancellation successful.", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Cancellation failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  const selectedPassengerNames = booking?.passengers
    .filter(p => selectedIds.includes(p.passengerId))
    .map(p => p.passengerName) || [];

  return (
    <div className="page-sm" style={{ paddingTop: "2.5rem" }}>
      <button className="back-link" onClick={() => navigate("bookings")}>← Back to my bookings</button>

      <div className="auth-card">

        {/* STEP 1: Enter PNR */}
        {step === "pnr" && (
          <>
            <div className="auth-logo">
              <h2>🎫 Cancel Booking</h2>
              <p>Enter your PNR to view passengers</p>
            </div>
            <form onSubmit={handleFetchPNR}>
              <div className="form-field">
                <label>PNR Number</label>
                <input type="text" placeholder="e.g. PNR4F7X2A" value={pnr} onChange={e => setPnr(e.target.value.toUpperCase())} style={{ fontFamily: "monospace", letterSpacing: "0.1em", fontWeight: 700 }} />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Looking up…" : "Find Booking"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Select Passengers */}
        {step === "select" && booking && (
          <>
            <div className="auth-logo">
              <h2>👥 Select Passengers</h2>
              <p>PNR: <strong style={{ fontFamily: "monospace" }}>{pnr}</strong></p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              {booking.passengers.map(p => {
                const isCancelled = p.status === "CANCELLED";
                return (
                  <label
                    key={p.passengerId}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px", border: "1.5px solid #e5e9f2", borderRadius: 10,
                      marginBottom: 8, cursor: isCancelled ? "not-allowed" : "pointer",
                      opacity: isCancelled ? 0.5 : 1,
                      background: selectedIds.includes(p.passengerId) ? "#dbeafe" : "#fff"
                    }}
                  >
                    <input
                      type="checkbox"
                      disabled={isCancelled}
                      checked={selectedIds.includes(p.passengerId)}
                      onChange={() => toggleSelect(p.passengerId)}
                      style={{ width: 18, height: 18 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{p.passengerName}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>Seat {p.seatNumber}</div>
                    </div>
                    <span className={`badge ${isCancelled ? "badge-red" : "badge-green"}`}>{p.status}</span>
                  </label>
                );
              })}
            </div>

            <button className="submit-btn" onClick={handleCalculateRefund} disabled={loading}>
              {loading ? "Calculating…" : `Continue with ${selectedIds.length} passenger${selectedIds.length !== 1 ? "s" : ""} →`}
            </button>
            <button type="button" onClick={() => setStep("pnr")} className="nav-btn" style={{ width: "100%", marginTop: 8, fontSize: "0.9375rem" }}>
              ← Change PNR
            </button>
          </>
        )}

        {/* STEP 3: Show Refund Amount */}
        {step === "refund" && (
          <>
            <div className="auth-logo">
              <h2>💰 Refund Summary</h2>
              <p>PNR: <strong style={{ fontFamily: "monospace" }}>{pnr}</strong></p>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: 8 }}>Cancelling:</div>
              {selectedPassengerNames.map(name => (
                <div key={name} style={{ fontWeight: 600, fontSize: "0.9375rem", padding: "4px 0" }}>{name}</div>
              ))}
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9375rem", color: "#374151", fontWeight: 600 }}>Refund Amount</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>{fmt(refundAmount)}</span>
              </div>
            </div>

            <button className="submit-btn" onClick={handleConfirmAndSendOtp} disabled={loading}>
              {loading ? "Sending OTP…" : "Confirm & Send OTP"}
            </button>
            <button type="button" onClick={() => setStep("select")} className="nav-btn" style={{ width: "100%", marginTop: 8, fontSize: "0.9375rem" }}>
              ← Back to passenger selection
            </button>
          </>
        )}

        {/* STEP 4: Verify OTP */}
        {step === "otp" && (
          <>
            <div className="auth-logo">
              <h2>🔑 Verify OTP</h2>
              <p>Enter the 6-digit code sent to {user?.email}</p>
            </div>
            <form onSubmit={handleVerifyAndCancel}>
              <div className="otp-wrap">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className="otp-digit"
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                    }}
                  />
                ))}
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Cancelling…" : "Confirm Cancellation"}
              </button>
              <button type="button" onClick={() => setStep("refund")} className="nav-btn" style={{ width: "100%", marginTop: 8, fontSize: "0.9375rem" }}>
                ← Back
              </button>
            </form>
          </>
        )}

        {/* STEP 5: Done */}
        {step === "done" && result && (
          <div style={{ textAlign: "center" }}>
            <div className="success-circle" style={{ background: result.status === "CANCELLED" ? "#fee2e2" : "#dcfce7" }}>
              {result.status === "CANCELLED" ? "❌" : "✅"}
            </div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
              Cancellation Successful
            </h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              PNR <strong style={{ fontFamily: "monospace" }}>{result.pnr}</strong> updated.
            </p>
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "1rem", textAlign: "left", fontSize: "0.875rem", color: "#374151", marginBottom: "1.5rem" }}>
              <div style={{ marginBottom: 6 }}><strong>Refund Amount:</strong> {fmt(result.refundAmount)} Refunded</div>
              <div><strong>Booking Status:</strong> {result.status}</div>
            </div>
            <button className="submit-btn" onClick={() => navigate("bookings")}>View My Bookings</button>
          </div>
        )}

      </div>
    </div>
  );
}
function PassengerDetails({ context, user, navigate, showToast }) {
  const flight = context.flight;
  const seats = context.selectedSeats;
  const [names, setNames] = useState(seats.map(() => ""));

  function updateName(idx, val) {
    const next = [...names];
    next[idx] = val;
    setNames(next);
  }

  function proceed() {
    if (names.some(n => !n.trim())) {
      showToast("Please enter a name for every passenger.", "error");
      return;
    }
    const passengers = seats.map((seat, i) => ({ seatNumber: seat, passengerName: names[i].trim() }));
    navigate("payment", { ...context, passengers });
  }

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <button className="back-link" onClick={() => navigate("seats")}>← Back to seat selection</button>

      <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.25rem", color: "#1a1a2e" }}>
        Passenger Details
      </h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
        {flight.source} → {flight.destination} · {fmtDate(flight.journeyDate)}
      </p>

      <div className="payment-card">
        {seats.map((seat, idx) => (
          <div className="form-field" key={seat}>
            <label>Passenger {idx + 1} — Seat {seat}</label>
            <input
              type="text"
              placeholder="Full name as per ID"
              value={names[idx]}
              onChange={e => updateName(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={proceed}>
        Continue to Payment →
      </button>
    </div>
  );
}
