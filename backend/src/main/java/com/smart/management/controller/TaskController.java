package com.smart.management.controller;

import com.smart.management.dto.ApiResponse;
import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.TaskDTO;
import com.smart.management.entity.Task;
import com.smart.management.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Endpoints for Task creation, updates, and tracking")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    @Operation(summary = "Create task")
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(@Valid @RequestBody TaskDTO dto) {
        TaskDTO created = taskService.createTask(dto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Task created", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task status, progress, remarks")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO dto) {
        TaskDTO updated = taskService.updateTask(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task updated", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskDTO>> getTaskById(@PathVariable Long id) {
        TaskDTO dto = taskService.getTaskById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task details", dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted"));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get tasks by project ID")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Project tasks", taskService.getTasksByProjectId(projectId)));
    }

    @GetMapping
    @Operation(summary = "Filter tasks with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<TaskDTO>>> filterTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Task.TaskStatus status
    ) {
        PagedResponse<TaskDTO> response = taskService.filterTasks(page, size, projectId, employeeId, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks list", response));
    }
}
