import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaPlusCircle,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

export default function Header() {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { auditAllConflicts } = useTimetable();
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

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/': 
        return { 
          title: 'Executive Overview', 
          subtitle: 'Live timetable schedule matrix and real-time conflict telemetry' 
        };
      case '/matrix': 
        return { 
          title: 'Weekly Timetable Matrix', 
          subtitle: 'Interactive 5-day academic master schedule grid' 
        };
      case '/builder': 
        return { 
          title: 'Schedule Builder Engine', 
          subtitle: 'Create lectures with real-time interval conflict interception' 
        };
      case '/conflicts': 
        return { 
          title: 'Conflict Reports & Audit', 
          subtitle: 'Detailed diagnostics on teacher, classroom, and cohort overlaps' 
        };
      case '/resources': 
        return { 
          title: 'Resource Management', 
          subtitle: 'Faculty directory, classroom venues, curriculum courses, and cohorts' 
        };
      default: 
        return { 
          title: 'Schedule Manager System', 
          subtitle: 'Automated Timetable Conflict Detector' 
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header className="topbar-header">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-right">
        {/* Conflict Alert Pill */}
        <Link to="/conflicts" className={`conflict-badge-pill ${conflicts.length > 0 ? 'alert' : 'clean'}`}>
          {conflicts.length > 0 ? (
            <>
              <FaExclamationTriangle />
              <span>{conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Detected</span>
            </>
          ) : (
            <>
              <FaShieldAlt />
              <span>0 Conflicts (Clean)</span>
            </>
          )}
        </Link>

        {/* Quick Add Schedule CTA Button */}
        <Link to="/builder" className="btn btn-primary btn-sm">
          <FaPlusCircle />
          <span>New Schedule</span>
        </Link>

        {/* Fullscreen Mode Toggle Button */}
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
