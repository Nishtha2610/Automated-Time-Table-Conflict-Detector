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
  const { isSidebarOpen, auditAllConflicts } = useTimetable();
  const conflictCount = auditAllConflicts().length;

  return (
    <aside className={`sidebar-container ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      {isSidebarOpen && (
        <div className="sidebar-brand-box">
          <div className="sidebar-brand-logo-wrap" title="SMS — Schedule Manager System">
            <img 
              src="/sms-logo.jpg" 
              alt="SMS 3D Brand Logo" 
              className="sidebar-brand-img animated-logo-pulse" 
            />
          </div>
          <div className="sidebar-brand-info">
            <div className="sidebar-brand-title-row">
              <span className="sidebar-brand-title">SMS</span>
              <span className="sidebar-edition-pill">PRO</span>
            </div>
            <span className="sidebar-brand-tag">TIMETABLE MANAGER</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section-title">{isSidebarOpen && 'MAIN NAVIGATION'}</div>

        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <FaThLarge className="nav-icon" />
          {isSidebarOpen && <span className="nav-label">Dashboard</span>}
        </NavLink>

        <NavLink to="/matrix" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaCalendarWeek className="nav-icon" />
          {isSidebarOpen && <span className="nav-label">Weekly Timetable</span>}
        </NavLink>

        <NavLink to="/builder" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaPlusSquare className="nav-icon" />
          {isSidebarOpen && <span className="nav-label">Schedule Builder</span>}
        </NavLink>

        <NavLink to="/conflicts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="icon-with-badge">
            <FaExclamationCircle className="nav-icon" />
            {conflictCount > 0 && <span className="sidebar-badge">{conflictCount}</span>}
          </div>
          {isSidebarOpen && <span className="nav-label">Conflict Reports</span>}
        </NavLink>

        <div className="nav-divider"></div>
        <div className="nav-section-title">{isSidebarOpen && 'CONFIGURATION'}</div>

        <NavLink to="/resources" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FaUsersCog className="nav-icon" />
          {isSidebarOpen && <span className="nav-label">Resource Manager</span>}
        </NavLink>
      </nav>

      {isSidebarOpen && (
        <div className="sidebar-footer-card">
          <div className="footer-tech-tag">
            <FaGraduationCap /> Academic Project
          </div>
          <p className="footer-text">OOP Java Engine • Interval Overlap • MySQL Workbench</p>
        </div>
      )}
    </aside>
  );
}
