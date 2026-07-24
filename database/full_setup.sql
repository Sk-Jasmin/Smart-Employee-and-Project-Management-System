-- =============================================================================
-- MySQL 8.0 Full Installation Setup Script for SmartHR Corporate Portal
-- Combines DDL Tables, Constraints, Triggers, Views & DML Indian Seed Records
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `smarthr_india_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smarthr_india_db`;

-- -----------------------------------------------------------------------------
-- 1. SCHEMAS & TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_pfp_url` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `employee_code` VARCHAR(20) NOT NULL UNIQUE,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `salary_inr` DECIMAL(12,2) NOT NULL COMMENT 'Annual Compensation in ₹ INR',
  `date_of_birth` DATE DEFAULT NULL,
  `joining_date` DATE NOT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `avatar_pfp_url` TEXT DEFAULT NULL,
  `status` ENUM('ACTIVE','ON_LEAVE','TERMINATED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_emp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `certifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `issuer` VARCHAR(100) NOT NULL,
  `issue_date` DATE NOT NULL,
  `credential_id` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cert_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `achievements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `badge` VARCHAR(50) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `awarded_by` VARCHAR(100) NOT NULL,
  `awarded_date` DATE NOT NULL,
  `notes` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_achieve_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `priority` ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'HIGH',
  `status` ENUM('PLANNED','IN_PROGRESS','COMPLETED') DEFAULT 'IN_PROGRESS',
  `budget_inr` DECIMAL(12,2) NOT NULL COMMENT 'Allocated Budget in ₹ INR',
  `start_date` DATE NOT NULL,
  `deadline` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `assigned_employee_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `priority` ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'HIGH',
  `status` ENUM('TODO','IN_PROGRESS','REVIEW','DONE') DEFAULT 'TODO',
  `progress_percentage` INT DEFAULT 0,
  `deadline` DATE NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_task_proj` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_emp` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. SEED DATA
-- -----------------------------------------------------------------------------

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'System Administration Privileges'),
(2, 'MANAGER', 'Department Management Privileges'),
(3, 'EMPLOYEE', 'Standard Staff Privileges')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

