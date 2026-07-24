package com.smart.management.controller;

import com.smart.management.dto.ApiResponse;
import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.ProjectDTO;
import com.smart.management.entity.Project;
import com.smart.management.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "Endpoints for Managing Projects and Employee Assignment")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Create project")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(@Valid @RequestBody ProjectDTO dto) {
        ProjectDTO created = projectService.createProject(dto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Project created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update project")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        ProjectDTO updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Project updated successfully", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable Long id) {
        ProjectDTO dto = projectService.getProjectById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Project details", dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Project deleted successfully"));
    }

    @GetMapping
    @Operation(summary = "Search and filter projects with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ProjectDTO>>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Project.ProjectStatus status,
            @RequestParam(required = false) Project.Priority priority
    ) {
        PagedResponse<ProjectDTO> response = projectService.getAllProjects(page, size, sortBy, sortDir, query, status, priority);
        return ResponseEntity.ok(new ApiResponse<>(true, "Projects list", response));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Assign employees to project")
    public ResponseEntity<ApiResponse<ProjectDTO>> assignEmployees(@PathVariable Long id, @RequestBody Set<Long> employeeIds) {
        ProjectDTO updated = projectService.assignEmployees(id, employeeIds);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employees assigned successfully", updated));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get projects assigned to specific employee")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getProjectsByEmployee(@PathVariable Long employeeId) {
        List<ProjectDTO> list = projectService.getProjectsByEmployeeId(employeeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Assigned projects", list));
    }
}
