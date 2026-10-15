package com.hms.controller;

import com.hms.entity.Medicine;
import com.hms.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
public class MedicineController extends BaseController<Medicine> {

    private final MedicineRepository repository;

    @Override
    protected JpaRepository<Medicine, Long> repo() {
        return repository;
    }

    @Override
    protected void assignId(Medicine entity, Long id) {
        entity.setMedicineId(id);
    }
}
