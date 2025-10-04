package me.gaga.employeehubapi.service;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.user.UpdateRoleRequest;
import me.gaga.employeehubapi.dto.user.UserDTO;
import me.gaga.employeehubapi.entity.Role;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.exception.ResourceNotFoundException;
import me.gaga.employeehubapi.exception.UnauthorizedException;
import me.gaga.employeehubapi.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserDTO(user);
    }

    public UserDTO updateUserRole(Long userId, UpdateRoleRequest request) {
        // Check if the current user is an ADMIN
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can update roles");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setRole(request.getRole());
        User updatedUser = userRepository.save(user);

        return mapToUserDTO(updatedUser);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private UserDTO mapToUserDTO(User user) {
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
}
