-- ========================================================
-- Automated Timetable Conflict Detector - Database Schema
-- Database: MySQL 8.0+
-- Run this script directly in MySQL Workbench
-- ========================================================

DROP DATABASE IF EXISTS timetable_db;
CREATE DATABASE timetable_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE timetable_db;

-- 1. Teachers Table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    department VARCHAR(80) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Classrooms Table
CREATE TABLE classrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(30) NOT NULL UNIQUE,
    building VARCHAR(60) NOT NULL,
    capacity INT NOT NULL,
    room_type ENUM('Lecture Hall', 'Computer Lab', 'Seminar Room') DEFAULT 'Lecture Hall',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    department VARCHAR(80) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Sections / Cohorts Table
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(40) NOT NULL UNIQUE,
    student_count INT NOT NULL,
    department VARCHAR(80) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Timetable Schedule Entries Table
CREATE TABLE schedule_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    classroom_id INT NOT NULL,
    course_id INT NOT NULL,
    section_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    academic_term VARCHAR(30) DEFAULT 'Fall 2026',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_schedule_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT chk_time_window CHECK (start_time < end_time)
) ENGINE=InnoDB;

-- ========================================================
-- Seed Data for Testing & Live Demonstration
-- ========================================================

-- Teachers
INSERT INTO teachers (employee_code, full_name, email, department) VALUES
('EMP101', 'Dr. Alan Turing', 'alan.turing@univ.edu', 'Computer Science'),
('EMP102', 'Dr. Grace Hopper', 'grace.hopper@univ.edu', 'Computer Science'),
('EMP103', 'Prof. Claude Shannon', 'c.shannon@univ.edu', 'Information Theory'),
('EMP104', 'Dr. Ada Lovelace', 'ada.lovelace@univ.edu', 'Mathematics');

-- Classrooms
INSERT INTO classrooms (room_number, building, capacity, room_type) VALUES
('LH-101', 'Turing Academic Block', 60, 'Lecture Hall'),
('LH-102', 'Turing Academic Block', 45, 'Lecture Hall'),
('LAB-201', 'Science & Computing Hub', 35, 'Computer Lab'),
('SEM-301', 'Babbage Hall', 25, 'Seminar Room');

-- Courses
INSERT INTO courses (course_code, title, credits, department) VALUES
('CS101', 'Introduction to Algorithms', 4, 'Computer Science'),
('CS202', 'Database Management Systems', 4, 'Computer Science'),
('MATH105', 'Discrete Mathematics', 3, 'Mathematics'),
('IT301', 'Information & Coding Theory', 3, 'Information Theory');

-- Sections
INSERT INTO sections (section_name, student_count, department) VALUES
('CS-A', 50, 'Computer Science'),
('CS-B', 40, 'Computer Science'),
('IT-A', 30, 'Information Theory');

-- Initial Valid Schedule Entries
INSERT INTO schedule_entries (teacher_id, classroom_id, course_id, section_id, day_of_week, start_time, end_time, academic_term) VALUES
(1, 1, 1, 1, 'Monday', '09:00:00', '10:30:00', 'Fall 2026'),
(2, 3, 2, 2, 'Monday', '11:00:00', '12:30:00', 'Fall 2026'),
(3, 2, 4, 3, 'Tuesday', '10:00:00', '11:30:00', 'Fall 2026');
