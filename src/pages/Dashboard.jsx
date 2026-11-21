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
      {/* Primary SMS Hero Banner Section (Exact Match to User Visual) */}
      <section className="sms-hero-section">
        <div className="sms-banner-container">
          {/* Main Hero Banner Visual */}
          <div className="sms-banner-art-wrapper">
            <img 
              src="/hero-banner.jpg" 
              alt="SMS - Schedule Manager System Banner" 
              className="sms-banner-image"
            />
            
            {/* Functional Invisible Interactive Hotspot Layer */}
            <div className="sms-banner-interactive-overlay">
              {/* 1. Functional 'Get Started ->' Button Hotspot (Directly over the banner's capsule button) */}
              <Link 
                to="/builder" 
                className="banner-hotspot-get-started"
                title="Get Started — Create Conflict-Free Schedule"
                aria-label="Get Started"
              />

              {/* 2. Hotspots for the 5 Feature Badges on the Banner */}
              <Link 
                to="/resources" 
                className="banner-hotspot-item hotspot-teachers"
                title="Manage Teachers Directory"
                aria-label="Manage Teachers"
              />
              <Link 
                to="/resources" 
                className="banner-hotspot-item hotspot-courses"
                title="Manage Curriculum Courses"
                aria-label="Manage Courses"
              />
              <Link 
                to="/resources" 
                className="banner-hotspot-item hotspot-classrooms"
                title="Manage Classrooms & Labs"
                aria-label="Manage Classrooms"
              />
              <Link 
                to="/builder" 
                className="banner-hotspot-item hotspot-timetables"
                title="Create Timetables"
                aria-label="Create Timetables"
              />
              <Link 
                to="/conflicts" 
                className="banner-hotspot-item hotspot-conflicts"
                title="Detect & Resolve Conflicts"
                aria-label="Detect Conflicts"
              />
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
