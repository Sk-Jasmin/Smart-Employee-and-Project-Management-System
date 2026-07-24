package com.smart.management.mapper;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeDTO toDTO(Employee entity) {
        if (entity == null) return null;

        return EmployeeDTO.builder()
                .id(entity.getId())
                .employeeCode(entity.getEmployeeCode())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .department(entity.getDepartment())
                .designation(entity.getDesignation())
                .salary(entity.getSalary())
                .dateOfBirth(entity.getDateOfBirth())
                .joiningDate(entity.getJoiningDate())
                .address(entity.getAddress())
                .status(entity.getStatus())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .build();
    }

    public Employee toEntity(EmployeeDTO dto) {
        if (dto == null) return null;

        return Employee.builder()
                .id(dto.getId())
                .employeeCode(dto.getEmployeeCode())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .designation(dto.getDesignation())
                .salary(dto.getSalary())
                .dateOfBirth(dto.getDateOfBirth())
                .joiningDate(dto.getJoiningDate())
                .address(dto.getAddress())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
    }
}
