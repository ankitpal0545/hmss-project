package com.hms.repository;

import com.hms.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface BillRepository extends JpaRepository<Bill, Long> {

    @Query("select coalesce(sum(b.amount), 0) from Bill b where b.paymentStatus = 'Paid'")
    BigDecimal totalPaidRevenue();
}
