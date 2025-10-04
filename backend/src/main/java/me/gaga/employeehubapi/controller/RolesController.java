package me.gaga.employeehubapi.controller;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.entity.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RolesController {

    @GetMapping("/")
    public ResponseEntity<List<Role>> list() {
        return ResponseEntity.ok(Arrays.asList(Role.values()));
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> create(@RequestParam Role role) {
        return ResponseEntity.ok(role);
    }

    @DeleteMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@RequestParam Role role) {
        return ResponseEntity.noContent().build();
    }
}


