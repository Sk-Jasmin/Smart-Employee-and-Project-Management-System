package com.smart.management.service;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.PagedResponse;

import java.util.List;

public interface EmployeeService {
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    EmployeeDTO getEmployeeById(Long id);
    void deleteEmployee(Long id);
    PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String sortDir, String query, String department, String status);
    List<String> getDepartments();
    List<EmployeeDTO> getUpcomingBirthdays();
}
