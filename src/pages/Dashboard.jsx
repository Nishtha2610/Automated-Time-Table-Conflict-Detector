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
      {/* Primary SMS Hero Banner Section */}
      <section className="sms-hero-section">
        <div className="sms-banner-container">
          {/* Main Hero Banner Visual */}
          <div className="sms-banner-art-wrapper">
            <img 
              src="/hero-banner.jpg" 
              alt="SMS - Schedule Manager System Banner" 
              className="sms-banner-image"
            />
            <div className="sms-banner-ambient-glow"></div>
            
            {/* Functional Interactive Layer overlaying the Banner Image */}
            <div className="sms-banner-interactive-overlay">
              {/* Functional 'Get Started ->' Button positioned precisely over the banner button */}
              <Link 
                to="/builder" 
                className="banner-functional-get-started-btn"
                title="Get Started — Create Conflict-Free Schedule"
              >
                <span className="btn-text">Get Started</span>
                <span className="btn-arrow">&rarr;</span>
              </Link>

              {/* Functional Hotspots for the 5 Features at the bottom of the banner */}
              <div className="banner-hotspots-container">
                <Link to="/resources" className="banner-feature-hotspot" title="Manage Teachers Directory">
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-label">Manage Teachers</span>
                </Link>
                <Link to="/resources" className="banner-feature-hotspot" title="Manage Curriculum Courses">
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-label">Manage Courses</span>
                </Link>
                <Link to="/resources" className="banner-feature-hotspot" title="Manage Classrooms & Venues">
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-label">Manage Classrooms</span>
                </Link>
                <Link to="/builder" className="banner-feature-hotspot" title="Create New Timetable Schedules">
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-label">Create Timetables</span>
                </Link>
                <Link to="/conflicts" className="banner-feature-hotspot" title="Detect & Resolve Schedule Conflicts">
                  <span className="hotspot-pulse"></span>
                  <span className="hotspot-label">Detect Conflicts</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Status & Action Strip */}
          <div className="sms-banner-substrip">
            <div className="substrip-left">
              <div className={`health-pill ${conflicts.length > 0 ? 'alert' : 'safe'}`}>
                {conflicts.length > 0 ? <FaExclamationTriangle /> : <FaShieldAlt />}
                <span>
                  {conflicts.length > 0 
                    ? `${conflicts.length} Active Collision${conflicts.length > 1 ? 's' : ''} Detected` 
                    : '100% Conflict Free — Real-Time Java Engine Active'}
                </span>
              </div>
            </div>
            <div className="substrip-actions">
              <Link to="/matrix" className="btn-metallic-secondary">
                <FaCalendarCheck /> View Weekly Timetable
              </Link>
              <Link to="/conflicts" className="btn-metallic-secondary">
                <FaExclamationTriangle /> Conflict Audit ({conflicts.length})
              </Link>
              <Link to="/builder" className="btn-metallic-primary">
                <FaArrowRight /> Launch Schedule Builder
              </Link>
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
