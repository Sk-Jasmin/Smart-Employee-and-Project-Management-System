package com.smart.management.controller;

import com.smart.management.dto.ApiResponse;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.repository.ProjectRepository;
import com.smart.management.repository.TaskRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard Metrics", description = "Summary metrics for Admin and Employee Dashboards")
public class DashboardController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/admin")
    @Operation(summary = "Get high-level system metrics for Admin Dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminMetrics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", employeeRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalTasks", taskRepository.count());
        stats.put("departmentsCount", employeeRepository.findAllDepartments().size());

        return ResponseEntity.ok(new ApiResponse<>(true, "Admin metrics", stats));
    }
}
