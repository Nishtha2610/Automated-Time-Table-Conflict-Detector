import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaDoorOpen, 
  FaBook, 
  FaClock, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaCalendarCheck,
  FaArrowRight,
  FaCheckCircle,
  FaLayerGroup
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Dashboard() {
  const { teachers, classrooms, courses, sections, schedules, auditAllConflicts } = useTimetable();
  const conflicts = auditAllConflicts();

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-main-content">
          <div className="hero-badge">
            <FaLayerGroup className="badge-sparkle" />
            <span>Academic Timetable Management Platform</span>
          </div>
          <h1 className="hero-heading">
            Automated Conflict <span className="gradient-text">Detection Engine</span>
          </h1>
          <p className="hero-description">
            Eliminate lecture collisions and scheduling errors before publication. Powered by Core Java
            interval-overlap logic, the system monitors teacher double-bookings, classroom clashes,
            cohort overlaps, and room capacity limits in real time.
          </p>
          <div className="hero-cta-group">
            <Link to="/builder" className="btn-glow-primary">
              <FaCalendarCheck /> Create Schedule
            </Link>
            <Link to="/matrix" className="btn-glass-secondary">
              Master Weekly Grid <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="hero-status-widget">
          <div className={`system-health-card ${conflicts.length > 0 ? 'health-danger' : 'health-success'}`}>
            <div className="health-icon-wrap">
              {conflicts.length > 0 ? <FaExclamationTriangle /> : <FaShieldAlt />}
            </div>
            <div className="health-info-wrap">
              <span className="health-tag">System Health Status</span>
              <h3 className="health-title">
                {conflicts.length > 0 ? `${conflicts.length} Active Collision${conflicts.length > 1 ? 's' : ''}` : '100% Conflict Free'}
              </h3>
              <p className="health-desc">
                {conflicts.length > 0 
                  ? 'Resolve resource overlaps before publishing' 
                  : 'All scheduled sessions satisfy interval and room constraints'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Row */}
      <section className="stats-row">
        <div className="kpi-card card-blue">
          <div className="kpi-icon-box">
            <FaClock />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Scheduled Classes</span>
            <div className="kpi-value">{schedules.length}</div>
            <span className="kpi-subtext">Active weekly sessions</span>
          </div>
        </div>

        <div className="kpi-card card-purple">
          <div className="kpi-icon-box">
            <FaChalkboardTeacher />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Faculty Directory</span>
            <div className="kpi-value">{teachers.length}</div>
            <span className="kpi-subtext">Registered professors</span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon-box">
            <FaDoorOpen />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Classrooms & Labs</span>
            <div className="kpi-value">{classrooms.length}</div>
            <span className="kpi-subtext">Venues configured</span>
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-icon-box">
            <FaBook />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Curriculum Courses</span>
            <div className="kpi-value">{courses.length}</div>
            <span className="kpi-subtext">Active subjects</span>
          </div>
        </div>
      </section>

      {/* Currently Scheduled Sessions Table */}
      <section className="dashboard-table-card">
        <div className="table-header-flex">
          <div>
            <h2 className="table-heading">Currently Scheduled Lectures</h2>
            <p className="table-subheading">Validated timetable entries across lecture halls, computer labs, and cohorts</p>
          </div>
          <Link to="/matrix" className="link-action">
            Full Weekly Timetable Matrix &rarr;
          </Link>
        </div>

        <div className="responsive-table-wrapper">
          <table className="stylish-table">
            <thead>
              <tr>
                <th>Day & Time Slot</th>
                <th>Course Details</th>
                <th>Assigned Instructor</th>
                <th>Classroom Venue</th>
                <th>Student Cohort</th>
                <th>Validation</th>
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
      </section>
    </div>
  );
}
