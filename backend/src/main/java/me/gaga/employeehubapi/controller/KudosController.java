package me.gaga.employeehubapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.kudos.KudosDTO;
import me.gaga.employeehubapi.dto.kudos.SendKudosRequest;
import me.gaga.employeehubapi.dto.user.UserDTO;
import me.gaga.employeehubapi.service.KudosService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kudos")
@RequiredArgsConstructor
public class KudosController {

    private final KudosService kudosService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<KudosDTO> send(@Valid @RequestBody SendKudosRequest request) {
        return ResponseEntity.ok(kudosService.sendKudos(request));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<KudosDTO>> feed(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(kudosService.feed(page, size));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDTO>> leaderboard() {
        return ResponseEntity.ok(kudosService.leaderboard());
    }
}



