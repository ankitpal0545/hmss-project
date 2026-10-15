package com.hms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineId;

    @NotBlank(message = "Medicine name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    /** Calculated from quantity, not stored in the database. */
    public String getStatus() {
        if (quantity == null || quantity <= 0) return "Out of Stock";
        return quantity <= 50 ? "Low Stock" : "In Stock";
    }
}
