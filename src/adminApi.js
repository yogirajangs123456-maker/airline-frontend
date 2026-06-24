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

export function getRevenueAnalytics(days) {
    return axios.get(`${API}/admin/analytics/revenue`, { params: { days }, ...adminAuthHeader() })
        .then(res => res.data);
}

export function getRouteAnalytics() {
    return axios.get(`${API}/admin/analytics/routes`, adminAuthHeader())
        .then(res => res.data);
}

export function getFlightDemandAnalytics() {
    return axios.get(`${API}/admin/analytics/flight-demand`, adminAuthHeader())
        .then(res => res.data);
}

export function getPeakTravelAnalytics() {
    return axios.get(`${API}/admin/analytics/peak-travel`, adminAuthHeader())
        .then(res => res.data);
}

export function getTopCustomers() {
    return axios.get(`${API}/admin/analytics/top-customers`, adminAuthHeader())
        .then(res => res.data);
}

export function getBusinessInsights() {
    return axios.get(`${API}/admin/analytics/insights`, adminAuthHeader())
        .then(res => res.data);
}

export function getAllFlightTemplates() {
    return axios.get(`${API}/admin/flight-templates`, adminAuthHeader())
        .then(res => res.data);
}

export function createFlightTemplate(template) {
    return axios.post(`${API}/admin/flight-templates`, template, adminAuthHeader())
        .then(res => res.data);
}

export function updateFlightTemplate(id, template) {
    return axios.put(`${API}/admin/flight-templates/${id}`, template, adminAuthHeader())
        .then(res => res.data);
}

export function deleteFlightTemplate(id) {
    return axios.delete(`${API}/admin/flight-templates/${id}`, adminAuthHeader())
        .then(res => res.data);
}

export function activateFlightTemplate(id) {
    return axios.patch(`${API}/admin/flight-templates/${id}/activate`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function deactivateFlightTemplate(id) {
    return axios.patch(`${API}/admin/flight-templates/${id}/deactivate`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function generateFlightsNow() {
    return axios.post(`${API}/admin/flight-templates/generate-now`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function getGeneratedFlights() {
    return axios.get(`${API}/admin/generated-flights`, adminAuthHeader())
        .then(res => res.data);
}

export function searchGeneratedFlights(params) {
    return axios.get(`${API}/admin/generated-flights/search`, { params, ...adminAuthHeader() })
        .then(res => res.data);
}

export function getAutomationDashboard() {
    return axios.get(`${API}/admin/generated-flights/dashboard`, adminAuthHeader())
        .then(res => res.data);
}

export function getAllFlightTemplates() {
    return axios.get(`${API}/admin/flight-templates`, adminAuthHeader())
        .then(res => res.data);
}

export function createFlightTemplate(template) {
    return axios.post(`${API}/admin/flight-templates`, template, adminAuthHeader())
        .then(res => res.data);
}

export function updateFlightTemplate(id, template) {
    return axios.put(`${API}/admin/flight-templates/${id}`, template, adminAuthHeader())
        .then(res => res.data);
}

export function deleteFlightTemplate(id) {
    return axios.delete(`${API}/admin/flight-templates/${id}`, adminAuthHeader())
        .then(res => res.data);
}

export function updateTemplateStatus(id, status) {
    return axios.patch(`${API}/admin/flight-templates/${id}/status`, { status }, adminAuthHeader())
        .then(res => res.data);
}

export function generateFlightsNow() {
    return axios.post(`${API}/admin/flight-templates/generate-now`, {}, adminAuthHeader())
        .then(res => res.data);
}

export function getGenerationSettings() {
    return axios.get(`${API}/admin/generation-settings`, adminAuthHeader())
        .then(res => res.data);
}

export function updateGenerationSettings(windowDays) {
    return axios.put(`${API}/admin/generation-settings`, { windowDays }, adminAuthHeader())
        .then(res => res.data);
}

export function getAllFlightsUnified() {
    return axios.get(`${API}/admin/all-flights`, adminAuthHeader())
        .then(res => res.data);
}

export function searchAllFlights(params) {
    return axios.get(`${API}/admin/all-flights/search`, { params, ...adminAuthHeader() })
        .then(res => res.data);
}

export function getFlightsDashboard() {
    return axios.get(`${API}/admin/all-flights/dashboard`, adminAuthHeader())
        .then(res => res.data);
}