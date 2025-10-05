package me.gaga.employeehubapi.service;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.kudos.KudosDTO;
import me.gaga.employeehubapi.dto.kudos.SendKudosRequest;
import me.gaga.employeehubapi.dto.user.UserDTO;
import me.gaga.employeehubapi.entity.Kudos;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.exception.BadRequestException;
import me.gaga.employeehubapi.exception.ResourceNotFoundException;
import me.gaga.employeehubapi.repository.KudosRepository;
import me.gaga.employeehubapi.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KudosService {

    private final KudosRepository kudosRepository;
    private final UserRepository userRepository;
    private final TeamsWebhookService teamsWebhookService;

    public KudosDTO sendKudos(SendKudosRequest request) {
        User sender = getCurrentUser();
        if (sender.getId().equals(request.getReceiverId())) {
            throw new BadRequestException("Cannot send kudos to yourself");
        }

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getReceiverId()));

        if (sender.getKudosBalance() < request.getAmount()) {
            throw new BadRequestException("Insufficient kudos balance");
        }

        boolean isStreak = isDailyStreak(sender);

        int totalAmount = request.getAmount() + (isStreak ? Math.max(1, (int)Math.floor(request.getAmount() * 0.1)) : 0);

        sender.setKudosBalance(sender.getKudosBalance() - request.getAmount());
        receiver.setKudosReceived(receiver.getKudosReceived() + totalAmount);
        if (isStreak) {
            sender.setStreakCount(sender.getStreakCount() + 1);
        } else {
            sender.setStreakCount(1);
        }
        userRepository.save(sender);
        userRepository.save(receiver);

        Kudos kudos = Kudos.builder()
                .sender(sender)
                .receiver(receiver)
                .amount(totalAmount)
                .message(request.getMessage())
                .isStreakBonus(isStreak)
                .build();

        Kudos savedKudos = kudosRepository.save(kudos);
        
        // Send notification to Teams channel
        teamsWebhookService.sendKudosNotification(
                sender.getName(),
                receiver.getName(),
                totalAmount,
                request.getMessage()
        );

        return toDto(savedKudos);
    }

    public List<KudosDTO> feed(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Kudos> pageResult = kudosRepository.findAllByOrderByCreatedAtDesc(pageable);
        return pageResult.getContent().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<UserDTO> leaderboard() {
        return userRepository.findTopUsersByKudosReceived().stream().map(this::toUserDto).collect(Collectors.toList());
    }

    private boolean isDailyStreak(User sender) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return !kudosRepository.findBySenderAndCreatedAtAfter(sender, startOfDay).isEmpty();
    }

    private KudosDTO toDto(Kudos k) {
        return KudosDTO.builder()
                .id(k.getId())
                .sender(toUserDto(k.getSender()))
                .receiver(toUserDto(k.getReceiver()))
                .amount(k.getAmount())
                .message(k.getMessage())
                .createdAt(k.getCreatedAt())
                .isStreakBonus(k.getIsStreakBonus())
                .build();
    }

    private UserDTO toUserDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .kudosBalance(user.getKudosBalance())
                .kudosReceived(user.getKudosReceived())
                .streakCount(user.getStreakCount())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}


