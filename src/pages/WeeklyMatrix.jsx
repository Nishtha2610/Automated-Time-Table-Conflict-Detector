import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FaCalendarWeek, 
  FaFilter, 
  FaTrashAlt, 
  FaDownload, 
  FaFilePdf,
  FaExclamationTriangle,
  FaUndo,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaUsers,
  FaLayerGroup
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  { start: '09:00', end: '10:30', label: '09:00 – 10:30' },
  { start: '10:30', end: '12:00', label: '10:30 – 12:00' },
  { start: '12:00', end: '13:30', label: '12:00 – 13:30' },
  { start: '13:30', end: '15:00', label: '13:30 – 15:00' },
  { start: '15:00', end: '16:30', label: '15:00 – 16:30' },
  { start: '16:30', end: '18:00', label: '16:30 – 18:00' }
];

export default function WeeklyMatrix() {
  const { schedules, sections, classrooms, teachers, deleteSchedule, resetToDefault } = useTimetable();

  const [filterType, setFilterType] = useState('ALL');
  const [filterValue, setFilterValue] = useState('');

  const filteredSchedules = useMemo(() => {
    if (filterType === 'ALL' || !filterValue) return schedules;
    if (filterType === 'SECTION') return schedules.filter(s => s.section?.id === Number(filterValue));
    if (filterType === 'CLASSROOM') return schedules.filter(s => s.classroom?.id === Number(filterValue));
    if (filterType === 'TEACHER') return schedules.filter(s => s.teacher?.id === Number(filterValue));
    return schedules;
  }, [schedules, filterType, filterValue]);

  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const getEntriesForCell = (day, slot) => {
    const slotStart = toMin(slot.start);
    const slotEnd = toMin(slot.end);

    return filteredSchedules.filter(s => {
      if (!s.timeSlot || s.timeSlot.dayOfWeek.toLowerCase() !== day.toLowerCase()) return false;
      const sStart = toMin(s.timeSlot.startTime);
      const sEnd = toMin(s.timeSlot.endTime);
      return Math.max(slotStart, sStart) < Math.min(slotEnd, sEnd);
    });
  };

  // True conflict detection: ONLY true if entries clash on Teacher, Room, or Section!
  const getCellConflictReason = (entries) => {
    if (entries.length < 2) return null;

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i];
        const b = entries[j];

        const aStart = toMin(a.timeSlot.startTime);
        const aEnd = toMin(a.timeSlot.endTime);
        const bStart = toMin(b.timeSlot.startTime);
        const bEnd = toMin(b.timeSlot.endTime);

        const timeOverlaps = Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
        if (timeOverlaps) {
          if (a.teacher?.id === b.teacher?.id) {
            return `Teacher Conflict: ${a.teacher?.fullName} is double-booked!`;
          }
          if (a.classroom?.id === b.classroom?.id) {
            return `Room Conflict: Classroom ${a.classroom?.roomNumber} is double-booked!`;
          }
          if (a.section?.id === b.section?.id) {
            return `Cohort Conflict: Section ${a.section?.sectionName} has 2 simultaneous classes!`;
          }
        }
      }
    }
    return null; // No resource conflict (safe parallel sessions across different rooms)
  };

  const exportDirectPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. Top Red Header Bar (Chitkara Red)
      doc.setFillColor(255, 51, 0);
      doc.rect(0, 0, pageWidth, 52, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SMS — Schedule Manager System | Academic Timetable', 35, 26);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Chitkara University, Punjab • Department of Computer Science & Engineering', 35, 42);

      // 2. Title & Metadata
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Master Weekly Academic Timetable Matrix', 35, 76);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      let filterLabel = 'All Departments (Campus Master View)';
      if (filterType === 'SECTION') {
        const s = sections.find(sec => sec.id === Number(filterValue));
        filterLabel = `Section: ${s?.sectionName || filterValue}`;
      } else if (filterType === 'CLASSROOM') {
        const c = classrooms.find(cr => cr.id === Number(filterValue));
        filterLabel = `Classroom: ${c?.roomNumber || filterValue}`;
      } else if (filterType === 'TEACHER') {
        const t = teachers.find(tch => tch.id === Number(filterValue));
        filterLabel = `Faculty: ${t?.fullName || filterValue}`;
      }

      doc.text(`Active Filter: ${filterLabel}   •   Showing ${filteredSchedules.length} Active Sessions   •   Generated: ${new Date().toLocaleDateString('en-GB')}`, 35, 92);

      // 3. Grid Table
      const tableHeaders = ['Time Slot', ...DAYS];
      const tableData = TIME_SLOTS.map(slot => {
        const row = [slot.label];
        DAYS.forEach(day => {
          const cellEntries = getEntriesForCell(day, slot);
          if (cellEntries.length === 0) {
            row.push('—');
          } else {
            const text = cellEntries.map(e => 
              `${e.course?.courseCode || 'Course'}: ${e.course?.title || ''}\nFaculty: ${e.teacher?.fullName || ''}\nRoom: ${e.classroom?.roomNumber || ''} | Sec: ${e.section?.sectionName || ''}\n(${e.timeSlot?.startTime} - ${e.timeSlot?.endTime})`
            ).join('\n──────────\n');
            row.push(text);
          }
        });
        return row;
      });

      autoTable(doc, {
        startY: 104,
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 85, fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252] },
          1: { cellWidth: (pageWidth - 70 - 85) / 6 },
          2: { cellWidth: (pageWidth - 70 - 85) / 6 },
          3: { cellWidth: (pageWidth - 70 - 85) / 6 },
          4: { cellWidth: (pageWidth - 70 - 85) / 6 },
          5: { cellWidth: (pageWidth - 70 - 85) / 6 },
          6: { cellWidth: (pageWidth - 70 - 85) / 6 },
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 4,
          valign: 'middle',
          lineColor: [226, 232, 240],
          lineWidth: 0.5,
          textColor: [15, 23, 42]
        },
        margin: { left: 35, right: 35 }
      });

      // 4. Bottom Footer Bar
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(255, 0, 0);
        doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(
          `Project ID: G14-PID-11 • Automated Timetable Conflict Detector (SMS) • Faculty Evaluator: Mr. Rahul Kumar • Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }

      // Download directly!
      doc.save('Chitkara_University_Master_Timetable.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header no-print">
        <div>
          <h1 className="page-title">Master Weekly Timetable</h1>
          <p className="page-subtitle">Interactive schedule grid across departments, venues, and student cohorts</p>
        </div>

        <div className="header-action-group">
          <button className="btn-glass-secondary" onClick={resetToDefault} title="Restore initial sample classes">
            <FaUndo /> Reset Demo
          </button>
          <button className="btn-glow-primary" onClick={exportDirectPDF} title="Download Timetable PDF directly">
            <FaDownload /> Download PDF
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar no-print">
        <div className="filter-left">
          <div className="filter-pill-label">
            <FaFilter /> Filter View:
          </div>

          <select 
            className="filter-select"
            value={filterType} 
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue('');
            }}
          >
            <option value="ALL">All Departments (Campus Master View)</option>
            <option value="SECTION">Filter by Student Section</option>
            <option value="CLASSROOM">Filter by Classroom / Lab</option>
            <option value="TEACHER">Filter by Faculty Member</option>
          </select>

          {filterType === 'SECTION' && (
            <select className="filter-select" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              <option value="">Choose Section...</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.sectionName} ({s.department})</option>
              ))}
            </select>
          )}

          {filterType === 'CLASSROOM' && (
            <select className="filter-select" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              <option value="">Choose Classroom...</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.roomNumber} ({c.roomType})</option>
              ))}
            </select>
          )}

          {filterType === 'TEACHER' && (
            <select className="filter-select" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
              <option value="">Choose Faculty...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
          )}
        </div>

        <div className="filter-right-stats">
          <span className="stats-indicator">
            Showing <strong>{filteredSchedules.length}</strong> of <strong>{schedules.length}</strong> active sessions
          </span>
        </div>
      </div>

      {/* Spacious Modern Timetable Matrix */}
      <div className="matrix-outer-card">
        <div className="matrix-scroll-wrapper">
          <table className="spacious-grid-table">
            <thead>
              <tr>
                <th className="grid-th-time">Time Slot</th>
                {DAYS.map(day => (
                  <th key={day} className="grid-th-day">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, sIdx) => (
                <tr key={sIdx} className="grid-row">
                  <td className="grid-td-time">
                    <span className="time-pill">{slot.label}</span>
                  </td>

                  {DAYS.map(day => {
                    const entries = getEntriesForCell(day, slot);
                    const conflictReason = getCellConflictReason(entries);
                    const hasConflict = Boolean(conflictReason);
                    const isParallelSafe = entries.length > 1 && !hasConflict;

                    return (
                      <td 
                        key={day} 
                        className={`grid-td-slot ${hasConflict ? 'slot-has-clash' : ''}`}
                      >
                        {entries.length === 0 ? (
                          <div className="slot-empty-state">
                            <span className="empty-dash">—</span>
                          </div>
                        ) : (
                          <div className="slot-cards-stack">
                            {/* If multiple parallel classes exist in different rooms safely */}
                            {isParallelSafe && (
                              <div className="parallel-classes-pill">
                                <FaLayerGroup /> {entries.length} Parallel Sessions (Different Rooms)
                              </div>
                            )}

                            {entries.map(entry => (
                              <div key={entry.id} className="spacious-lecture-card">
                                <div className="card-header-bar">
                                  <span className="course-code-pill">{entry.course?.courseCode}</span>
                                  <button 
                                    className="card-delete-btn no-print" 
                                    title="Delete lecture slot"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSchedule(entry.id);
                                    }}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>

                                <div className="card-title-text" title={entry.course?.title}>
                                  {entry.course?.title}
                                </div>

                                <div className="card-details-list">
                                  <div className="detail-item">
                                    <FaChalkboardTeacher className="detail-icon" />
                                    <span>{entry.teacher?.fullName}</span>
                                  </div>
                                  <div className="detail-row-split">
                                    <div className="detail-item">
                                      <FaMapMarkerAlt className="detail-icon" />
                                      <span>{entry.classroom?.roomNumber}</span>
                                    </div>
                                    <div className="detail-item section-badge">
                                      <FaUsers className="detail-icon" />
                                      <span>{entry.section?.sectionName}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="card-footer-time">
                                  {entry.timeSlot?.startTime} – {entry.timeSlot?.endTime}
                                </div>
                              </div>
                            ))}

                            {/* Shown ONLY if there is an actual Teacher, Room, or Cohort collision */}
                            {hasConflict && (
                              <div className="slot-conflict-callout">
                                <FaExclamationTriangle /> {conflictReason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
