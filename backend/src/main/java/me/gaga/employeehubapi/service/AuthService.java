package me.gaga.employeehubapi.service;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.auth.AuthResponse;
import me.gaga.employeehubapi.dto.auth.LoginRequest;
import me.gaga.employeehubapi.dto.auth.RegisterRequest;
import me.gaga.employeehubapi.entity.Role;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.exception.BadRequestException;
import me.gaga.employeehubapi.repository.UserRepository;
import me.gaga.employeehubapi.security.JwtTokenUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Default role is USER
                .avatarUrl(request.getAvatarUrl())
                .kudosBalance(100) // Initial kudos balance
                .kudosReceived(0)
                .streakCount(0)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtTokenUtil.generateToken(savedUser);

        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(user);

        return buildAuthResponse(user, token);
    }

    public AuthResponse getCurrentUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = jwtTokenUtil.generateToken(user);

        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .avatarUrl(user.getAvatarUrl())
                .kudosBalance(user.getKudosBalance())
                .kudosReceived(user.getKudosReceived())
                .streakCount(user.getStreakCount())
                .build();
    }
}
