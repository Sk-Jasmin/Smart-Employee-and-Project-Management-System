package com.smart.management.service;

import com.smart.management.dto.PagedResponse;
import com.smart.management.dto.TaskDTO;
import com.smart.management.entity.Task;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    TaskDTO getTaskById(Long id);
    void deleteTask(Long id);
    List<TaskDTO> getTasksByProjectId(Long projectId);
    List<TaskDTO> getTasksByEmployeeId(Long employeeId);
    PagedResponse<TaskDTO> filterTasks(int page, int size, Long projectId, Long employeeId, Task.TaskStatus status);
}
