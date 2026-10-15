package com.hms.controller;

import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository patients;
    private final DoctorRepository doctors;
    private final AppointmentRepository appointments;
    private final BillRepository bills;

    @GetMapping("/dashboard/stats")
    public Map<String, Object> stats() {
        LocalDate today = LocalDate.now();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("total_patients", patients.count());
        m.put("total_doctors", doctors.count());
        m.put("available_doctors", doctors.countByStatus("Available"));
        m.put("todays_appointments", appointments.countByAppointmentDate(today));
        m.put("pending_appointments", appointments.countByAppointmentDateAndStatus(today, "Pending"));
        m.put("total_revenue", bills.totalPaidRevenue());
        return m;
    }
}
