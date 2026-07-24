package com.smart.management.mapper;

import com.smart.management.dto.ProjectDTO;
import com.smart.management.entity.Employee;
import com.smart.management.entity.Project;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public ProjectDTO toDTO(Project entity) {
        if (entity == null) return null;

        return ProjectDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .startDate(entity.getStartDate())
                .deadline(entity.getDeadline())
                .budget(entity.getBudget())
                .assignedEmployeeIds(entity.getAssignedEmployees() != null ?
                        entity.getAssignedEmployees().stream().map(Employee::getId).collect(Collectors.toSet()) : null)
                .assignedEmployeeNames(entity.getAssignedEmployees() != null ?
                        entity.getAssignedEmployees().stream().map(e -> e.getFirstName() + " " + e.getLastName()).collect(Collectors.toSet()) : null)
                .build();
    }
}
