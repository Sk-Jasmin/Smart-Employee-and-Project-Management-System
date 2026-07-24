package com.smart.management.mapper;

import com.smart.management.dto.UserDTO;
import com.smart.management.entity.Employee;
import com.smart.management.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user, Employee employee) {
        if (user == null) {
            return null;
        }

        String fullName = "";
        String phone = "";
        String department = "";

        if (employee != null) {
            fullName = (employee.getFirstName() + " " + employee.getLastName()).trim();
            phone = employee.getPhone();
            department = employee.getDepartment();
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(fullName)
                .phone(phone)
                .department(department)
                .role(user.getRole())
                .enabled(user.getEnabled())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
