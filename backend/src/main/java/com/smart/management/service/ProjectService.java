package com.smart.management.service;

import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.ProjectDTO;
import com.smart.management.entity.Project;

import java.util.List;
import java.util.Set;

public interface ProjectService {
    ProjectDTO createProject(ProjectDTO projectDTO);
    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);
    ProjectDTO getProjectById(Long id);
    void deleteProject(Long id);
    PagedResponse<ProjectDTO> getAllProjects(int page, int size, String sortBy, String sortDir, String query, Project.ProjectStatus status, Project.Priority priority);
    ProjectDTO assignEmployees(Long projectId, Set<Long> employeeIds);
    List<ProjectDTO> getProjectsByEmployeeId(Long employeeId);
}
