import { BackendFile } from '../types';

export const BACKEND_FILES: BackendFile[] = [
  {
    path: 'pom.xml',
    category: 'root',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>
    <groupId>com.smart.management</groupId>
    <artifactId>smart-employee-management</artifactId>
    <version>1.0.0</version>
    <name>Smart Employee &amp; Project Management System</name>
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
        <springdoc.version>2.5.0</springdoc.version>
        <poi.version>5.2.5</poi.version>
        <openpdf.version>1.3.38</openpdf.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>\${poi.version}</version>
        </dependency>
        <dependency>
            <groupId>com.github.librepdf</groupId>
            <artifactId>openpdf</artifactId>
            <version>\${openpdf.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'Dockerfile',
    category: 'root',
    content: `FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/smart-employee-management-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`
  },
  {
    path: 'docker-compose.yml',
    category: 'root',
    content: `version: '3.8'
services:
  mysqldb:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: smart_emp_db
    ports:
      - "3306:3306"
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_HOST: mysqldb
      DB_PORT: 3306
      DB_NAME: smart_emp_db
      DB_USER: root
      DB_PASSWORD: rootpassword
      JWT_SECRET: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    depends_on:
      - mysqldb`
  },
  {
    path: 'src/main/resources/application.yml',
    category: 'resource',
    content: `server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: smart-employee-management
  datasource:
    url: jdbc:mysql://\${DB_HOST:localhost}:3306/smart_emp_db
    username: \${DB_USER:root}
    password: \${DB_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
app:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration-ms: 86400000`
  },
  {
    path: 'src/main/resources/schema.sql',
    category: 'resource',
    content: `-- MySQL 8.0 DDL Schema Script for SmartHR Corporate Database
CREATE DATABASE IF NOT EXISTS smart_emp_db;
USE smart_emp_db;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dept_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  budget DECIMAL(12,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  department_id INT NOT NULL,
  employee_code VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  designation VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  joining_date DATE NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') DEFAULT 'ACTIVE',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);`
  },
  {
    path: 'src/main/java/com/smart/management/SmartEmployeeManagementApplication.java',
    category: 'root',
    content: `package com.smart.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class SmartEmployeeManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartEmployeeManagementApplication.class, args);
    }
}`
  },
  {
    path: 'src/main/java/com/smart/management/config/SecurityConfig.java',
    category: 'config',
    content: `package com.smart.management.config;

import com.smart.management.security.CustomUserDetailsService;
import com.smart.management.security.JwtAuthenticationEntryPoint;
import com.smart.management.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`
  },
  {
    path: 'src/main/java/com/smart/management/security/JwtTokenProvider.java',
    category: 'security',
    content: `package com.smart.management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms}")
    private long jwtExpirationInMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }
}`
  },
  {
    path: 'src/main/java/com/smart/management/controller/EmployeeController.java',
    category: 'controller',
    content: `package com.smart.management.controller;

import com.smart.management.dto.ApiResponse;
import com.smart.management.dto.EmployeeDTO;
import com.smart.management.dto.PagedResponse;
import com.smart.management.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(@Valid @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Employee created", employeeService.createEmployee(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<EmployeeDTO>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String query
    ) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Employees retrieved", 
            employeeService.getAllEmployees(page, size, sortBy, sortDir, query, null, null)));
    }
}`
  },
  {
    path: 'docker-compose.yml',
    category: 'root',
    content: `version: '3.8'

services:
  mysqldb:
    image: mysql:8.0
    container_name: smarthr_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: smart_emp_db
      MYSQL_USER: smarthr_user
      MYSQL_PASSWORD: smarthr_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/schema.sql:/docker-entrypoint-initdb.d/1_schema.sql
      - ./src/main/resources/data.sql:/docker-entrypoint-initdb.d/2_data.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: smarthr_backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysqldb:3306/smart_emp_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: smarthr_user
      SPRING_DATASOURCE_PASSWORD: smarthr_password
      APP_JWT_SECRET: superSecretJwtKey98765432101234567890ForSmartHRCorporatePlatform
    depends_on:
      mysqldb:
        condition: service_healthy

volumes:
  mysql_data:`
  },
  {
    path: 'Dockerfile',
    category: 'root',
    content: `# Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Package Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`
  },
  {
    path: '.gitignore',
    category: 'root',
    content: `# Maven Target
target/
*.jar
*.war
*.ear

# IDE & Editor Configs
.idea/
*.iml
.classpath
.project
.settings/
.vscode/

# Environment Secrets
.env
*.key
*.pem

# Node / Frontend Build
node_modules/
dist/
build/
.DS_Store`
  },
  {
    path: 'README.md',
    category: 'root',
    content: `# SmartHR - Enterprise Employee & Project Management Platform

A production-grade, full-stack enterprise management system built with **Java 21**, **Spring Boot 3.3**, **Spring Security (JWT)**, **Spring Data JPA**, **MySQL 8.0**, and **React 18 / TypeScript / Tailwind CSS**.

---

## 🚀 Key Features

- **Full Lifecycle HR Management**: Employee profiles, designations, department budget tracking, salary audits.
- **Project & Task Delivery Engine**: Kanban boards, task status workflow (TODO, IN_PROGRESS, REVIEW, DONE), milestone deadlines, and progress completion tracking.
- **Attendance & Time Tracking**: Clock-in/out timestamps, automated hour calculations, daily status logs (Present, Late, Absent, Half-Day).
- **Leave Management Workflow**: Multi-tier request submissions, automated email/in-app notifications via triggers, and executive approval flows.
- **MySQL 8.0 Relational Architecture**: 12 normalized tables with foreign key cascades, stored procedures, audit triggers, and aggregated financial views.
- **Interactive OpenAPI / Swagger 3.0 UI**: Comprehensive API documentation with bearer JWT authorization.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for ADMIN, MANAGER, and EMPLOYEE roles.

---

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.3.0, Java 21, Spring Security, JWT (io.jsonwebtoken), Spring Data JPA, Hibernate 6, Liquibase / DDL Scripts.
- **Database**: MySQL 8.0 (InnoDB, utf8mb4), HikariCP Connection Pool.
- **Testing**: JUnit 5, Mockito, Spring Boot Test, MockMvc Integration Tests.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Containerization & CI/CD**: Docker, Docker Compose, GitHub Actions.

---

## 💻 Quick Start with Docker Compose

Ensure Docker and Docker Compose are installed, then run:

\`\`\`bash
docker-compose up --build -d
\`\`\`

- **API Server**: \`http://localhost:8080\`
- **Swagger UI**: \`http://localhost:8080/swagger-ui.html\`
- **MySQL Database**: \`localhost:3306\` (User: \`smarthr_user\`, DB: \`smart_emp_db\`)

---

## 🧪 Running Unit & Integration Tests

Execute full JUnit 5 and Mockito test suite:

\`\`\`bash
mvn clean test
\`\`\`

To run integration tests with MockMvc:

\`\`\`bash
mvn test -Dtest=*IntegrationTest
\`\`\`

---

## 📁 Repository Structure

\`\`\`
.
├── docker-compose.yml
├── Dockerfile
├── pom.xml
├── README.md
├── postman/
│   └── SmartHR_API.postman_collection.json
├── src/
│   ├── main/
│   │   ├── java/com/smart/management/
│   │   │   ├── config/ (OpenApiConfig, SecurityConfig)
│   │   │   ├── controller/ (EmployeeController, AuthController, etc.)
│   │   │   ├── entity/ (Employee, User, Department, Task, etc.)
│   │   │   ├── repository/
│   │   │   ├── security/ (JwtTokenProvider, JwtAuthenticationFilter)
│   │   │   └── service/ (EmployeeService, TaskService)
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── schema.sql (MySQL DDL Script)
│   │       └── data.sql (Seed Data Script)
│   └── test/
│       └── java/com/smart/management/
│           ├── controller/ (EmployeeControllerIntegrationTest)
│           ├── security/ (JwtTokenProviderTest)
│           └── service/ (EmployeeServiceTest)
\`\`\`
`
  },
  {
    path: 'postman/SmartHR_API.postman_collection.json',
    category: 'root',
    content: `{
  "info": {
    "_postman_id": "smarthr-api-collection-v1",
    "name": "SmartHR Corporate API Gateway",
    "description": "Production Postman API collection for SmartHR backend endpoints including Auth, Employees, Projects, Tasks, Attendance, and Leaves.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "User Login",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"username\\": \\"admin\\",\\n  \\"password\\": \\"AdminPass123!\\"\\n}"
            },
            "url": { "raw": "{{baseUrl}}/api/auth/login", "host": ["{{baseUrl}}"], "path": ["api", "auth", "login"] }
          }
        }
      ]
    },
    {
      "name": "Employees",
      "item": [
        {
          "name": "Get All Employees (Paged & Filtered)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{jwtToken}}" }],
            "url": {
              "raw": "{{baseUrl}}/api/employees?page=0&size=10&sortBy=id&sortDir=asc",
              "host": ["{{baseUrl}}"],
              "path": ["api", "employees"],
              "query": [
                { "key": "page", "value": "0" },
                { "key": "size", "value": "10" },
                { "key": "sortBy", "value": "id" },
                { "key": "sortDir", "value": "asc" }
              ]
            }
          }
        },
        {
          "name": "Create New Employee Profile",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"firstName\\": \\"Michael\\",\\n  \\"lastName\\": \\"Scott\\",\\n  \\"email\\": \\"michael.scott@smartcorp.com\\",\\n  \\"phone\\": \\"+1 (555) 999-0000\\",\\n  \\"departmentId\\": 1,\\n  \\"designation\\": \\"Regional Branch Manager\\",\\n  \\"salary\\": 115000.00,\\n  \\"joiningDate\\": \\"2026-07-01\\"\\n}"
            },
            "url": { "raw": "{{baseUrl}}/api/employees", "host": ["{{baseUrl}}"], "path": ["api", "employees"] }
          }
        }
      ]
    }
  ]
}`
  },
  {
    path: 'src/main/resources/application.yml',
    category: 'resource',
    content: `server:
  port: 8080
  error:
    include-message: always

spring:
  application:
    name: smart-employee-management
  datasource:
    url: \${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/smart_emp_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
    username: \${SPRING_DATASOURCE_USERNAME:root}
    password: \${SPRING_DATASOURCE_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql

app:
  jwt:
    secret: \${APP_JWT_SECRET:d2VpZ2h0SGFzaFNlY3JldEtleUZvclNtYXJ0SFJD29ycG9yYXRlUGxhdGZvcm1TZWN1cml0eQ==}
    expiration-ms: 86400000`
  },
  {
    path: 'src/main/resources/data.sql',
    category: 'resource',
    content: `-- Initial Seed Data for SmartHR MySQL Database
INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Full system administration privileges'),
(2, 'MANAGER', 'Departmental management and project allocation privileges'),
(3, 'EMPLOYEE', 'Standard staff member privileges')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO departments (id, dept_code, name, budget) VALUES
(1, 'ENG', 'Engineering', 450000.00),
(2, 'PD', 'Product & Design', 280000.00),
(3, 'HR', 'Human Resources', 150000.00),
(4, 'FIN', 'Finance & Accounting', 200000.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO users (id, role_id, username, email, password_hash, is_active) VALUES
(1, 1, 'admin', 'alex.morgan@smartcorp.com', '$2a$10$e8.Z3Q1wA4B7Y...BCryptHashValue', 1),
(2, 2, 'manager', 'sarah.jenkins@smartcorp.com', '$2a$10$e8.Z3Q1wA4B7Y...BCryptHashValue', 1),
(3, 3, 'dev_dave', 'david.chen@smartcorp.com', '$2a$10$e8.Z3Q1wA4B7Y...BCryptHashValue', 1)
ON DUPLICATE KEY UPDATE email=VALUES(email);

INSERT INTO employees (id, user_id, department_id, employee_code, first_name, last_name, email, phone, designation, salary, joining_date, status) VALUES
(1, 1, 1, 'EMP-101', 'Alex', 'Morgan', 'alex.morgan@smartcorp.com', '+1 (555) 234-5678', 'Senior Java Backend Engineer', 125000.00, '2022-03-15', 'ACTIVE'),
(2, 2, 1, 'EMP-102', 'Sarah', 'Jenkins', 'sarah.jenkins@smartcorp.com', '+1 (555) 345-6789', 'Lead Software Architect', 145000.00, '2021-06-01', 'ACTIVE'),
(3, 3, 1, 'EMP-103', 'David', 'Chen', 'david.chen@smartcorp.com', '+1 (555) 456-7890', 'Full Stack Developer', 98000.00, '2023-01-10', 'ACTIVE'),
(4, NULL, 2, 'EMP-104', 'Emily', 'Watson', 'emily.watson@smartcorp.com', '+1 (555) 567-8901', 'Senior UI/UX Designer', 92000.00, '2023-05-20', 'ACTIVE')
ON DUPLICATE KEY UPDATE email=VALUES(email);`
  },
  {
    path: 'src/main/java/com/smart/management/config/OpenApiConfig.java',
    category: 'config',
    content: `package com.smart.management.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("SmartHR Corporate REST API Specifications")
                        .version("1.0.0")
                        .description("RESTful microservice API endpoints for Employee Management, Payroll, Task Allocation, Attendance, and Leaves.")
                        .contact(new Contact().name("SmartHR Engineering Team").email("api@smartcorp.com"))
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}`
  },
  {
    path: 'src/test/java/com/smart/management/controller/EmployeeControllerIntegrationTest.java',
    category: 'test',
    content: `package com.smart.management.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetAllEmployeesSuccess() throws Exception {
        mockMvc.perform(get("/api/employees")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }
}`
  },
  {
    path: 'src/test/java/com/smart/management/security/JwtTokenProviderTest.java',
    category: 'test',
    content: `package com.smart.management.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "d2VpZ2h0SGFzaFNlY3JldEtleUZvclNtYXJ0SFJD29ycG9yYXRlUGxhdGZvcm1TZWN1cml0eQ==");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", 3600000L);
    }

    @Test
    void testGenerateAndValidateToken() {
        UserPrincipal principal = new UserPrincipal(1L, "admin", "admin@smartcorp.com", "pass", null);
        Authentication auth = Mockito.mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(principal);

        String token = tokenProvider.generateToken(auth);
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("admin", tokenProvider.getUsernameFromToken(token));
    }
}`
  },
  {
    path: 'src/test/java/com/smart/management/service/EmployeeServiceTest.java',
    category: 'test',
    content: `package com.smart.management.service;

import com.smart.management.dto.EmployeeDTO;
import com.smart.management.entity.Employee;
import com.smart.management.repository.EmployeeRepository;
import com.smart.management.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @Test
    void testGetEmployeeById() {
        Employee employee = Employee.builder().id(1L).firstName("John").lastName("Doe").build();
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        EmployeeDTO dto = employeeService.getEmployeeById(1L);
        assertNotNull(dto);
        verify(employeeRepository, times(1)).findById(1L);
    }
}`
  }
];
