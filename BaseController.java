package com.hms.controller;

import com.hms.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Generic CRUD endpoints shared by every module:
 *   GET /x        list      GET /x/{id}   one
 *   POST /x       create    PUT /x/{id}   update
 *   DELETE /x/{id} delete
 */
public abstract class BaseController<T> {

    protected abstract JpaRepository<T, Long> repo();

    protected abstract void assignId(T entity, Long id);

    protected String entityName() {
        return getClass().getSimpleName().replace("Controller", "");
    }

    @GetMapping
    public List<T> getAll() {
        return repo().findAll();
    }

    @GetMapping("/{id}")
    public T getOne(@PathVariable Long id) {
        return repo().findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(entityName() + " not found with id " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public T create(@Valid @RequestBody T entity) {
        assignId(entity, null);
        return repo().save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable Long id, @Valid @RequestBody T entity) {
        getOne(id); // 404 if it does not exist
        assignId(entity, id);
        return repo().save(entity);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        getOne(id);
        repo().deleteById(id);
        return Map.of("message", entityName() + " deleted");
    }
}
