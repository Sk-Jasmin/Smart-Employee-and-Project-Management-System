package com.smart.management.controller;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.PagedResponse;
import com.smart.management.service.EmployeeService;
import com.smart.management.utils.ExcelExportUtil;
import com.smart.management.utils.PdfExportUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Endpoints for Exporting Reports in Excel and PDF formats")
public class ReportController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employees/excel")
    @Operation(summary = "Export Employee list to Excel")
    public ResponseEntity<InputStreamResource> exportEmployeesToExcel() throws IOException {
        PagedResponse<EmployeeDTO> paged = employeeService.getAllEmployees(0, 1000, "id", "asc", null, null, null);
        List<EmployeeDTO> employees = paged.getContent();

        ByteArrayInputStream in = ExcelExportUtil.employeesToExcel(employees);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=employees.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/employees/pdf")
    @Operation(summary = "Export Employee list to PDF")
    public ResponseEntity<InputStreamResource> exportEmployeesToPdf() {
        PagedResponse<EmployeeDTO> paged = employeeService.getAllEmployees(0, 1000, "id", "asc", null, null, null);
        List<EmployeeDTO> employees = paged.getContent();

        ByteArrayInputStream in = PdfExportUtil.employeesToPdf(employees);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=employees_report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
