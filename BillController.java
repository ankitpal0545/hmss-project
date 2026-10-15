package com.hms.controller;

import com.hms.entity.Bill;
import com.hms.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
public class BillController extends BaseController<Bill> {

    private final BillRepository repository;

    @Override
    protected JpaRepository<Bill, Long> repo() {
        return repository;
    }

    @Override
    protected void assignId(Bill entity, Long id) {
        entity.setBillId(id);
    }
}
