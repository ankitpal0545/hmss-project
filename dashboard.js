(async function () {
    const set = (id, text) => { document.getElementById(id).textContent = text; };

    try {
        const s = await apiRequest("/dashboard/stats");
        set("statPatients", s.total_patients);
        set("statDoctors", s.total_doctors);
        set("statDoctorsNote", s.available_doctors + " available");
        set("statAppointments", s.todays_appointments);
        set("statPendingNote", s.pending_appointments + " Pending");
        set("statRevenue", "₹" + Number(s.total_revenue).toLocaleString("en-IN"));
    } catch (e) {
        showToast(e.message, "error");
    }

    const body = document.getElementById("todayBody");
    try {
        const list = await apiRequest("/appointments");
        const today = localISODate();
        const rows = list
            .filter(a => a.appointment_date === today)
            .sort((a, b) => String(a.appointment_time).localeCompare(String(b.appointment_time)))
            .slice(0, 6);

        body.innerHTML = rows.length ? rows.map(a => `
            <tr>
                <td>${esc(a.patient_name)}</td>
                <td>${esc(a.doctor_name)}</td>
                <td>${esc(formatTime(a.appointment_time))}</td>
                <td><span class="status ${statusClass(a.status)}">${esc(a.status)}</span></td>
            </tr>`).join("") : `<tr><td colspan="4">No appointments today</td></tr>`;
    } catch (e) {
        body.innerHTML = `<tr><td colspan="4">${esc(e.message)}</td></tr>`;
    }
})();
