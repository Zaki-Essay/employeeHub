package me.gaga.employeehubapi.config;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.entity.Project;
import me.gaga.employeehubapi.entity.Reward;
import me.gaga.employeehubapi.entity.Role;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.repository.ProjectRepository;
import me.gaga.employeehubapi.repository.RewardRepository;
import me.gaga.employeehubapi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final RewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            if (userRepository.count() > 0) return;

            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@employeehub.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .avatarUrl(null)
                    .kudosBalance(500)
                    .kudosReceived(0)
                    .streakCount(0)
                    .enabled(true)
                    .build();
            User john = User.builder()
                    .name("John Doe")
                    .email("john@employeehub.com")
                    .password(passwordEncoder.encode("User@123"))
                    .role(Role.USER)
                    .avatarUrl(null)
                    .kudosBalance(200)
                    .kudosReceived(0)
                    .streakCount(0)
                    .enabled(true)
                    .build();
            User jane = User.builder()
                    .name("Jane Smith")
                    .email("jane@employeehub.com")
                    .password(passwordEncoder.encode("User@123"))
                    .role(Role.USER)
                    .avatarUrl(null)
                    .kudosBalance(200)
                    .kudosReceived(0)
                    .streakCount(0)
                    .enabled(true)
                    .build();

            admin = userRepository.save(admin);
            john = userRepository.save(john);
            jane = userRepository.save(jane);

            Project proj = Project.builder()
                    .name("Employee Portal")
                    .description("Internal tools portal")
                    .owner(admin)
                    .members(Set.of(john, jane))
                    .build();
            projectRepository.save(proj);

            Reward r1 = Reward.builder().name("Coffee Mug").description("Company mug").kudosCost(50).imageUrl(null).build();
            Reward r2 = Reward.builder().name("T-Shirt").description("Branded tee").kudosCost(120).imageUrl(null).build();
            Reward r3 = Reward.builder().name("Day Off").description("One day PTO").kudosCost(500).imageUrl(null).build();
            rewardRepository.save(r1);
            rewardRepository.save(r2);
            rewardRepository.save(r3);
        };
    }
}


