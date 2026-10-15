package com.hms.config;

import com.hms.entity.*;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/** Inserts demo data the first time the app runs (only into empty tables). */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository users;
    private final PatientRepository patients;
    private final DoctorRepository doctors;
    private final AppointmentRepository appointments;
    private final MedicineRepository medicines;
    private final BillRepository bills;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPasswordHash(encoder.encode("admin123"));
            admin.setFullName("Admin");
            admin.setRole("Administrator");
            users.save(admin);
        }
        if (patients.count() == 0) {
            patients.save(patient("Rahul Sharma", 28, "Male", "9876543210", "O+", "Active"));
            patients.save(patient("Priya Patel", 35, "Female", "9876501234", "A+", "Active"));
            patients.save(patient("Amit Kumar", 42, "Male", "9812345678", "B+", "Under Treatment"));
            patients.save(patient("Neha Verma", 31, "Female", "9898989898", "AB+", "Active"));
        }
        if (doctors.count() == 0) {
            doctors.save(doctor("Dr. Mehta", "Cardiologist", 12, "9876543210", "Mon - Fri", "Available"));
            doctors.save(doctor("Dr. Shah", "Neurologist", 8, "9876501234", "Tue - Sat", "Available"));
            doctors.save(doctor("Dr. Singh", "Orthopedic", 10, "9812345678", "Mon - Thu", "On Leave"));
            doctors.save(doctor("Dr. Priya", "Pediatrician", 6, "9898989898", "Mon - Sat", "Available"));
            doctors.save(doctor("Dr. Joshi", "General Physician", 15, "9765432109", "Mon - Fri", "Available"));
        }
        if (appointments.count() == 0) {
            LocalDate today = LocalDate.now();
            appointments.save(appt("Rahul Sharma", "Dr. Mehta", today, 10, 0, "Cardiology", "Confirmed"));
            appointments.save(appt("Priya Patel", "Dr. Shah", today, 11, 30, "Neurology", "Pending"));
            appointments.save(appt("Amit Kumar", "Dr. Singh", today, 13, 0, "Orthopedics", "Confirmed"));
            appointments.save(appt("Neha Verma", "Dr. Mehta", today, 15, 30, "Cardiology", "Cancelled"));
            appointments.save(appt("Rohan Gupta", "Dr. Priya", today.plusDays(1), 9, 30, "Pediatrics", "Confirmed"));
        }
        if (medicines.count() == 0) {
            medicines.save(medicine("Paracetamol", "Pain Relief", 500, "25", LocalDate.of(2027, 12, 31)));
            medicines.save(medicine("Amoxicillin", "Antibiotic", 120, "80", LocalDate.of(2027, 8, 31)));
            medicines.save(medicine("Cetirizine", "Allergy", 35, "40", LocalDate.of(2027, 5, 31)));
            medicines.save(medicine("Azithromycin", "Antibiotic", 15, "120", LocalDate.of(2027, 3, 31)));
            medicines.save(medicine("Omeprazole", "Gastric", 200, "60", LocalDate.of(2027, 11, 30)));
        }
        if (bills.count() == 0) {
            LocalDate today = LocalDate.now();
            bills.save(bill("Rahul Sharma", "Dr. Mehta", "Consultation", "1500", today, "Paid"));
            bills.save(bill("Priya Patel", "Dr. Shah", "Consultation", "2000", today, "Pending"));
            bills.save(bill("Amit Kumar", "Dr. Singh", "X-Ray", "3500", today.minusDays(1), "Paid"));
            bills.save(bill("Neha Verma", "Dr. Mehta", "Blood Test", "800", today.minusDays(1), "Cancelled"));
            bills.save(bill("Rohan Gupta", "Dr. Priya", "Consultation", "1200", today.minusDays(2), "Paid"));
        }
    }

    private Patient patient(String name, int age, String gender, String phone, String blood, String status) {
        Patient p = new Patient();
        p.setName(name); p.setAge(age); p.setGender(gender); p.setPhone(phone);
        p.setBloodGroup(blood); p.setStatus(status);
        return p;
    }

    private Doctor doctor(String name, String spec, int exp, String phone, String avail, String status) {
        Doctor d = new Doctor();
        d.setName(name); d.setSpecialization(spec); d.setExperience(exp);
        d.setPhone(phone); d.setAvailability(avail); d.setStatus(status);
        return d;
    }

    private Appointment appt(String patient, String doctor, LocalDate date, int h, int m, String dept, String status) {
        Appointment a = new Appointment();
        a.setPatientName(patient); a.setDoctorName(doctor); a.setAppointmentDate(date);
        a.setAppointmentTime(LocalTime.of(h, m)); a.setDepartment(dept); a.setStatus(status);
        return a;
    }

    private Medicine medicine(String name, String category, int qty, String price, LocalDate expiry) {
        Medicine m = new Medicine();
        m.setName(name); m.setCategory(category); m.setQuantity(qty);
        m.setPrice(new BigDecimal(price)); m.setExpiryDate(expiry);
        return m;
    }

    private Bill bill(String patient, String doctor, String service, String amount, LocalDate date, String status) {
        Bill b = new Bill();
        b.setPatientName(patient); b.setDoctorName(doctor); b.setService(service);
        b.setAmount(new BigDecimal(amount)); b.setBillDate(date); b.setPaymentStatus(status);
        return b;
    }
}
