/* Generic list page: table + search + add/view/edit/delete modal.
   Which module to run is read from <body data-module="..."> */

const GENDERS = ["Male", "Female", "Other"];
const BLOODS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const APPT_STATUS = ["Confirmed", "Pending", "Cancelled"];

const FORMATS = {
    date: v => formatDate(v),
    time: v => formatTime(v),
    years: v => v + " Years",
    rupee: v => "₹" + Number(v).toLocaleString("en-IN"),
    month: v => new Date(v + "T00:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" })
};

const MODULES = {
    patients: {
        endpoint: "/patients", idKey: "patient_id", prefix: "P", label: "Patient",
        addPage: "add-patient.html",
        columns: [
            { key: "patient_id", id: true }, { key: "name" }, { key: "age" }, { key: "gender" },
            { key: "phone" }, { key: "blood_group" }, { key: "status", badge: true }
        ],
        fields: [
            { key: "name", label: "Name", type: "text", required: true },
            { key: "age", label: "Age", type: "number", required: true, min: 0 },
            { key: "gender", label: "Gender", type: "select", options: GENDERS, required: true },
            { key: "phone", label: "Phone", type: "text", required: true, pattern: "\\d{10}", title: "10 digit phone number" },
            { key: "email", label: "Email", type: "email" },
            { key: "address", label: "Address", type: "text" },
            { key: "blood_group", label: "Blood Group", type: "select", options: BLOODS, required: true },
            { key: "status", label: "Status", type: "select", options: ["Active", "Under Treatment", "Discharged"], required: true }
        ]
    },
    doctors: {
        endpoint: "/doctors", idKey: "doctor_id", prefix: "D", label: "Doctor",
        columns: [
            { key: "doctor_id", id: true }, { key: "name" }, { key: "specialization" },
            { key: "experience", fmt: "years" }, { key: "phone" }, { key: "availability" },
            { key: "status", badge: true }
        ],
        fields: [
            { key: "name", label: "Name", type: "text", required: true },
            { key: "specialization", label: "Specialization", type: "text", required: true },
            { key: "experience", label: "Experience (years)", type: "number", required: true, min: 0 },
            { key: "phone", label: "Phone", type: "text", required: true, pattern: "\\d{10}", title: "10 digit phone number" },
            { key: "availability", label: "Availability (e.g. Mon - Fri)", type: "text", required: true },
            { key: "status", label: "Status", type: "select", options: ["Available", "On Leave"], required: true }
        ]
    },
    appointments: {
        endpoint: "/appointments", idKey: "appointment_id", prefix: "A", label: "Appointment",
        columns: [
            { key: "appointment_id", id: true }, { key: "patient_name" }, { key: "doctor_name" },
            { key: "appointment_date", fmt: "date" }, { key: "appointment_time", fmt: "time" },
            { key: "department" }, { key: "status", badge: true }
        ],
        fields: [
            { key: "patient_name", label: "Patient", type: "select", from: "/patients", required: true },
            { key: "doctor_name", label: "Doctor", type: "select", from: "/doctors", required: true },
            { key: "appointment_date", label: "Date", type: "date", required: true },
            { key: "appointment_time", label: "Time", type: "time", required: true },
            { key: "department", label: "Department", type: "text", required: true },
            { key: "status", label: "Status", type: "select", options: APPT_STATUS, required: true }
        ]
    },
    medicines: {
        endpoint: "/medicines", idKey: "medicine_id", prefix: "M", label: "Medicine",
        columns: [
            { key: "medicine_id", id: true }, { key: "name" }, { key: "category" },
            { key: "quantity" }, { key: "price", fmt: "rupee" }, { key: "expiry_date", fmt: "month" },
            { key: "status", badge: true }
        ],
        fields: [
            { key: "name", label: "Medicine Name", type: "text", required: true },
            { key: "category", label: "Category", type: "text", required: true },
            { key: "quantity", label: "Quantity", type: "number", required: true, min: 0 },
            { key: "price", label: "Price (₹)", type: "number", required: true, min: 0, step: "0.01" },
            { key: "expiry_date", label: "Expiry Date", type: "date", required: true }
        ]
    },
    billing: {
        endpoint: "/bills", idKey: "bill_id", prefix: "B", label: "Bill",
        columns: [
            { key: "bill_id", id: true }, { key: "patient_name" }, { key: "doctor_name" },
            { key: "service" }, { key: "amount", fmt: "rupee" }, { key: "bill_date", fmt: "date" },
            { key: "payment_status", badge: true }
        ],
        fields: [
            { key: "patient_name", label: "Patient", type: "select", from: "/patients", required: true },
            { key: "doctor_name", label: "Doctor", type: "select", from: "/doctors", required: true },
            { key: "service", label: "Service", type: "text", required: true },
            { key: "amount", label: "Amount (₹)", type: "number", required: true, min: 0, step: "0.01" },
            { key: "bill_date", label: "Bill Date", type: "date", required: true },
            { key: "payment_status", label: "Payment Status", type: "select", options: ["Paid", "Pending", "Cancelled"], required: true }
        ]
    }
};

