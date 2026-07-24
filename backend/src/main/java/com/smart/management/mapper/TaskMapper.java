package com.smart.management.mapper;

import com.smart.management.dto.TaskDTO;
import com.smart.management.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDTO toDTO(Task entity) {
        if (entity == null) return null;

        return TaskDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .progressPercentage(entity.getProgressPercentage())
                .remarks(entity.getRemarks())
                .deadline(entity.getDeadline())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .projectName(entity.getProject() != null ? entity.getProject().getName() : null)
                .assignedEmployeeId(entity.getAssignedEmployee() != null ? entity.getAssignedEmployee().getId() : null)
                .assignedEmployeeName(entity.getAssignedEmployee() != null ?
                        entity.getAssignedEmployee().getFirstName() + " " + entity.getAssignedEmployee().getLastName() : null)
                .build();
    }
}
