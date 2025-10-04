package me.gaga.employeehubapi.controller;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.reward.RewardDTO;
import me.gaga.employeehubapi.dto.reward.RewardRedemptionDTO;
import me.gaga.employeehubapi.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rewards")
@RequiredArgsConstructor
public class RewardsController {

    private final RewardService rewardService;

    @GetMapping("/")
    public ResponseEntity<List<RewardDTO>> list() {
        return ResponseEntity.ok(rewardService.listRewards());
    }

    @PostMapping("/{rewardId}/redeem")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<RewardRedemptionDTO> redeem(@PathVariable Long rewardId) {
        return ResponseEntity.ok(rewardService.redeem(rewardId));
    }
}


