package me.gaga.employeehubapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.user.UpdateRoleRequest;
import me.gaga.employeehubapi.dto.user.UserDTO;
import me.gaga.employeehubapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {

    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<UserDTO>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long userId, @Valid @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(userService.updateUserRole(userId, request));
    }
}


