import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

// This reads the JWT token saved after login
function getToken() {
    return localStorage.getItem("token");
}

// This adds the token to every request automatically
function authHeader() {
    return {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    };
}

// ── AUTH ──────────────────────────────────────────────
export function loginUser(email, password) {
    return axios.post(`${API}/auth/login`, { email, password })
        .then(res => res.data);
}

export function signupUser(name, email, password) {
    return axios.post(`${API}/auth/signup`, { name, email, password })
        .then(res => res.data);
}

// ── FLIGHTS ───────────────────────────────────────────
export function searchFlights(source, destination, date) {
    return axios.get(`${API}/flights/search`, {
        params: { source, destination, date }
    }).then(res => res.data);
}

export function getSeats(flightId) {
    return axios.get(`${API}/flights/${flightId}/seats`)
        .then(res => res.data);
}

// ── SEAT LOCK ─────────────────────────────────────────
export function lockSeat(flightId, seatNumber) {
    return axios.post(`${API}/reservations/lock-seat`,
        { flightId, seatNumber },
        authHeader()
    ).then(res => res.data);
}

// ── BOOKING ───────────────────────────────────────────
export function confirmBooking(flightId, seatNumber, passengerName, totalPrice) {
    return axios.post(`${API}/reservations`,
        { flightId, seatNumber, passengerName, totalPrice },
        authHeader()
    ).then(res => res.data);
}

export function getMyBookings() {
    return axios.get(`${API}/reservations/my`, authHeader())
        .then(res => res.data);
}

// ── OTP & CANCEL ──────────────────────────────────────
export function sendCancelOTP(pnr) {
    return axios.post(`${API}/otp/send`, { pnr }, authHeader())
        .then(res => res.data);
}

export function cancelWithOTP(pnr, otp) {
    return axios.post(`${API}/otp/cancel`, { pnr, otp }, authHeader())
        .then(res => res.data);
}

export function downloadTicketPdf(pnr) {
    console.log("DEBUG - Token:", getToken());
    console.log("DEBUG - URL:", `${API}/reservations/${pnr}/ticket`);
    return axios.get(`${API}/reservations/${pnr}/ticket`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        responseType: "blob"
    }).then(res => res.data);
}