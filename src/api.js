import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

function getToken() {
    return localStorage.getItem("token");
}

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

export function unlockSeatApi(flightId, seatNumber) {
    return axios.post(`${API}/reservations/unlock-seat`,
        { flightId, seatNumber },
        authHeader()
    ).then(res => res.data).catch(() => null);
}

// ── BOOKING (now multi-passenger) ──────────────────────
export function confirmBooking(flightId, passengers, totalPrice) {
    return axios.post(`${API}/reservations`,
        { flightId, passengers, totalPrice },
        authHeader()
    ).then(res => res.data);
}

export function getMyBookings() {
    return axios.get(`${API}/reservations/my`, authHeader())
        .then(res => res.data);
}

export function getBookingByPnr(pnr) {
    return axios.get(`${API}/reservations/${pnr}`, authHeader())
        .then(res => res.data);
}

// ── CANCELLATION FLOW ──────────────────────────────────
export function getRefundPreview(pnr, passengerIds) {
    return axios.post(`${API}/otp/refund-preview`,
        { pnr, passengerIds },
        authHeader()
    ).then(res => res.data);
}

export function sendCancelOTP(pnr) {
    return axios.post(`${API}/otp/send`, { pnr }, authHeader())
        .then(res => res.data);
}

export function cancelWithOTP(pnr, otp, passengerIds) {
    return axios.post(`${API}/otp/cancel`, { pnr, otp, passengerIds }, authHeader())
        .then(res => res.data);
}

// ── TICKET PDF ──────────────────────────────────────────
export function downloadTicketPdf(pnr) {
    return axios.get(`${API}/reservations/${pnr}/ticket`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        responseType: "blob"
    }).then(res => res.data);
}

export function getCities() {
    return axios.get(`${API}/flights/cities`).then(res => res.data);
}