package com.hms.controller;

import com.hms.entity.Patient;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController extends BaseController<Patient> {

    private final PatientRepository repository;

    @Override
    protected JpaRepository<Patient, Long> repo() {
        return repository;
    }

    @Override
    protected void assignId(Patient entity, Long id) {
        entity.setPatientId(id);
    }
}
