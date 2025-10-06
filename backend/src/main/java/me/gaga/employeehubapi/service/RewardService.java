package me.gaga.employeehubapi.service;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.reward.RewardDTO;
import me.gaga.employeehubapi.dto.reward.RewardRedemptionDTO;
import me.gaga.employeehubapi.entity.Reward;
import me.gaga.employeehubapi.entity.RewardRedemption;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.exception.BadRequestException;
import me.gaga.employeehubapi.exception.ResourceNotFoundException;
import me.gaga.employeehubapi.repository.RewardRedemptionRepository;
import me.gaga.employeehubapi.repository.RewardRepository;
import me.gaga.employeehubapi.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository rewardRedemptionRepository;
    private final UserRepository userRepository;

    public List<RewardDTO> listRewards() {
        return rewardRepository.findByIsActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public RewardRedemptionDTO redeem(Long rewardId) {
        User user = getCurrentUser();
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Reward", "id", rewardId));

        if (user.getKudosBalance() < reward.getKudosCost()) {
            throw new BadRequestException("Not enough kudos to redeem this reward");
        }

        user.setKudosBalance(user.getKudosBalance() - reward.getKudosCost());
        userRepository.save(user);

        RewardRedemption redemption = RewardRedemption.builder()
                .user(user)
                .reward(reward)
                .kudosCost(reward.getKudosCost())
                .status("COMPLETED")
                .build();

        return toDto(rewardRedemptionRepository.save(redemption));
    }

    private RewardDTO toDto(Reward reward) {
        return RewardDTO.builder()
                .id(reward.getId())
                .name(reward.getName())
                .description(reward.getDescription())
                .kudosCost(reward.getKudosCost())
                .imageUrl(reward.getImageUrl())
                .build();
    }

    private RewardRedemptionDTO toDto(RewardRedemption rr) {
        return RewardRedemptionDTO.builder()
                .id(rr.getId()) //.rewardId(rr.getReward().getId())
                .kudosCost(rr.getKudosCost())
                .status(rr.getStatus())
                .redeemedAt(rr.getRedeemedAt())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}



