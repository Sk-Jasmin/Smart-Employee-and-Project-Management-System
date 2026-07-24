package com.smart.management.service.impl;

import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.TaskDTO;
import com.smart.management.entity.Employee;
import com.smart.management.entity.Project;
import com.smart.management.entity.Task;
import com.smart.management.exception.ResourceNotFoundException;
import com.smart.management.mapper.TaskMapper;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.repository.ProjectRepository;
import com.smart.management.repository.TaskRepository;
import com.smart.management.service.AuditLogService;
import com.smart.management.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    @Transactional
    public TaskDTO createTask(TaskDTO dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", dto.getProjectId()));

        Employee assignedEmployee = null;
        if (dto.getAssignedEmployeeId() != null) {
            assignedEmployee = employeeRepository.findById(dto.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getAssignedEmployeeId()));
        }

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : Task.TaskPriority.MEDIUM)
                .status(dto.getStatus() != null ? dto.getStatus() : Task.TaskStatus.TODO)
                .progressPercentage(dto.getProgressPercentage() != null ? dto.getProgressPercentage() : 0)
                .remarks(dto.getRemarks())
                .deadline(dto.getDeadline())
                .project(project)
                .assignedEmployee(assignedEmployee)
                .build();

        Task saved = taskRepository.save(task);
        auditLogService.logAction(getCurrentUsername(), "TASK_CREATE", "Task", saved.getId(), "Created task: " + saved.getTitle());

        return taskMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getProgressPercentage() != null) task.setProgressPercentage(dto.getProgressPercentage());
        task.setRemarks(dto.getRemarks());
        task.setDeadline(dto.getDeadline());

        if (dto.getAssignedEmployeeId() != null) {
            Employee assignedEmployee = employeeRepository.findById(dto.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getAssignedEmployeeId()));
            task.setAssignedEmployee(assignedEmployee);
        }

        Task updated = taskRepository.save(task);
        auditLogService.logAction(getCurrentUsername(), "TASK_UPDATE", "Task", updated.getId(), "Updated task: " + updated.getTitle());

        return taskMapper.toDTO(updated);
    }

    @Override
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return taskMapper.toDTO(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
        auditLogService.logAction(getCurrentUsername(), "TASK_DELETE", "Task", id, "Deleted task ID: " + id);
    }

    @Override
    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream().map(taskMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByEmployeeId(Long employeeId) {
        List<Task> tasks = taskRepository.findByAssignedEmployeeId(employeeId);
        return tasks.stream().map(taskMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public PagedResponse<TaskDTO> filterTasks(int page, int size, Long projectId, Long employeeId, Task.TaskStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Task> pageResult = taskRepository.filterTasks(projectId, employeeId, status, pageable);

        List<TaskDTO> content = pageResult.getContent().stream().map(taskMapper::toDTO).collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "SYSTEM";
    }
}
