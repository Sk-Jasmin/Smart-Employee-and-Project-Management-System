package com.smart.management.utils;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.smart.management.dto.EmployeeDTO;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfExportUtil {

    public static ByteArrayInputStream employeesToPdf(List<EmployeeDTO> employees) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
            Paragraph title = new Paragraph("Employee Master Directory Report", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);

            String[] headers = {"Code", "Name", "Email", "Department", "Designation", "Status"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setBackgroundColor(Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (EmployeeDTO emp : employees) {
                table.addCell(emp.getEmployeeCode());
                table.addCell(emp.getFirstName() + " " + emp.getLastName());
                table.addCell(emp.getEmail());
                table.addCell(emp.getDepartment() != null ? emp.getDepartment() : "");
                table.addCell(emp.getDesignation() != null ? emp.getDesignation() : "");
                table.addCell(emp.getStatus());
            }

            document.add(table);
            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
