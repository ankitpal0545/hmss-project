package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController extends BaseController<Appointment> {

    private final AppointmentRepository repository;

    @Override
    protected JpaRepository<Appointment, Long> repo() {
        return repository;
    }

    @Override
    protected void assignId(Appointment entity, Long id) {
        entity.setAppointmentId(id);
    }
}
