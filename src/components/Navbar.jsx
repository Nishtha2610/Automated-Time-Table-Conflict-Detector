import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBars, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaPlusCircle,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Navbar() {
  const { isSidebarOpen, setIsSidebarOpen, auditAllConflicts } = useTimetable();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const conflicts = auditAllConflicts();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Error enabling fullscreen mode:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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

        <Link to="/" className="navbar-brand" title="SMS — Schedule Manager System">
          <div className="brand-logo-container">
            <img 
              src="/sms-logo.jpg" 
              alt="SMS 3D Logo" 
              className="navbar-brand-logo animated-logo-pulse" 
            />
            <div className="logo-ambient-halo"></div>
          </div>
          <div className="brand-text-group">
            <div className="brand-title-row">
              <span className="brand-title-sms">SMS</span>
              <span className="brand-title-divider">|</span>
              <span className="brand-title">Schedule Manager System</span>
            </div>
            <span className="brand-subtitle">PLAN • ASSIGN • DETECT • ORGANIZE</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
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

        {/* Fullscreen Mode Toggle Button (Matching StockPulse reference) */}
        <button 
          className="btn-topbar-fullscreen"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen Mode (F11)'}
          aria-label={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    </header>
  );
}