(function () {
    const cfg = MODULES[document.body.dataset.module];
    if (!cfg) return;

    const tbody = document.getElementById("tableBody");
    const totalEl = document.getElementById("totalCount");
    const searchInput = document.getElementById("searchInput");
    const colCount = cfg.columns.length + 1;
    let rows = [];
    let editing = null;
    const nameCache = {};

    const idText = r => cfg.prefix + String(r[cfg.idKey]).padStart(3, "0");

    function cellText(r, c) {
        const v = r[c.key];
        if (c.id) return idText(r);
        if (v === null || v === undefined || v === "") return "";
        return c.fmt ? FORMATS[c.fmt](v) : String(v);
    }

    function cellHtml(r, c) {
        const text = esc(cellText(r, c));
        return c.badge ? `<span class="status ${statusClass(r[c.key])}">${text}</span>` : text;
    }

    function render() {
        const q = searchInput.value.trim().toLowerCase();
        const list = rows.filter(r =>
            !q || cfg.columns.map(c => cellText(r, c)).join(" ").toLowerCase().includes(q));

        totalEl.textContent = "Total : " + rows.length + (q ? " (showing " + list.length + ")" : "");

        tbody.innerHTML = list.length ? list.map(r => `
            <tr>
                ${cfg.columns.map(c => `<td>${cellHtml(r, c)}</td>`).join("")}
                <td>
                    <button class="table-btn" data-view="${esc(r[cfg.idKey])}">View</button>
                    <button class="table-btn danger" data-delete="${esc(r[cfg.idKey])}">Delete</button>
                </td>
            </tr>`).join("")
            : `<tr><td colspan="${colCount}">No records found</td></tr>`;
    }

    async function load() {
        try {
            rows = await apiRequest(cfg.endpoint);
            render();
        } catch (e) {
            totalEl.textContent = "Total : 0";
            tbody.innerHTML = `<tr><td colspan="${colCount}">${esc(e.message)}</td></tr>`;
        }
    }

    /* ---------- modal ---------- */
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 id="modalTitle"></h3>
                <button type="button" class="modal-close" id="modalClose">&times;</button>
            </div>
            <form id="modalForm">
                <div class="form-grid" id="modalFields"></div>
                <p class="form-error" id="modalError"></p>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" id="modalCancel">Cancel</button>
                    <button type="submit" class="add-patient-btn" id="modalSave">Save</button>
                </div>
            </form>
        </div>`;
    document.body.appendChild(overlay);

    const form = overlay.querySelector("#modalForm");
    const errorEl = overlay.querySelector("#modalError");
    const closeModal = () => { overlay.hidden = true; };

    overlay.querySelector("#modalClose").onclick = closeModal;
    overlay.querySelector("#modalCancel").onclick = closeModal;
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    async function namesFrom(endpoint) {
        if (!nameCache[endpoint]) {
            try {
                nameCache[endpoint] = (await apiRequest(endpoint)).map(x => x.name);
            } catch (e) {
                return [];
            }
        }
        return nameCache[endpoint];
    }

    function fieldHtml(f, options, value) {
        let v = value ?? "";
        const req = f.required ? "required" : "";
        let input;
        if (f.type === "select") {
            const list = (options || []).slice();
            if (v && !list.includes(v)) list.push(v);
            input = `<select name="${f.key}" ${req}>
                <option value="">Select ${esc(f.label)}</option>
                ${list.map(o => `<option value="${esc(o)}" ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}
            </select>`;
        } else {
            if (f.type === "date") v = String(v).slice(0, 10);
            if (f.type === "time") v = String(v).slice(0, 5);
            input = `<input type="${f.type}" name="${f.key}" value="${esc(v)}" ${req}
                ${f.min != null ? `min="${f.min}"` : ""}
                ${f.step ? `step="${f.step}"` : ""}
                ${f.pattern ? `pattern="${f.pattern}" title="${esc(f.title || "")}"` : ""}>`;
        }
        return `<div class="form-field"><label>${esc(f.label)}</label>${input}</div>`;
    }

    async function openModal(record) {
        editing = record;
        overlay.querySelector("#modalTitle").textContent =
            record ? "Edit " + cfg.label + " " + idText(record) : "Add " + cfg.label;
        errorEl.textContent = "";

        let html = "";
        for (const f of cfg.fields) {
            const options = f.from ? await namesFrom(f.from) : f.options;
            html += fieldHtml(f, options, record ? record[f.key] : (f.type === "date" ? localISODate() : ""));
        }
        overlay.querySelector("#modalFields").innerHTML = html;
        overlay.hidden = false;
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();
        errorEl.textContent = "";
        const data = {};
        cfg.fields.forEach(f => {
            const v = form.elements[f.key].value.trim();
            data[f.key] = (f.type === "number" && v !== "") ? Number(v) : v;
        });

        const saveBtn = overlay.querySelector("#modalSave");
        saveBtn.disabled = true;
        try {
            const path = editing ? cfg.endpoint + "/" + editing[cfg.idKey] : cfg.endpoint;
            await apiRequest(path, { method: editing ? "PUT" : "POST", body: JSON.stringify(data) });
            closeModal();
            showToast(cfg.label + (editing ? " updated" : " added") + " successfully");
            await load();
        } catch (err) {
            errorEl.textContent = err.message;
        } finally {
            saveBtn.disabled = false;
        }
    });

    /* ---------- page events ---------- */
    tbody.addEventListener("click", async e => {
        const viewBtn = e.target.closest("[data-view]");
        const delBtn = e.target.closest("[data-delete]");
        if (viewBtn) {
            try {
                openModal(await apiRequest(cfg.endpoint + "/" + viewBtn.dataset.view));
            } catch (err) { showToast(err.message, "error"); }
        }
        if (delBtn) {
            const rec = rows.find(r => String(r[cfg.idKey]) === delBtn.dataset.delete);
            if (!rec || !confirm("Delete " + cfg.label.toLowerCase() + " " + idText(rec) + "?")) return;
            try {
                await apiRequest(cfg.endpoint + "/" + rec[cfg.idKey], { method: "DELETE" });
                showToast(cfg.label + " deleted");
                await load();
            } catch (err) { showToast(err.message, "error"); }
        }
    });

    document.getElementById("addBtn").addEventListener("click", () => {
        if (cfg.addPage) location.href = cfg.addPage;
        else openModal(null);
    });
    document.getElementById("searchBtn").addEventListener("click", render);
    searchInput.addEventListener("input", render);
    searchInput.addEventListener("keydown", e => { if (e.key === "Enter") render(); });

    load();
    if (!cfg.addPage && new URLSearchParams(location.search).get("add") === "1") openModal(null);
})();
