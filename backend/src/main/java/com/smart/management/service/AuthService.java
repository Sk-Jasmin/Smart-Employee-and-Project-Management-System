package com.smart.management.service;

import com.smart.management.dto.AuthRequest;
import com.smart.management.dto.AuthResponse;
import com.smart.management.dto.ForgotPasswordRequest;
import com.smart.management.dto.RegisterRequest;
import com.smart.management.dto.ResetPasswordRequest;
import com.smart.management.dto.UserDTO;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
    UserDTO getCurrentUser(String username);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
