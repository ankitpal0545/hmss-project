package com.hms.controller;

import com.hms.entity.AppUser;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<AppUser> found = users.findByUsername(request.username() == null ? "" : request.username());

        if (found.isEmpty() || request.password() == null
                || !encoder.matches(request.password(), found.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        AppUser u = found.get();
        return ResponseEntity.ok(Map.of(
                "username", u.getUsername(),
                "full_name", u.getFullName(),
                "role", u.getRole()));
    }
}
