package com.smart.management.dto;

import com.smart.management.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String department;
    private Role role;
    private Boolean enabled;
    private String profileImage;
    private LocalDateTime createdAt;
}
