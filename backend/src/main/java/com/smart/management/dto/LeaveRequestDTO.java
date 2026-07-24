package com.smart.management.dto;

import com.smart.management.entity.LeaveRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LeaveRequest.LeaveType leaveType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Integer totalDays;
    private String reason;
    private LeaveRequest.LeaveStatus status;
    private String approvedBy;
    private String adminRemarks;
}
