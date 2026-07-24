# 🏢 Smart Employee & Project Management System (Monorepo)

An enterprise-grade, multi-tier corporate portal built with **React 18 + TypeScript** frontend, **Spring Boot 3 + MySQL 8.0** backend architecture, and complete **REST API Postman Collections**.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Repository Structure](#-repository-structure)
4. [Prerequisites](#-prerequisites)
5. [Default Login Credentials](#-default-login-credentials)
6. [Database Setup Instructions](#-database-setup-instructions)
7. [Frontend Setup & Launch](#-frontend-setup--launch)
8. [Backend Setup & Launch](#-backend-setup--launch)
9. [Postman Collection API Testing](#-postman-collection-api-testing)
10. [Environment Configurations](#-environment-configurations)

---

## ✨ Key Features

- **Personnel Dossier & Certification Tracking**: Manage 25+ detailed staff records with designations, salaries (in ₹ INR), certifications, and performance achievements.
- **Sprint & Project Milestone Engine**: Track active project initiatives, budget allocations, sprint deadlines, and assigned team members.
- **Task Workflow Lifecycle**: Kanban-style status flows (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`) with completion tracking and deadline countdowns.
- **Biometric Attendance & Leave Portal**: Geofenced check-in/check-out logs, automated work hours calculation, and HR leave approval workflows.
- **Executive Analytics & PDF Reporting**: Instant PDF export, financial breakdown charts, and departmental compensation anomaly metrics.
- **Role-Based Access Control (RBAC)**: Enforces role permissions across `ADMIN`, `MANAGER`, and `EMPLOYEE` accounts.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons, Recharts, Axios, JSZip
- **Backend**: Java 21, Spring Boot 3.3.0, Spring Security (JWT), Spring Data JPA, Hibernate, OpenAPI (Swagger UI)
- **Database**: MySQL 8.0 DDL & Seed SQL Scripts
- **API Testing**: Postman Collection v2.1.0

---

## 📁 Repository Structure

```
smart-employee-&-project-management-system/
├── frontend/                               <-- React 18 + Vite + TypeScript Web Application
│   ├── src/
│   │   ├── components/                     <-- Modular UI & Profile Dossier Components
│   │   ├── data/                           <-- Mock Data Schemas & Telemetry Specifications
│   │   ├── pages/                          <-- Dashboard, Employees, Projects, Tasks, Reports
│   │   ├── services/                       <-- API & Authentication Services
│   │   └── types/                          <-- TypeScript Interfaces
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                                <-- Spring Boot 3.2 Java REST API & Security
│   ├── src/
│   │   └── main/java/com/smart/management/
│   │       ├── config/                     <-- CORS & Swagger Config
│   │       ├── controller/                 <-- REST Controllers (Auth, Employees, Projects, Tasks)
│   │       ├── dto/                        <-- Data Transfer Objects
│   │       ├── entity/                     <-- JPA Hibernate Entities
│   │       ├── repository/                 <-- Spring Data Repositories
│   │       └── security/                   <-- JWT Authentication Filters
│   ├── pom.xml                             <-- Maven Dependencies
│   └── docker-compose.yml                  <-- Container Specs
│
├── database/                               <-- MySQL 8.0 Database Scripts
│   ├── full_setup.sql                      <-- Complete 1-Click Database Creation & Seed Script
│   ├── schema.sql                          <-- DDL Schemas, Indexes & Constraints
│   └── seed_data.sql                       <-- DML Seed Records (Employees, Projects, Tasks, Roles)
│
└── postman/                                <-- Postman Collection
    └── SmartCorp_API.postman_collection.json <-- Ready-to-Import API Testing Collection
```

---

## 🔑 Default Login Credentials

| Role | Username / Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@smartcorp.com` *or* `admin` | `Admin@1234` | Full System Access, Budget Management, User Roles |
| **EMPLOYEE** | `lakshmi.narayanan@smartcorp.in` *or* `lakshmi` | `Employee@1234` | Personal Tasks, Attendance Check-In, Leave Requests |

---

## 🗄 Database Setup Instructions

The project uses MySQL 8.0. You can run the database setup using any MySQL client (e.g. MySQL Workbench, DBeaver, or MySQL CLI).

### Option A: Complete 1-Click Automated Setup (Recommended)
Run `database/full_setup.sql` to create the database schema and populate it with initial seed records:

```bash
# Using MySQL Command Line Client:
mysql -u root -p < database/full_setup.sql
```

### Option B: Step-by-Step Setup

1. **Execute Schema Creation (`database/schema.sql`)**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. **Execute Seed Data Ingestion (`database/seed_data.sql`)**:
   ```bash
   mysql -u root -p < database/seed_data.sql
   ```

Database Name: `smarthr_india_db`

---

## 🖥 Frontend Setup & Launch

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **bun**

### Installation & Run Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   *The application will launch at `http://localhost:5173`.*

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## ⚙️ Backend Setup & Launch

### Prerequisites
- **JDK**: Java 21 LTS
- **Maven**: 3.8+
- **MySQL**: 8.0

### Run Steps

1. **Navigate to Backend Directory**:
   ```bash
   cd backend
   ```

2. **Configure Database Connection**:
   Update `backend/src/main/resources/application.yml` with your MySQL credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/smarthr_india_db?useSSL=false&allowPublicKeyRetrieval=true
       username: root
       password: your_mysql_password
   ```

3. **Compile & Run Spring Boot App**:
   ```bash
   mvn spring-boot:run
   ```
   *The backend REST API will run on `http://localhost:8080/api/v1`.*

4. **Access Swagger Interactive API Docs**:
   Open browser at `http://localhost:8080/swagger-ui.html`.

---

## 📮 Postman Collection API Testing

A complete Postman Collection (`SmartCorp_API.postman_collection.json`) is included in both the `postman/` directory and project root.

### How to Import & Use:

1. Open **Postman**.
2. Click **Import** button in the top left.
3. Select `postman/SmartCorp_API.postman_collection.json` (or `SmartCorp_API.postman_collection.json`).
4. The collection provides the following request groups:
   - 🔐 **1. Authentication**: Login as Admin (`Admin@1234`), Login as Employee (`Employee@1234`), Register User. *(The login request automatically saves the received JWT token into the `{{token}}` variable)*.
   - 👥 **2. Employees Management**: `GET /employees`, `GET /employees/{id}`, `POST /employees`, `PUT /employees/{id}`, `DELETE /employees/{id}`.
   - 📁 **3. Projects Management**: `GET /projects`, `POST /projects`, `PUT /projects/{id}`.
   - 📋 **4. Tasks Management**: `GET /tasks`, `POST /tasks`, `PUT /tasks/{id}`.
   - ⏱ **5. Attendance & Leaves**: `GET /attendance`, `GET /leaves`, `POST /leaves`.
   - 📊 **6. Reports & Metrics**: `GET /reports/summary`.

---

## 📝 Environment Configurations

Create a `.env` file in the root or `frontend/` directory (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME="SmartCorp Employee & Project Management"
```
