package com.smart.management.repository;

import com.smart.management.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedEmployeeId(Long employeeId);

    @Query("SELECT t FROM Task t WHERE " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:employeeId IS NULL OR t.assignedEmployee.id = :employeeId) AND " +
           "(:status IS NULL OR t.status = :status)")
    Page<Task> filterTasks(@Param("projectId") Long projectId,
                           @Param("employeeId") Long employeeId,
                           @Param("status") Task.TaskStatus status,
                           Pageable pageable);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = 'DONE'")
    long countCompletedByProjectId(@Param("projectId") Long projectId);
}
