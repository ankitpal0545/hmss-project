package com.hms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @NotBlank(message = "Patient is required")
    private String patientName;

    @NotBlank(message = "Doctor is required")
    private String doctorName;

    @NotNull(message = "Date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "Time is required")
    private LocalTime appointmentTime;

    @NotBlank(message = "Department is required")
    private String department;

    private String status = "Pending";
}
