import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaThLarge, 
  FaCalendarWeek, 
  FaPlusSquare, 
  FaExclamationCircle, 
  FaUsersCog,
  FaGraduationCap
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Sidebar() {
  const { auditAllConflicts } = useTimetable();
  const conflictCount = auditAllConflicts().length;

  return (
    <aside className="sidebar-container">
      {/* Brand Header with Animated Official SMS 3D Logo */}
      <div className="sidebar-brand">
        <div className="brand-logo-spc-wrap" title="SMS — Schedule Manager System">
          <img 
            src="/sms-logo.jpg" 
            alt="SMS Brand Logo" 
            className="brand-spc-img animated-logo-pulse" 
          />
        </div>

        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-title">SMS</span>
          </div>
          <span className="brand-subtitle">Plan • Detect • Organize</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">OPERATIONS</div>

        <NavLink to="/" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')} end>
          <FaThLarge className="link-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/matrix" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <FaCalendarWeek className="link-icon" />
          <span>Weekly Timetable</span>
        </NavLink>

        <NavLink to="/builder" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <FaPlusSquare className="link-icon" />
          <span>Schedule Builder</span>
        </NavLink>

        <NavLink to="/conflicts" className={({ isActive }) => (isActive ? 'sidebar-link active badge-link' : 'sidebar-link badge-link')}>
          <div className="icon-with-badge">
            <FaExclamationCircle className="link-icon" />
            {conflictCount > 0 && <span className="sidebar-nav-pill alert">{conflictCount}</span>}
          </div>
          <span>Conflict Reports</span>
        </NavLink>

        <div className="nav-section-label" style={{ marginTop: '1.4rem' }}>CONFIGURATION</div>

        <NavLink to="/resources" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          <FaUsersCog className="link-icon" />
          <span>Resource Manager</span>
        </NavLink>
      </nav>

      {/* Footer Info Card */}
      <div className="sidebar-footer-card">
        <div className="telemetry-header">
          <div className="telemetry-title">
            <FaGraduationCap /> Academic Project
          </div>
          <div className="telemetry-status-dot online"></div>
        </div>
        <p className="footer-text">Core Java Engine • Interval Overlap • MySQL</p>
      </div>
    </aside>
  );
}
