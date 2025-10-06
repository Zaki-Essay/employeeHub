package me.gaga.employeehubapi.service;

import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.project.CreateProjectRequest;
import me.gaga.employeehubapi.dto.project.ProjectDTO;
import me.gaga.employeehubapi.dto.project.UpdateProjectRequest;
import me.gaga.employeehubapi.dto.user.UserDTO;
import me.gaga.employeehubapi.entity.Project;
import me.gaga.employeehubapi.entity.User;
import me.gaga.employeehubapi.exception.ResourceNotFoundException;
import me.gaga.employeehubapi.repository.ProjectRepository;
import me.gaga.employeehubapi.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<ProjectDTO> listProjects() {
        return projectRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProjectDTO createProject(CreateProjectRequest request) {
        User currentUser = getCurrentUser();
        Set<User> members = loadMembers(request.getMemberIds());

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .members(members)
                .build();

        return toDto(projectRepository.save(project));
    }

    public ProjectDTO updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setMembers(loadMembers(request.getMemberIds()));

        return toDto(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        projectRepository.delete(project);
    }

    private Set<User> loadMembers(Set<Long> memberIds) {
        if (memberIds == null) return new HashSet<>();
        return memberIds.stream()
                .map(uid -> userRepository.findById(uid)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", uid)))
                .collect(Collectors.toSet());
    }

    private ProjectDTO toDto(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .owner(toUserDto(project.getOwner()))
                .members(project.getMembers().stream().map(this::toUserDto).collect(Collectors.toSet()))
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



