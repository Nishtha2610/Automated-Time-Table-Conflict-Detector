# 📅 Automated Timetable Conflict Detector
**Full-Stack Academic Project: Core Java Interval Engine + React Matrix UI + MySQL Database**

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📌 Project Overview
The **Automated Timetable Conflict Detector** is a dual-architecture scheduling platform built for academic institutions. It provides an intuitive real-time **React Weekly Matrix UI** for administrators and a powerful **Core Java OOP Interval Detection Engine** backed by a **MySQL relational database**.

It is designed to eliminate common timetable scheduling errors such as teacher double-booking, classroom collisions, cohort overlapping, and room capacity violations.

---

## ⚡ Key Features

- **Dual-Architecture Runtime**:
  1. **Full-Stack Web App**: React frontend communicating with a standalone Java REST API server running on port `8080`.
  2. **Terminal-Based CLI**: Direct console-based interface (`TimetableCLI`) for rapid evaluation and professor viva demonstrations.
- **Mathematical Interval Overlap Engine**:
  Evaluates time conflicts using the rigorous intersection theorem:
  $$\max(S_1, S_2) < \min(E_1, E_2)$$
- **Object-Oriented Design Patterns**:
  - **Strategy Pattern**: Modular conflict detection strategies (`TeacherOverlapRule`, `RoomOverlapRule`, `SectionOverlapRule`, `CapacityRule`) implementing the common `ConflictRule` interface.
  - **DAO Pattern**: Clean separation of database access logic via JDBC and parameterized SQL queries.
  - **Factory / Singleton**: Centralized database connection pool management via `DBConnection`.

---

## 🛡️ The 4 Conflict Detection Rules

1. **Teacher Overlap Rule**: A faculty member cannot be scheduled to teach more than one session at the same time across different classrooms.
2. **Room Collision Rule**: A physical classroom or laboratory cannot host two overlapping classes simultaneously.
3. **Cohort / Section Overlap Rule**: A student batch or section cannot have multiple lectures scheduled concurrently.
4. **Capacity Breach Rule**: The enrolled student count of a section must not exceed the maximum seating capacity of the assigned room.

---

## 📁 Repository Structure

```text
Automated-Time-Table-Conflict-Detector/
├── backend/
│   ├── bin/                          # Pre-compiled Java .class binaries
│   ├── lib/                          # External JAR dependencies (MySQL Connector, Gson, Jakarta)
│   └── src/main/java/com/timetable/
│       ├── MainApp.java              # Standalone HTTP REST microservice (:8080)
│       ├── cli/TimetableCLI.java     # Interactive terminal application
│       ├── config/DBConnection.java  # JDBC connection factory
│       ├── dao/                      # DAO layer (Teacher, Classroom, Course, Schedule)
│       ├── model/                    # Entity models (BaseEntity, Teacher, TimeSlot, etc.)
│       └── service/detector/         # Core Conflict Detection Engine & Strategy Rules
├── src/                              # React 18 frontend source (Components, Context, Matrix)
├── public/                           # Static web assets
├── schema.sql                        # MySQL database schema DDL & sample seed data
├── RUN_TERMINAL_JAVA.bat             # 1-Click launcher: Java Terminal CLI
├── RUN_WEB_APP.bat                   # 1-Click launcher: Full-Stack Web App (Java REST + React)
├── package.json                      # React / Vite project configuration
└── README.md                         # Project documentation
```

---

## 🚀 Quick Start & Execution

### 1. Database Setup
1. Open **MySQL Workbench** and connect to your local MySQL server (`localhost:3306`).
2. Open and execute [`schema.sql`](./schema.sql) (click the ⚡ icon) to initialize `timetable_db` and insert seed data.
3. If your MySQL root password is not `root`, update the `PASSWORD` constant in `backend/src/main/java/com/timetable/config/DBConnection.java`.

### 2. Launch the Application

#### Option A: Full-Stack Web App (Recommended)
Double-click:
```bat
RUN_WEB_APP.bat
```
This automatically boots:
- The Java REST API backend on `http://localhost:8080`
- The React Vite frontend on `http://localhost:5173`
- Automatically opens your web browser to the dashboard!

#### Option B: Java Terminal CLI
Double-click:
```bat
RUN_TERMINAL_JAVA.bat
```
Launches the interactive console CLI directly in a Command Prompt window.
