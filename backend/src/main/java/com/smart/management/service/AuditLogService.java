package com.smart.management.service;

import com.smart.management.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    void logAction(String username, String action, String entityName, Long entityId, String details);
    Page<AuditLog> getAllLogs(Pageable pageable);
}
