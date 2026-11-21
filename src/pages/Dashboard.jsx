import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaDoorOpen, 
  FaBook, 
  FaClock, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaCalendarCheck,
  FaCalendarPlus,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { teachers, classrooms, courses, sections, schedules, auditAllConflicts } = useTimetable();
  const conflicts = auditAllConflicts();

  return (
    <div className="dashboard-container">
      {/* Official Hero Banner - Matching StockPulse reference structure */}
      <div className="spc-hero-card animated-hero-banner">
        <div className="spc-hero-content">
          <div className="hero-top-badge">
            <FaCalendarCheck />
            <span>Academic Timetable Management System</span>
          </div>

          <h1 className="hero-main-title">
            Plan • Manage • Detect <span className="hero-title-pulse">Conflict-Free Timetables</span>
          </h1>

          <div className="hero-tagline">
            PLAN • ASSIGN • DETECT • ORGANIZE
          </div>

          <p className="hero-description">
            A centralized platform to create, manage and optimize class schedules with real-time interval conflict detection.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn btn-hero-primary" 
              onClick={() => navigate('/builder')}
            >
              <FaCalendarPlus /> Get Started &rarr;
            </button>
            <button 
              className="btn btn-hero-secondary"
              onClick={() => navigate('/matrix')}
            >
              <FaCalendarAlt /> View Master Grid
            </button>
          </div>

          {/* 5 Real, Functional Feature Pills */}
          <div className="hero-features-strip">
            <Link to="/resources" className="hero-feature-pill">
              <FaChalkboardTeacher className="text-purple" />
              <span>Manage Teachers</span>
            </Link>
            <Link to="/resources" className="hero-feature-pill">
              <FaBook className="text-purple" />
              <span>Manage Courses</span>
            </Link>
            <Link to="/resources" className="hero-feature-pill">
              <FaDoorOpen className="text-purple" />
              <span>Manage Classrooms</span>
            </Link>
            <Link to="/builder" className="hero-feature-pill">
              <FaCalendarPlus className="text-purple" />
              <span>Create Timetables</span>
            </Link>
            <Link to="/conflicts" className="hero-feature-pill">
              <FaExclamationTriangle className="text-purple" />
              <span>Detect Conflicts</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup Preview on the Right */}
        <div className="spc-hero-visual-pane">
          <img 
            src="/hero-banner.jpg" 
            alt="SMS Schedule Manager System Mockup Preview" 
            className="hero-laptop-preview"
          />
        </div>
      </div>

      {/* 4 Metric KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card card-blue">
          <div className="metric-icon-wrap">
            <FaClock className="metric-icon" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Scheduled Classes</span>
            <span className="metric-value">{schedules.length}</span>
            <span className="metric-hint">Active weekly lecture slots</span>
          </div>
        </div>

        <div className="metric-card card-purple">
          <div className="metric-icon-wrap">
            <FaChalkboardTeacher className="metric-icon" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Faculty Directory</span>
            <span className="metric-value">{teachers.length}</span>
            <span className="metric-hint">Registered professors</span>
          </div>
        </div>

        <div className="metric-card card-amber">
          <div className="metric-icon-wrap">
            <FaDoorOpen className="metric-icon" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Classrooms & Labs</span>
            <span className="metric-value">{classrooms.length}</span>
            <span className="metric-hint">Venues configured</span>
          </div>
        </div>

        <div className="metric-card card-emerald">
          <div className="metric-icon-wrap">
            <FaBook className="metric-icon" />
          </div>
          <div className="metric-details">
            <span className="metric-label">Curriculum Courses</span>
            <span className="metric-value">{courses.length}</span>
            <span className="metric-hint">Active academic subjects</span>
          </div>
        </div>
      </div>

      {/* Currently Scheduled Sessions Table Section */}
      <div className="column-card">
        <div className="card-header">
          <div className="header-title">
            <FaCalendarCheck className="header-icon text-purple" />
            <h3>Currently Scheduled Lectures</h3>
          </div>
          <Link to="/matrix" className="header-link">Master Weekly Matrix &rarr;</Link>
        </div>

        <div className="table-responsive-box">
          <table className="custom-table fluid-table">
            <thead>
              <tr>
                <th>Day & Time Slot</th>
                <th>Course Details</th>
                <th>Assigned Instructor</th>
                <th>Classroom Venue</th>
                <th>Student Cohort</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(slot => (
                <tr key={slot.id}>
                  <td>
                    <div className="slot-day-pill">{slot.timeSlot?.dayOfWeek}</div>
                    <div className="slot-time-range">{slot.timeSlot?.startTime} – {slot.timeSlot?.endTime}</div>
                  </td>
                  <td>
                    <div className="course-title-cell">{slot.course?.title}</div>
                    <span className="course-code-pill">{slot.course?.courseCode}</span>
                  </td>
                  <td>
                    <div className="faculty-name-cell">{slot.teacher?.fullName}</div>
                    <span className="faculty-dept-sub">{slot.teacher?.department}</span>
                  </td>
                  <td>
                    <div className="room-name-cell">{slot.classroom?.roomNumber}</div>
                    <span className="room-meta-sub">{slot.classroom?.roomType} • Cap: {slot.classroom?.capacity}</span>
                  </td>
                  <td>
                    <div className="section-name-cell">{slot.section?.sectionName}</div>
                    <span className="section-headcount-sub">{slot.section?.studentCount} Students</span>
                  </td>
                  <td>
                    <span className="badge-verified">
                      <FaCheckCircle /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
