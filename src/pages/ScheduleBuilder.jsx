import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarPlus, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaUserTie, 
  FaChalkboard, 
  FaUsers, 
  FaClock, 
  FaCalendarDay,
  FaShieldAlt,
  FaArrowRight,
  FaLightbulb
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';
import { toast } from 'react-toastify';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleBuilder() {
  const { teachers, classrooms, courses, sections, addSchedule, validateCandidate } = useTimetable();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    teacherId: teachers[0]?.id || '',
    classroomId: classrooms[0]?.id || '',
    courseId: courses[0]?.id || '',
    sectionId: sections[0]?.id || ''
  });

  const selectedTeacher = useMemo(() => teachers.find(t => t.id === Number(formData.teacherId)), [teachers, formData.teacherId]);
  const selectedClassroom = useMemo(() => classrooms.find(c => c.id === Number(formData.classroomId)), [classrooms, formData.classroomId]);
  const selectedCourse = useMemo(() => courses.find(co => co.id === Number(formData.courseId)), [courses, formData.courseId]);
  const selectedSection = useMemo(() => sections.find(s => s.id === Number(formData.sectionId)), [sections, formData.sectionId]);

  const candidate = useMemo(() => {
    return {
      teacher: selectedTeacher,
      classroom: selectedClassroom,
      course: selectedCourse,
      section: selectedSection,
      timeSlot: {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime
      }
    };
  }, [selectedTeacher, selectedClassroom, selectedCourse, selectedSection, formData]);

  const liveViolations = useMemo(() => {
    return validateCandidate(candidate);
  }, [candidate, validateCandidate]);

  const hasConflict = liveViolations.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      toast.warning('Start time must be strictly before end time.');
      return;
    }

    const res = await addSchedule(candidate);
    if (res.success) {
      navigate('/matrix');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interactive Schedule Builder</h1>
          <p className="page-subtitle">Configure lecture parameters with real-time interval conflict interception</p>
        </div>
      </div>

      <div className="builder-layout">
        {/* Left: Form Container */}
        <div className="content-panel builder-form-panel">
          <div className="form-panel-header">
            <div className="panel-title-group">
              <span className="panel-icon-badge">
                <FaCalendarPlus />
              </span>
              <div>
                <h2 className="panel-main-title">Lecture Assignment</h2>
                <p className="panel-sub-title">Select time slot, curriculum course, venue, and faculty</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="spacious-form">
            {/* Section 1: Time & Day */}
            <div className="form-section-block">
              <span className="form-section-tag">1. Schedule Window</span>
              <div className="form-grid-3">
                <div className="styled-input-group">
                  <label><FaCalendarDay className="input-icon" /> Day of Week</label>
                  <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} required>
                    {DAYS.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="styled-input-group">
                  <label><FaClock className="input-icon" /> Start Time</label>
                  <input 
                    type="time" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="styled-input-group">
                  <label><FaClock className="input-icon" /> End Time</label>
                  <input 
                    type="time" 
                    name="endTime" 
                    value={formData.endTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic Subjects & Cohort */}
            <div className="form-section-block">
              <span className="form-section-tag">2. Curriculum & Cohort</span>
              <div className="form-grid-2">
                <div className="styled-input-group">
                  <label><FaChalkboard className="input-icon" /> Course / Subject</label>
                  <select name="courseId" value={formData.courseId} onChange={handleChange} required>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.courseCode} — {c.title} ({c.credits} Credits)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="styled-input-group">
                  <label><FaUsers className="input-icon" /> Student Section / Cohort</label>
                  <select name="sectionId" value={formData.sectionId} onChange={handleChange} required>
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.sectionName} ({s.studentCount} students) — {s.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Instructor & Venue */}
            <div className="form-section-block">
              <span className="form-section-tag">3. Resource Allocation</span>
              <div className="form-grid-2">
                <div className="styled-input-group">
                  <label><FaUserTie className="input-icon" /> Faculty Instructor</label>
                  <select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.employeeCode}) — {t.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="styled-input-group">
                  <label><FaChalkboard className="input-icon" /> Classroom / Lab Venue</label>
                  <select name="classroomId" value={formData.classroomId} onChange={handleChange} required>
                    {classrooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.roomType}, Cap: {r.capacity}) — {r.building}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="form-action-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                type="submit" 
                className={`btn-action-primary ${hasConflict ? 'btn-action-disabled' : ''}`}
                disabled={hasConflict}
              >
                <span>{hasConflict ? '⚠️ Resolve Conflicts to Save' : 'Confirm & Commit Schedule'}</span>
                <FaArrowRight />
              </button>

              {hasConflict && (
                <button
                  type="button"
                  className="btn-glass-secondary"
                  style={{ borderColor: '#f59e0b', color: '#fbbf24' }}
                  onClick={async () => {
                    const res = await addSchedule(candidate, true);
                    if (res.success) {
                      navigate('/conflicts');
                    }
                  }}
                  title="Simulate this conflict in the database and inspect it in the Audit Center"
                >
                  ⚡ Force Save (Test Conflict Audit)
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Real-time Live Engine Feedback Box */}
        <div className="content-panel builder-feedback-panel">
          <div className="feedback-panel-header">
            <span className="panel-icon-badge cyan">
              <FaShieldAlt />
            </span>
            <div>
              <h3 className="panel-main-title">Interval Validation Engine</h3>
              <p className="panel-sub-title">Real-time interval collision monitor</p>
            </div>
          </div>

          <div className="feedback-body-wrap">
            {hasConflict ? (
              <div className="vibrant-conflict-box">
                <div className="conflict-badge-banner">
                  <FaExclamationTriangle className="banner-alert-icon" />
                  <h4>{liveViolations.length} Active Conflict{liveViolations.length > 1 ? 's' : ''} Intercepted</h4>
                </div>

                <p className="conflict-lead-text">
                  The proposed time interval intersects with existing allocations:
                </p>

                <div className="violation-cards-container">
                  {liveViolations.map((v, i) => (
                    <div key={i} className="violation-item-card">
                      <div className="violation-card-top">
                        <span className="violation-badge">{v.title}</span>
                      </div>
                      <p className="violation-detail-text">{v.description}</p>
                    </div>
                  ))}
                </div>

                <div className="remedy-callout-box">
                  <FaLightbulb className="remedy-icon" />
                  <div>
                    <strong>Suggested Resolution:</strong> Shift the start time window, assign an alternate available room, or pick another day.
                  </div>
                </div>
              </div>
            ) : (
              <div className="vibrant-clean-box">
                <div className="clean-hero-icon-ring">
                  <FaCheckCircle />
                </div>
                <h4 className="clean-title">Zero Conflicts Detected</h4>
                <p className="clean-description">
                  The proposed interval [{formData.startTime} – {formData.endTime}] on {formData.dayOfWeek} is available for all selected resources:
                </p>

                <div className="safe-resource-list">
                  <div className="safe-resource-item">
                    <span className="safe-key">Faculty:</span>
                    <span className="safe-val">{selectedTeacher?.fullName}</span>
                  </div>
                  <div className="safe-resource-item">
                    <span className="safe-key">Venue:</span>
                    <span className="safe-val">{selectedClassroom?.roomNumber} ({selectedClassroom?.roomType})</span>
                  </div>
                  <div className="safe-resource-item">
                    <span className="safe-key">Cohort:</span>
                    <span className="safe-val">{selectedSection?.sectionName} ({selectedSection?.studentCount} Students)</span>
                  </div>
                </div>

                <div className="verified-ready-pill">
                  <FaCheckCircle /> Ready to commit to timetable
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
