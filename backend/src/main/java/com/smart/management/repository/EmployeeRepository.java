package com.smart.management.repository;

import com.smart.management.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
    Boolean existsByEmployeeCode(String employeeCode);
    Boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:status IS NULL OR e.status = :status)")
    Page<Employee> searchEmployees(@Param("query") String query,
                                   @Param("department") String department,
                                   @Param("status") String status,
                                   Pageable pageable);

    @Query("SELECT DISTINCT e.department FROM Employee e WHERE e.department IS NOT NULL")
    List<String> findAllDepartments();

    @Query("SELECT e FROM Employee e WHERE MONTH(e.dateOfBirth) = :month AND DAY(e.dateOfBirth) = :day")
    List<Employee> findUpcomingBirthdays(@Param("month") int month, @Param("day") int day);
}
