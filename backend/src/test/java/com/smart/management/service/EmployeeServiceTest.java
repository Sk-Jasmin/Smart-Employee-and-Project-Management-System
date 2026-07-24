package com.smart.management.service;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.entity.Employee;
import com.smart.management.mapper.EmployeeMapper;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeMapper employeeMapper;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee employee;
    private EmployeeDTO employeeDTO;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .employeeCode("EMP-101")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@company.com")
                .department("Engineering")
                .status("ACTIVE")
                .build();

        employeeDTO = EmployeeDTO.builder()
                .id(1L)
                .employeeCode("EMP-101")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@company.com")
                .department("Engineering")
                .status("ACTIVE")
                .build();
    }

    @Test
    void testGetEmployeeById_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(employeeMapper.toDTO(employee)).thenReturn(employeeDTO);

        EmployeeDTO result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals("EMP-101", result.getEmployeeCode());
        assertEquals("John", result.getFirstName());
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateEmployee_Success() {
        when(employeeRepository.existsByEmployeeCode("EMP-101")).thenReturn(false);
        when(employeeRepository.existsByEmail("john.doe@company.com")).thenReturn(false);
        when(employeeMapper.toEntity(employeeDTO)).thenReturn(employee);
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);
        when(employeeMapper.toDTO(employee)).thenReturn(employeeDTO);

        EmployeeDTO created = employeeService.createEmployee(employeeDTO);

        assertNotNull(created);
        assertEquals("John", created.getFirstName());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }
}
