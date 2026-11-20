import React from 'react';
import { 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaTrashAlt, 
  FaExchangeAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaUsers
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';
import { Link } from 'react-router-dom';

export default function ConflictReports() {
  const { auditAllConflicts, deleteSchedule, schedules } = useTimetable();
  const conflicts = auditAllConflicts();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timetable Conflict Audit Center</h1>
          <p className="page-subtitle">Detailed conflict logs, interval-overlap diagnostics, and algorithm recommendations</p>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="content-panel zero-conflict-panel">
          <div className="clean-hero-content">
            <div className="clean-shield-glow">
              <FaShieldAlt />
            </div>
            <h2 className="clean-heading">Timetable 100% Conflict Free</h2>
            <p className="clean-lead">
              All <strong>{schedules.length}</strong> active class allocations across lecture halls, computer labs, and student cohorts strictly comply with instructor availability, room occupancy, section schedules, and capacity limits.
            </p>
            <div className="clean-stats-pill-row">
              <span className="clean-stat-chip"><FaCheckCircle /> Zero Faculty Double-Bookings</span>
              <span className="clean-stat-chip"><FaCheckCircle /> Zero Classroom Clashes</span>
              <span className="clean-stat-chip"><FaCheckCircle /> Zero Cohort Overlaps</span>
            </div>
            <Link to="/builder" className="btn-action-primary">
              <FaCalendarAlt /> Schedule Another Lecture <FaArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        <div className="conflict-audit-deck">
          <div className="conflict-alert-banner">
            <FaExclamationTriangle className="alert-banner-icon" />
            <div>
              <h3>{conflicts.length} Unresolved Timetable Conflict{conflicts.length > 1 ? 's' : ''} Require Immediate Attention</h3>
              <p>Timetable finalization is blocked. Resolve overlapping assignments to ensure clash-free academic schedules.</p>
            </div>
          </div>

          <div className="clash-cards-stack">
            {conflicts.map((c) => (
              <div key={c.id} className="content-panel clash-card-item">
                <div className="clash-card-header">
                  <div className="clash-badge-tag">
                    <FaExclamationTriangle /> {c.title}
                  </div>
                  <span className="clash-day-pill">{c.entryA.timeSlot?.dayOfWeek}</span>
                </div>

                <p className="clash-description-lead">{c.detail}</p>

                {/* Side-by-Side Clashing Allocations */}
                <div className="side-by-side-clashes">
                  {/* Allocation 1 */}
                  <div className="allocation-box left">
                    <span className="allocation-label">Existing Lecture Slot #1</span>
                    <h4 className="allocation-title">{c.entryA.course?.title} ({c.entryA.course?.courseCode})</h4>
                    <div className="allocation-meta">
                      <div className="meta-line"><FaUserTie className="meta-icon" /> {c.entryA.teacher?.fullName}</div>
                      <div className="meta-line"><FaMapMarkerAlt className="meta-icon" /> Room {c.entryA.classroom?.roomNumber} ({c.entryA.classroom?.building})</div>
                      <div className="meta-line"><FaUsers className="meta-icon" /> Section {c.entryA.section?.sectionName}</div>
                    </div>
                    <div className="time-highlight-tag">
                      🕒 {c.entryA.timeSlot?.startTime} – {c.entryA.timeSlot?.endTime}
                    </div>
                    <button 
                      className="btn-remove-clash"
                      onClick={() => deleteSchedule(c.entryA.id)}
                    >
                      <FaTrashAlt /> Remove Slot #1
                    </button>
                  </div>

                  {/* Overlap Indicator */}
                  <div className="clash-connector-badge">
                    <FaExchangeAlt />
                    <span>INTERVAL OVERLAP</span>
                  </div>

                  {/* Allocation 2 */}
                  <div className="allocation-box right">
                    <span className="allocation-label">Conflicting Lecture Slot #2</span>
                    <h4 className="allocation-title">{c.entryB.course?.title} ({c.entryB.course?.courseCode})</h4>
                    <div className="allocation-meta">
                      <div className="meta-line"><FaUserTie className="meta-icon" /> {c.entryB.teacher?.fullName}</div>
                      <div className="meta-line"><FaMapMarkerAlt className="meta-icon" /> Room {c.entryB.classroom?.roomNumber} ({c.entryB.classroom?.building})</div>
                      <div className="meta-line"><FaUsers className="meta-icon" /> Section {c.entryB.section?.sectionName}</div>
                    </div>
                    <div className="time-highlight-tag">
                      🕒 {c.entryB.timeSlot?.startTime} – {c.entryB.timeSlot?.endTime}
                    </div>
                    <button 
                      className="btn-remove-clash"
                      onClick={() => deleteSchedule(c.entryB.id)}
                    >
                      <FaTrashAlt /> Remove Slot #2
                    </button>
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className="remedy-callout-box">
                  <FaLightbulb className="remedy-icon" />
                  <div>
                    <strong>Engine Recommendation:</strong> Shift either lecture to a non-overlapping time window (such as after {c.entryA.timeSlot?.endTime}) or reallocate to another unoccupied classroom.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
