package com.smart.management.service.impl;

import com.smart.management.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                logger.info("Email sent successfully to {}", to);
            } else {
                logger.info("[MOCK EMAIL] To: {}, Subject: {}, Content: {}", to, subject, content);
            }
        } catch (Exception ex) {
            logger.error("Failed to send email to {}", to, ex);
        }
    }
}
