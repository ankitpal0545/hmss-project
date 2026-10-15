package com.hms.controller;

import com.hms.entity.Doctor;
import com.hms.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController extends BaseController<Doctor> {

    private final DoctorRepository repository;

    @Override
    protected JpaRepository<Doctor, Long> repo() {
        return repository;
    }

    @Override
    protected void assignId(Doctor entity, Long id) {
        entity.setDoctorId(id);
    }
}
