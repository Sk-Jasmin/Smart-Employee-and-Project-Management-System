package com.smart.management.utils;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.ProjectDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelExportUtil {

    public static ByteArrayInputStream employeesToExcel(List<EmployeeDTO> employees) throws IOException {
        String[] columns = {"ID", "Code", "First Name", "Last Name", "Email", "Department", "Designation", "Status"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employees");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (EmployeeDTO emp : employees) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(emp.getId() != null ? emp.getId() : 0);
                row.createCell(1).setCellValue(emp.getEmployeeCode());
                row.createCell(2).setCellValue(emp.getFirstName());
                row.createCell(3).setCellValue(emp.getLastName());
                row.createCell(4).setCellValue(emp.getEmail());
                row.createCell(5).setCellValue(emp.getDepartment());
                row.createCell(6).setCellValue(emp.getDesignation());
                row.createCell(7).setCellValue(emp.getStatus());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
