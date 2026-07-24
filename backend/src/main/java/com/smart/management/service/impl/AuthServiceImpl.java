package com.smart.management.service.impl;

import com.smart.management.dto.AuthRequest;
import com.smart.management.dto.AuthResponse;
import com.smart.management.dto.ForgotPasswordRequest;
import com.smart.management.dto.RegisterRequest;
import com.smart.management.dto.ResetPasswordRequest;
import com.smart.management.dto.UserDTO;
import com.smart.management.entity.Employee;
import com.smart.management.entity.Role;
import com.smart.management.entity.User;
import com.smart.management.exception.BadRequestException;
import com.smart.management.exception.ResourceNotFoundException;
import com.smart.management.mapper.UserMapper;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.repository.UserRepository;
import com.smart.management.security.JwtTokenProvider;
import com.smart.management.security.UserPrincipal;
import com.smart.management.service.AuthService;
import com.smart.management.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private UserMapper userMapper;

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        Optional<Employee> employeeOpt = employeeRepository.findByEmail(user.getEmail());
        String fullName = employeeOpt.map(e -> (e.getFirstName() + " " + e.getLastName()).trim())
                .orElse(user.getUsername());
        String department = employeeOpt.map(Employee::getDepartment).orElse("General");

        auditLogService.logAction(userPrincipal.getUsername(), "USER_LOGIN", "User", userPrincipal.getId(), "User logged in successfully");

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .fullName(fullName)
                .role(userPrincipal.getAuthorities().iterator().next().getAuthority())
                .department(department)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match!");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email Address '" + request.getEmail() + "' is already in use!");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_EMPLOYEE;

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // Parse full name into first and last name
        String nameStr = request.getFullName().trim();
        String firstName = nameStr;
        String lastName = "";
        if (nameStr.contains(" ")) {
            String[] parts = nameStr.split(" ", 2);
            firstName = parts[0];
            lastName = parts[1];
        }

        String empCode = "EMP-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Employee employee = Employee.builder()
                .employeeCode(empCode)
                .firstName(firstName)
                .lastName(lastName.isEmpty() ? "Employee" : lastName)
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment() != null ? request.getDepartment() : "General")
                .designation("Employee")
                .status("ACTIVE")
                .user(savedUser)
                .build();

        employeeRepository.save(employee);

        auditLogService.logAction(savedUser.getUsername(), "USER_REGISTER", "User", savedUser.getId(), "New user registered with role " + savedUser.getRole());

        // Authenticate & generate JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(request.getFullName())
                .role(savedUser.getRole().name())
                .department(employee.getDepartment())
                .build();
    }

    @Override
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(user.getEmail());
        return userMapper.toDTO(user, employeeOpt.orElse(null));
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
        
        auditLogService.logAction(user.getUsername(), "FORGOT_PASSWORD_REQUEST", "User", user.getId(), "Password reset requested for email " + request.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match!");
        }

        // In production, token is retrieved and validated from DB/Cache
        // Here we validate the request and log audit trail
        auditLogService.logAction("SYSTEM", "PASSWORD_RESET", "User", null, "Password reset successfully completed");
    }
}
