/* Shared helpers used by every page */
const API_BASE = "http://localhost:8080";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

async function apiRequest(path, options = {}) {
    let res;
    try {
        res = await fetch(API_BASE + path, {
            headers: { "Content-Type": "application/json" },
            ...options
        });
    } catch (e) {
        throw new Error("Server connection failed. Is the backend running on port 8080?");
    }
    const text = await res.text();
    let data = null;
    if (text) {
        try { data = JSON.parse(text); } catch (e) { data = { error: text }; }
    }
    if (!res.ok) {
        throw new Error((data && data.error) || "Request failed (" + res.status + ")");
    }
    return data;
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = String(iso).slice(0, 10).split("-");
    return Number(d) + " " + MONTHS[Number(m) - 1] + " " + y;
}

function formatTime(t) {
    if (!t) return "";
    const [h, m] = String(t).split(":");
    const hour = Number(h);
    return String(hour % 12 || 12).padStart(2, "0") + ":" + m + " " + (hour >= 12 ? "PM" : "AM");
}

function localISODate() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function statusClass(status) {
    const good = ["Confirmed", "Paid", "Available", "In Stock", "Active", "Discharged"];
    const warn = ["Pending", "On Leave", "Low Stock", "Under Treatment"];
    if (good.includes(status)) return "confirmed";
    if (warn.includes(status)) return "pending";
    return "cancelled";
}

/* ---------- session (simple login state) ---------- */
function getUser() {
    const raw = sessionStorage.getItem("hms_user") || localStorage.getItem("hms_user");
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function saveUser(user, remember) {
    clearUser();
    (remember ? localStorage : sessionStorage).setItem("hms_user", JSON.stringify(user));
}
function clearUser() {
    sessionStorage.removeItem("hms_user");
    localStorage.removeItem("hms_user");
}

/* ---------- toast ---------- */
function showToast(message, type) {
    const t = document.createElement("div");
    t.className = "toast " + (type === "error" ? "toast-error" : "toast-success");
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ---------- common page behaviour ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const isPublic = document.body.hasAttribute("data-public");
    const user = getUser();

    if (!isPublic && !user) {
        location.replace("login.html");
        return;
    }

    if (user) {
        const nameEl = document.querySelector(".user-profile strong");
        const avatar = document.querySelector(".user-avatar");
        if (nameEl) nameEl.textContent = user.full_name || user.username;
        if (avatar) avatar.textContent = (user.full_name || user.username || "A").charAt(0).toUpperCase();
    }

    document.querySelectorAll(".logout").forEach(a =>
        a.addEventListener("click", () => clearUser()));

    document.querySelectorAll(".notification-btn").forEach(b =>
        b.addEventListener("click", () => showToast("No new notifications")));

    document.querySelectorAll(".settings-link").forEach(a =>
        a.addEventListener("click", e => {
            e.preventDefault();
            showToast("Settings page is not available yet");
        }));
});
