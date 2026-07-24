package com.smart.management.service.impl;

import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.ProjectDTO;
import com.smart.management.entity.Employee;
import com.smart.management.entity.Project;
import com.smart.management.exception.ResourceNotFoundException;
import com.smart.management.mapper.ProjectMapper;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.repository.ProjectRepository;
import com.smart.management.repository.TaskRepository;
import com.smart.management.service.AuditLogService;
import com.smart.management.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    @Transactional
    public ProjectDTO createProject(ProjectDTO dto) {
        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : Project.Priority.MEDIUM)
                .status(dto.getStatus() != null ? dto.getStatus() : Project.ProjectStatus.PLANNED)
                .startDate(dto.getStartDate())
                .deadline(dto.getDeadline())
                .budget(dto.getBudget())
                .build();

        if (dto.getAssignedEmployeeIds() != null && !dto.getAssignedEmployeeIds().isEmpty()) {
            List<Employee> employees = employeeRepository.findAllById(dto.getAssignedEmployeeIds());
            project.setAssignedEmployees(new HashSet<>(employees));
        }

        Project saved = projectRepository.save(project);
        auditLogService.logAction(getCurrentUsername(), "PROJECT_CREATE", "Project", saved.getId(), "Created project: " + saved.getName());

        return enrichProjectDTO(saved);
    }

    @Override
    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        if (dto.getPriority() != null) project.setPriority(dto.getPriority());
        if (dto.getStatus() != null) project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setDeadline(dto.getDeadline());
        project.setBudget(dto.getBudget());

        Project updated = projectRepository.save(project);
        auditLogService.logAction(getCurrentUsername(), "PROJECT_UPDATE", "Project", updated.getId(), "Updated project: " + updated.getName());

        return enrichProjectDTO(updated);
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return enrichProjectDTO(project);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        projectRepository.delete(project);
        auditLogService.logAction(getCurrentUsername(), "PROJECT_DELETE", "Project", id, "Deleted project ID: " + id);
    }

    @Override
    public PagedResponse<ProjectDTO> getAllProjects(int page, int size, String sortBy, String sortDir, String query, Project.ProjectStatus status, Project.Priority priority) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Project> pageResult = projectRepository.searchProjects(query, status, priority, pageable);

        List<ProjectDTO> content = pageResult.getContent().stream()
                .map(this::enrichProjectDTO)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Override
    @Transactional
    public ProjectDTO assignEmployees(Long projectId, Set<Long> employeeIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        List<Employee> employees = employeeRepository.findAllById(employeeIds);
        project.setAssignedEmployees(new HashSet<>(employees));

        Project saved = projectRepository.save(project);
        auditLogService.logAction(getCurrentUsername(), "PROJECT_ASSIGN_EMPLOYEES", "Project", projectId, "Assigned " + employees.size() + " employees to project");

        return enrichProjectDTO(saved);
    }

    @Override
    public List<ProjectDTO> getProjectsByEmployeeId(Long employeeId) {
        List<Project> list = projectRepository.findByAssignedEmployeeId(employeeId);
        return list.stream().map(this::enrichProjectDTO).collect(Collectors.toList());
    }

    private ProjectDTO enrichProjectDTO(Project project) {
        ProjectDTO dto = projectMapper.toDTO(project);
        long totalTasks = taskRepository.countByProjectId(project.getId());
        long completedTasks = taskRepository.countCompletedByProjectId(project.getId());
        dto.setTaskCount((int) totalTasks);
        dto.setCompletedTaskCount((int) completedTasks);
        return dto;
    }

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "SYSTEM";
    }
}
