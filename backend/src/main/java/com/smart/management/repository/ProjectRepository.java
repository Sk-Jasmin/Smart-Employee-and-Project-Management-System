package com.smart.management.repository;

import com.smart.management.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT p FROM Project p WHERE " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:priority IS NULL OR p.priority = :priority)")
    Page<Project> searchProjects(@Param("query") String query,
                                 @Param("status") Project.ProjectStatus status,
                                 @Param("priority") Project.Priority priority,
                                 Pageable pageable);

    @Query("SELECT p FROM Project p JOIN p.assignedEmployees e WHERE e.id = :employeeId")
    List<Project> findByAssignedEmployeeId(@Param("employeeId") Long employeeId);
}
