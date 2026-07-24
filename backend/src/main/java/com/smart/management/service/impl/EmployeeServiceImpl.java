package com.smart.management.service.impl;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.PagedResponse;
import com.smart.management.entity.Employee;
import com.smart.management.exception.BadRequestException;
import com.smart.management.exception.ResourceNotFoundException;
import com.smart.management.mapper.EmployeeMapper;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.service.AuditLogService;
import com.smart.management.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        if (employeeRepository.existsByEmployeeCode(employeeDTO.getEmployeeCode())) {
            throw new BadRequestException("Employee Code already exists: " + employeeDTO.getEmployeeCode());
        }

        if (employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new BadRequestException("Employee Email already exists: " + employeeDTO.getEmail());
        }

        Employee employee = employeeMapper.toEntity(employeeDTO);
        Employee saved = employeeRepository.save(employee);

        String currentUser = getCurrentUsername();
        auditLogService.logAction(currentUser, "EMPLOYEE_CREATE", "Employee", saved.getId(), "Created employee " + saved.getFirstName() + " " + saved.getLastName());

        return employeeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setPhone(employeeDTO.getPhone());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setSalary(employeeDTO.getSalary());
        employee.setDateOfBirth(employeeDTO.getDateOfBirth());
        employee.setJoiningDate(employeeDTO.getJoiningDate());
        employee.setAddress(employeeDTO.getAddress());
        if (employeeDTO.getStatus() != null) {
            employee.setStatus(employeeDTO.getStatus());
        }

        Employee updated = employeeRepository.save(employee);

        String currentUser = getCurrentUsername();
        auditLogService.logAction(currentUser, "EMPLOYEE_UPDATE", "Employee", updated.getId(), "Updated employee details");

        return employeeMapper.toDTO(updated);
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return employeeMapper.toDTO(employee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);

        String currentUser = getCurrentUsername();
        auditLogService.logAction(currentUser, "EMPLOYEE_DELETE", "Employee", id, "Deleted employee ID " + id);
    }

    @Override
    public PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String sortDir, String query, String department, String status) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Employee> employees = employeeRepository.searchEmployees(query, department, status, pageable);

        List<EmployeeDTO> content = employees.getContent().stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                employees.getNumber(),
                employees.getSize(),
                employees.getTotalElements(),
                employees.getTotalPages(),
                employees.isLast()
        );
    }

    @Override
    public List<String> getDepartments() {
        return employeeRepository.findAllDepartments();
    }

    @Override
    public List<EmployeeDTO> getUpcomingBirthdays() {
        LocalDate today = LocalDate.now();
        List<Employee> list = employeeRepository.findUpcomingBirthdays(today.getMonthValue(), today.getDayOfMonth());
        return list.stream().map(employeeMapper::toDTO).collect(Collectors.toList());
    }

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "SYSTEM";
    }
}
