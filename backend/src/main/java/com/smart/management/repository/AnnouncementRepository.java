package com.smart.management.repository;

import com.smart.management.entity.Announcement;
import com.smart.management.entity.AuditLog;
import com.smart.management.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findTop5ByOrderByCreatedAtDesc();
}
