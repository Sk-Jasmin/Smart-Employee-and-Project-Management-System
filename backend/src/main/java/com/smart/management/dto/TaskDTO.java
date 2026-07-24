package com.smart.management.dto;

import com.smart.management.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private Long id;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;
    private Task.TaskPriority priority;
    private Task.TaskStatus status;
    private Integer progressPercentage;
    private String remarks;
    private LocalDate deadline;

    @NotNull(message = "Project ID is required")
    private Long projectId;
    private String projectName;

    private Long assignedEmployeeId;
    private String assignedEmployeeName;
}
