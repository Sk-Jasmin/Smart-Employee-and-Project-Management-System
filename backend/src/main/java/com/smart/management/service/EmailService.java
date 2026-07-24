package com.smart.management.service;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
}
