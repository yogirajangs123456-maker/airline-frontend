import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

function getAdminToken() {
    return localStorage.getItem("admin_token");
}

function adminAuthHeader() {
    return {
        headers: {
            Authorization: `Bearer ${getAdminToken()}`
        }
    };
}

export function adminLogin(email, password) {
    return axios.post(`${API}/admin/auth/login`, { email, password })
        .then(res => res.data);
}

export function verifyAdminSession() {
    return axios.get(`${API}/admin/auth/me`, adminAuthHeader())
        .then(res => res.data);
}

export function getDashboardSummary() {
    return axios.get(`${API}/admin/dashboard/summary`, adminAuthHeader())
        .then(res => res.data);
}

export function searchAdminFlights(params) {
    return axios.get(`${API}/admin/flights/search`, { params, ...adminAuthHeader() })
        .then(res => res.data);
}

export function getAllAdminFlights() {
    return axios.get(`${API}/admin/flights`, adminAuthHeader())
        .then(res => res.data);
}

export function createFlight(flight) {
    return axios.post(`${API}/admin/flights`, flight, adminAuthHeader())
        .then(res => res.data);
}

export function updateFlight(id, flight) {
    return axios.put(`${API}/admin/flights/${id}`, flight, adminAuthHeader())
        .then(res => res.data);
}

export function deleteFlight(id) {
    return axios.delete(`${API}/admin/flights/${id}`, adminAuthHeader())
        .then(res => res.data);
}

export function deactivateFlight(id) {
    return axios.patch(`${API}/admin/flights/${id}/deactivate`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function activateFlight(id) {
    return axios.patch(`${API}/admin/flights/${id}/activate`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function getAllAdminReservations() {
    return axios.get(`${API}/admin/reservations`, adminAuthHeader())
        .then(res => res.data);
}

export function searchAdminReservations(params) {
    return axios.get(`${API}/admin/reservations/search`, { params, ...adminAuthHeader() })
        .then(res => res.data);
}

export function getAllAdminUsers() {
    return axios.get(`${API}/admin/users`, adminAuthHeader())
        .then(res => res.data);
}