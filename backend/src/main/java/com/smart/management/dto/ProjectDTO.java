package com.smart.management.dto;

import com.smart.management.entity.Project;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private Long id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;
    private Project.Priority priority;
    private Project.ProjectStatus status;
    private LocalDate startDate;
    private LocalDate deadline;
    private BigDecimal budget;
    private Set<Long> assignedEmployeeIds;
    private Set<String> assignedEmployeeNames;
    private Integer taskCount;
    private Integer completedTaskCount;
}
