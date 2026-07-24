# Smart Employee & Project Management System (Monorepo)

An enterprise-grade, multi-tier corporate portal built with **React 18 + TypeScript** frontend and **Spring Boot 3 + MySQL 8.0** backend architecture.

---

## 📁 Repository Structure

```
smart-employee-&-project-management-system/
├── frontend/                      <-- React 18 + Vite + TypeScript Web Application
│   ├── src/
│   │   ├── components/            <-- Modular UI & Profile Dossier Components
│   │   ├── data/                  <-- Data Schemas & Telemetry Specifications
│   │   ├── pages/                 <-- Dashboard, Employees, Projects, Tasks, Reports, Profile
│   │   ├── services/              <-- API Services & Persistent Auth Service
│   │   └── types/                 <-- TypeScript Interfaces
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       <-- Spring Boot 3.2 Java REST API & Security
│   ├── src/
│   │   └── main/java/com/smart/management/
│   │       ├── config/            <-- CORS & Swagger Config
│   │       ├── controller/        <-- REST APIs (Auth, Employees, Projects, Tasks, Reports)
│   │       ├── dto/               <-- Data Transfer Objects
│   │       ├── entity/            <-- JPA Hibernate Entities
│   │       ├── repository/        <-- Spring Data Repositories
│   │       └── security/          <-- JWT Authentication Filters
│   ├── pom.xml                    <-- Maven Dependencies
│   └── docker-compose.yml         <-- Container Specs
│
└── database/                      <-- MySQL 8.0 DDL & Indian Seed Data
    ├── schema.sql                 <-- Table Schemas, Indexes & Foreign Keys
    ├── seed_data.sql              <-- Indian Staff Data & ₹ INR Currency Seed Records
    └── full_setup.sql             <-- Automated Installation Setup Script
```

---

## 🚀 Quick Start Commands

### 1. Launch Frontend (React + Vite)
```bash
# From workspace root:
npm run dev
```

### 2. Build Frontend Distribution
```bash
npm run build
```

### 3. Launch Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```

### 4. Setup MySQL Database
Execute `database/full_setup.sql` in your MySQL Workbench or MySQL CLI client.
