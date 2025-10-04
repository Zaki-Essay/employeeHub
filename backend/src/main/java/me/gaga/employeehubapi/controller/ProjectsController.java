package me.gaga.employeehubapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.gaga.employeehubapi.dto.project.CreateProjectRequest;
import me.gaga.employeehubapi.dto.project.ProjectDTO;
import me.gaga.employeehubapi.dto.project.UpdateProjectRequest;
import me.gaga.employeehubapi.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectsController {

    private final ProjectService projectService;

    @GetMapping("/")
    public ResponseEntity<List<ProjectDTO>> listProjects() {
        return ResponseEntity.ok(projectService.listProjects());
    }

    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ProjectDTO> create(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ProjectDTO> update(@PathVariable Long projectId, @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(projectId, request));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}


