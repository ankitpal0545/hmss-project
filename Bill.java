package com.hms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    @NotBlank(message = "Patient is required")
    private String patientName;

    @NotBlank(message = "Doctor is required")
    private String doctorName;

    @NotBlank(message = "Service is required")
    private String service;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount cannot be negative")
    private BigDecimal amount;

    private LocalDate billDate;

    private String paymentStatus = "Pending";

    @PrePersist
    void setDefaultDate() {
        if (billDate == null) billDate = LocalDate.now();
    }
}
