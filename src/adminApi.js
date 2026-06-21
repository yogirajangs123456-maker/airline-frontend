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