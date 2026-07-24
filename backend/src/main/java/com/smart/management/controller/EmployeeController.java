package com.smart.management.controller;

import com.smart.management.dto.ApiResponse;
import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.PagedResponse;
import com.smart.management.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "CRUD and search endpoints for employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new employee (Admin only)")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(@Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO created = employeeService.createEmployee(dto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Employee created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update employee details")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employee updated successfully", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long id) {
        EmployeeDTO dto = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employee fetched", dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete employee (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employee deleted successfully"));
    }

    @GetMapping
    @Operation(summary = "Get paginated employees with filtering, searching, and sorting")
    public ResponseEntity<ApiResponse<PagedResponse<EmployeeDTO>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status
    ) {
        PagedResponse<EmployeeDTO> response = employeeService.getAllEmployees(page, size, sortBy, sortDir, query, department, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employees retrieved successfully", response));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all distinct departments")
    public ResponseEntity<ApiResponse<List<String>>> getDepartments() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Departments list", employeeService.getDepartments()));
    }

    @GetMapping("/birthdays")
    @Operation(summary = "Get upcoming employee birthdays")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getBirthdays() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming birthdays", employeeService.getUpcomingBirthdays()));
    }
}