INSERT INTO `users` (`id`, `role_id`, `username`, `email`, `password_hash`, `avatar_pfp_url`) VALUES
(1, 1, 'karthik', 'karthik.sundaram@smartcorp.in', '$2a$10$e8.Z3Q1wA4B7Y...BCryptHashValue', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 3, 'lakshmi', 'lakshmi.narayanan@smartcorp.in', '$2a$10$e8.Z3Q1wA4B7Y...BCryptHashValue', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `department`, `designation`, `salary_inr`, `date_of_birth`, `joining_date`, `address`, `avatar_pfp_url`, `status`) VALUES
(1, 1, 'EMP-101', 'Karthik', 'Sundaram', 'karthik.sundaram@smartcorp.in', '+91 98765 43210', 'Engineering', 'Senior Java Backend Specialist', 1850000.00, '1992-07-25', '2021-03-15', '123 Knowledge Park, Indiranagar, Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE'),
(2, 2, 'EMP-102', 'Lakshmi', 'Narayanan', 'lakshmi.narayanan@smartcorp.in', '+91 98123 45678', 'Engineering', 'Lead DevOps & Cloud Architect', 2100000.00, '1988-11-12', '2020-01-10', '456 IT Highway, OMR, Chennai, Tamil Nadu', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'ACTIVE'),
(3, NULL, 'EMP-103', 'Ashwin', 'Ramachandran', 'ashwin.ramachandran@smartcorp.in', '+91 97890 12345', 'Product', 'Principal Product Lead', 2450000.00, '1990-07-23', '2019-06-01', '789 HITEC City, Gachibowli, Hyderabad, Telangana', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ACTIVE'),
(4, NULL, 'EMP-104', 'Ananya', 'Subramanian', 'ananya.subramanian@smartcorp.in', '+91 96543 21098', 'Design', 'Senior UI/UX Designer', 1500000.00, '1994-04-18', '2022-02-14', '101 Gokulam Tech Enclave, Mysuru, Karnataka', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'ACTIVE'),
(5, NULL, 'EMP-105', 'Suresh', 'Venkatesh', 'suresh.venkatesh@smartcorp.in', '+91 95432 10987', 'Human Resources', 'Head of Talent & Culture', 1650000.00, '1993-09-05', '2021-08-20', '202 Cyber Park, Infopark, Kochi, Kerala', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE'),
(6, NULL, 'EMP-106', 'Vishnu', 'Prasad', 'vishnu.prasad@smartcorp.in', '+91 94321 09876', 'Engineering', 'Senior React & Mobile Specialist', 1750000.00, '1993-05-14', '2021-11-01', '55 Brigade Road, Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'ACTIVE'),
(7, NULL, 'EMP-107', 'Divya', 'Krishnan', 'divya.krishnan@smartcorp.in', '+91 93210 98765', 'Engineering', 'Frontend Architect & Systems Engineer', 1950000.00, '1991-08-29', '2020-07-15', '88 Anna Salai, Guindy, Chennai, Tamil Nadu', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'ACTIVE'),
(8, NULL, 'EMP-108', 'Arvind', 'Swaminathan', 'arvind.swaminathan@smartcorp.in', '+91 92109 87654', 'Product', 'Senior Technical Product Manager', 2200000.00, '1989-03-17', '2019-10-10', '304 Financial District, Nanakramguda, Hyderabad, Telangana', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'ACTIVE'),
(9, NULL, 'EMP-109', 'Deepa', 'Rajagopalan', 'deepa.rajagopalan@smartcorp.in', '+91 91098 76543', 'Design', 'Principal Product Experience Designer', 1680000.00, '1995-12-03', '2022-04-18', '42 MG Road, Mysuru, Karnataka', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', 'ACTIVE'),
(10, NULL, 'EMP-110', 'Mahesh', 'Reddy', 'mahesh.reddy@smartcorp.in', '+91 90987 65432', 'Human Resources', 'Senior HR Operations Manager', 1550000.00, '1992-02-21', '2021-09-01', '12 Jubilee Hills, Hyderabad, Telangana', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 'ACTIVE'),
(11, NULL, 'EMP-111', 'Kavya', 'Nambiar', 'kavya.nambiar@smartcorp.in', '+91 89876 54321', 'Engineering', 'Lead Quality Assurance Specialist', 1600000.00, '1994-10-10', '2022-01-05', '99 Technopark Highway, Trivandrum, Kerala', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'ACTIVE'),
(12, NULL, 'EMP-112', 'Siddharth', 'Rao', 'siddharth.rao@smartcorp.in', '+91 88765 43210', 'Engineering', 'Senior Site Reliability Engineer (SRE)', 2050000.00, '1990-06-30', '2020-03-20', '77 Koramangala, Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'ACTIVE'),
(13, NULL, 'EMP-113', 'Soundarya', 'Subrahmanian', 'soundarya.s@smartcorp.in', '+91 87654 32109', 'Finance', 'Head of Corporate Finance & Audit', 2300000.00, '1987-01-15', '2018-05-12', '15 T. Nagar, Chennai, Tamil Nadu', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', 'ACTIVE'),
(14, NULL, 'EMP-114', 'Harish', 'Hegde', 'harish.hegde@smartcorp.in', '+91 86543 21098', 'Operations', 'Director of Business Operations', 2500000.00, '1986-09-08', '2017-08-01', '63 Hampankatta, Mangaluru, Karnataka', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'ACTIVE'),
(15, NULL, 'EMP-115', 'Revathi', 'Balakrishnan', 'revathi.b@smartcorp.in', '+91 85432 10987', 'Engineering', 'Senior Data & AI Engineer', 1900000.00, '1993-03-25', '2021-06-15', '51 Beach Road, Visakhapatnam, Andhra Pradesh', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150', 'ACTIVE'),
(16, NULL, 'EMP-116', 'Preeti', 'Sharma', 'preeti.sharma@smartcorp.in', '+91 84321 09876', 'Engineering', 'Cybersecurity & Application Security Lead', 1980000.00, '1991-11-04', '2022-03-01', '14 Whitefield Main Rd, Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150', 'ACTIVE'),
(17, NULL, 'EMP-117', 'Rajesh', 'Nair', 'rajesh.nair@smartcorp.in', '+91 83210 98765', 'Engineering', 'Senior Full Stack Specialist (Node/React)', 1800000.00, '1993-08-19', '2021-10-15', '88 Panampilly Nagar, Kochi, Kerala', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE'),
(18, NULL, 'EMP-118', 'Meera', 'Joshi', 'meera.joshi@smartcorp.in', '+91 82109 87654', 'Product', 'Senior UX Research Analyst', 1620000.00, '1995-02-14', '2023-01-10', '202 Viman Nagar, Pune, Maharashtra', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE'),
(19, NULL, 'EMP-119', 'Vikram', 'Choudhury', 'vikram.choudhury@smartcorp.in', '+91 81098 76543', 'Finance', 'Senior Financial Controller & Analyst', 1950000.00, '1989-12-01', '2020-04-01', '45 Salt Lake Sector V, Kolkata, West Bengal', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ACTIVE'),
(20, NULL, 'EMP-120', 'Swati', 'Menon', 'swati.menon@smartcorp.in', '+91 80987 65432', 'Operations', 'Lead Supply Chain & Logistics Coordinator', 1720000.00, '1992-06-18', '2021-05-10', '12 MG Road, Thiruvananthapuram, Kerala', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'ACTIVE'),
(21, NULL, 'EMP-121', 'Aditya', 'Varma', 'aditya.varma@smartcorp.in', '+91 79876 54321', 'Engineering', 'Cloud Infrastructure & DevSecOps Engineer', 1880000.00, '1994-01-22', '2022-08-01', '99 HITEC City, Kondapur, Hyderabad, Telangana', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'ACTIVE'),
(22, NULL, 'EMP-122', 'Nitya', 'Sundaram', 'nitya.sundaram@smartcorp.in', '+91 78765 43210', 'Human Resources', 'Employee Engagement & Wellness Lead', 1580000.00, '1995-09-30', '2023-02-15', '56 Jayanagar 4th Block, Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'ACTIVE'),
(23, NULL, 'EMP-123', 'Rohan', 'Gupta', 'rohan.gupta@smartcorp.in', '+91 77654 32109', 'Engineering', 'Senior Data Platform & Spark Specialist', 1920000.00, '1991-04-12', '2021-04-01', '78 DLF Cyber City, Gurugram, Haryana', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'ACTIVE'),
(24, NULL, 'EMP-124', 'Archana', 'Pillai', 'archana.pillai@smartcorp.in', '+91 76543 21098', 'Design', 'Lead Interaction & Motion Designer', 1650000.00, '1994-07-08', '2022-06-01', '33 MG Road, Ernakulam, Kerala', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', 'ACTIVE'),
(25, NULL, 'EMP-125', 'Tarun', 'Kapoor', 'tarun.kapoor@smartcorp.in', '+91 75432 10987', 'Operations', 'Head of IT Infrastructure & Helpdesk', 1780000.00, '1988-10-25', '2019-11-15', '10 Sector 18, Noida, Uttar Pradesh', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'ACTIVE')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

INSERT INTO `certifications` (`id`, `employee_id`, `name`, `issuer`, `issue_date`, `credential_id`, `status`) VALUES
(1, 1, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2025-03-15', 'AWS-99201', 'ACTIVE'),
(2, 1, 'Oracle Certified Professional Java SE 21', 'Oracle Corporation', '2024-11-10', 'OCP-88219', 'ACTIVE'),
(3, 2, 'Kubernetes Certified Administrator (CKA)', 'CNCF', '2025-01-20', 'CKA-77120', 'ACTIVE')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `projects` (`id`, `name`, `description`, `priority`, `status`, `budget_inr`, `start_date`, `deadline`) VALUES
(1, 'Smart Corporate Portal 2.0', 'Enterprise React & Spring Boot platform with OAuth2 and real-time task sync.', 'HIGH', 'IN_PROGRESS', 2500000.00, '2026-06-01', '2026-09-30'),
(2, 'AWS Cloud Aurora Migration', 'Migrating legacy monolithic database to AWS Aurora PostgreSQL.', 'URGENT', 'IN_PROGRESS', 4500000.00, '2026-05-15', '2026-08-15')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `tasks` (`id`, `project_id`, `assigned_employee_id`, `title`, `description`, `priority`, `status`, `progress_percentage`, `deadline`, `remarks`) VALUES
(101, 1, 1, 'Sprint Microservices Security OAuth2 Integration', 'Implement JWT Token verification filter and Spring Security role-based access control annotations.', 'URGENT', 'IN_PROGRESS', 85, '2026-08-10', 'JWT Token filter code complete.'),
(125, 1, 7, 'GraphQL API Gateway & Schema Federation', 'Construct a centralized GraphQL federated schema layer to stitch microservice queries for employee and project details.', 'HIGH', 'IN_PROGRESS', 40, '2026-08-22', 'Apollo Gateway schema stitching defined; currently validating type resolvers.'),
(126, 2, 12, 'Zero-Downtime Data Migration & CDC Pipeline (Debezium)', 'Deploy Debezium Change Data Capture (CDC) connector with Kafka to stream real-time database transactions into Aurora PostgreSQL.', 'URGENT', 'REVIEW', 80, '2026-08-14', 'CDC pipeline streaming validation passed in staging environment.'),
(127, 3, 6, 'Offline Encrypted Storage & Keytar Vault Integration', 'Implement hardware-backed secure key storage using iOS Keychain and Android Keystore for biometric auth tokens.', 'HIGH', 'TODO', 15, '2026-09-10', 'Security review guidelines incorporated into technical design doc.'),
(128, 4, 15, 'LLM-Powered Executive Insight Summarizer', 'Integrate lightweight natural language generation model to auto-generate weekly textual executive insights on project milestones.', 'MEDIUM', 'IN_PROGRESS', 65, '2026-08-18', 'Prompt template pipeline tested; integrating with PDF export service.'),
(129, 1, 16, 'Zero-Trust WebAuthn & Multi-Factor Auth (MFA) Service', 'Implement WebAuthn security protocols, FIDO2 passkey hardware authentication, and SMS OTP fallback for executive user accounts.', 'URGENT', 'IN_PROGRESS', 55, '2026-08-25', 'WebAuthn passkey registration endpoints completed; integrating SMS gateway fallback.'),
(130, 2, 21, 'Automated Cloud FinOps Cost Optimization & Resource Tagging', 'Set up AWS Cost Explorer API alerts, auto-shutdown scripts for non-prod Aurora clusters, and automated resource tag enforcement.', 'MEDIUM', 'TODO', 20, '2026-09-05', 'Cost tagging policies defined in Terraform; awaiting approval from Finance team.'),
(131, 3, 17, 'Real-time Geofenced Attendance Verification Service', 'Construct serverless geofencing radius validation algorithm matching GPS coordinates against corporate office location polygons.', 'HIGH', 'IN_PROGRESS', 40, '2026-09-12', 'Haversine formula & polygon intersection logic written in Node microservice.'),
(132, 4, 23, 'Real-time Telemetry Data Lakehouse & Apache Iceberg Pipeline', 'Deploy PySpark streaming job to ingest project audit logs into Apache Iceberg table format for executive query acceleration.', 'HIGH', 'REVIEW', 85, '2026-08-30', 'Iceberg table partition scheme optimized; performance test shows 8x query speedup.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
