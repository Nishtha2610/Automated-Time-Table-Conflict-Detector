import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaBars, 
  FaShieldAlt, 
  FaDatabase, 
  FaExclamationTriangle,
  FaPlusCircle
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Navbar() {
  const { isSidebarOpen, setIsSidebarOpen, isBackendConnected, auditAllConflicts } = useTimetable();
  const conflicts = auditAllConflicts();

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Navigation Menu"
        >
          <FaBars />
        </button>

        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <FaCalendarAlt className="brand-icon" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">ChronoScheduler</span>
            <span className="brand-subtitle">Automated Conflict Detector</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Connection status pill */}
        <div className={`status-pill ${isBackendConnected ? 'connected' : 'standalone'}`}>
          <FaDatabase className="status-icon" />
          <span>{isBackendConnected ? 'MySQL + Java Connected' : 'Local Sandbox Mode'}</span>
        </div>

        {/* Conflict Alert Counter */}
        <Link to="/conflicts" className={`conflict-badge-pill ${conflicts.length > 0 ? 'alert' : 'clean'}`}>
          {conflicts.length > 0 ? (
            <>
              <FaExclamationTriangle className="alert-icon" />
              <span>{conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected</span>
            </>
          ) : (
            <>
              <FaShieldAlt className="shield-icon" />
              <span>0 Conflicts (Clean)</span>
            </>
          )}
        </Link>

        {/* Quick Add Schedule CTA */}
        <Link to="/builder" className="btn-quick-add">
          <FaPlusCircle />
          <span>New Schedule</span>
        </Link>
      </div>
    </header>
  );
}
