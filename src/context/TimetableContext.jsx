import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TimetableContext = createContext();

const API_BASE = 'http://localhost:8080/api';

// Initial fallback seed data
const DEFAULT_TEACHERS = [
  { id: 1, employeeCode: 'EMP101', fullName: 'Dr. Alan Turing', email: 'alan.turing@univ.edu', department: 'Computer Science' },
  { id: 2, employeeCode: 'EMP102', fullName: 'Dr. Grace Hopper', email: 'grace.hopper@univ.edu', department: 'Computer Science' },
  { id: 3, employeeCode: 'EMP103', fullName: 'Prof. Claude Shannon', email: 'c.shannon@univ.edu', department: 'Information Theory' },
  { id: 4, employeeCode: 'EMP104', fullName: 'Dr. Ada Lovelace', email: 'ada.lovelace@univ.edu', department: 'Mathematics' }
];

const DEFAULT_CLASSROOMS = [
  { id: 1, roomNumber: 'LH-101', building: 'Turing Block', capacity: 60, roomType: 'Lecture Hall' },
  { id: 2, roomNumber: 'LH-102', building: 'Turing Block', capacity: 45, roomType: 'Lecture Hall' },
  { id: 3, roomNumber: 'LAB-201', building: 'Computing Hub', capacity: 35, roomType: 'Computer Lab' },
  { id: 4, roomNumber: 'SEM-301', building: 'Babbage Hall', capacity: 25, roomType: 'Seminar Room' }
];

const DEFAULT_COURSES = [
  { id: 1, courseCode: 'CS101', title: 'Introduction to Algorithms', credits: 4, department: 'Computer Science' },
  { id: 2, courseCode: 'CS202', title: 'Database Management Systems', credits: 4, department: 'Computer Science' },
  { id: 3, courseCode: 'MATH105', title: 'Discrete Mathematics', credits: 3, department: 'Mathematics' },
  { id: 4, courseCode: 'IT301', title: 'Information & Coding Theory', credits: 3, department: 'Information Theory' }
];

const DEFAULT_SECTIONS = [
  { id: 1, sectionName: 'CS-A', studentCount: 50, department: 'Computer Science' },
  { id: 2, sectionName: 'CS-B', studentCount: 40, department: 'Computer Science' },
  { id: 3, sectionName: 'IT-A', studentCount: 30, department: 'Information Theory' }
];

const DEFAULT_SCHEDULES = [
  {
    id: 1,
    teacher: DEFAULT_TEACHERS[0],
    classroom: DEFAULT_CLASSROOMS[0],
    course: DEFAULT_COURSES[0],
    section: DEFAULT_SECTIONS[0],
    timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30' },
    academicTerm: 'Fall 2026'
  },
  {
    id: 2,
    teacher: DEFAULT_TEACHERS[1],
    classroom: DEFAULT_CLASSROOMS[2],
    course: DEFAULT_COURSES[1],
    section: DEFAULT_SECTIONS[1],
    timeSlot: { dayOfWeek: 'Monday', startTime: '10:30', endTime: '12:00' },
    academicTerm: 'Fall 2026'
  },
  {
    id: 3,
    teacher: DEFAULT_TEACHERS[2],
    classroom: DEFAULT_CLASSROOMS[1],
    course: DEFAULT_COURSES[3],
    section: DEFAULT_SECTIONS[2],
    timeSlot: { dayOfWeek: 'Tuesday', startTime: '10:30', endTime: '12:00' },
    academicTerm: 'Fall 2026'
  },
  {
    id: 4,
    teacher: DEFAULT_TEACHERS[3],
    classroom: DEFAULT_CLASSROOMS[3],
    course: DEFAULT_COURSES[2],
    section: DEFAULT_SECTIONS[0],
    timeSlot: { dayOfWeek: 'Wednesday', startTime: '13:30', endTime: '15:00' },
    academicTerm: 'Fall 2026'
  }
];

// Helper to safely load from LocalStorage
const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`chrono_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

export function TimetableProvider({ children }) {
  const [teachers, setTeachers] = useState(() => loadStorage('teachers', DEFAULT_TEACHERS));
  const [classrooms, setClassrooms] = useState(() => loadStorage('classrooms', DEFAULT_CLASSROOMS));
  const [courses, setCourses] = useState(() => loadStorage('courses', DEFAULT_COURSES));
  const [sections, setSections] = useState(() => loadStorage('sections', DEFAULT_SECTIONS));
  const [schedules, setSchedules] = useState(() => loadStorage('schedules', DEFAULT_SCHEDULES));

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync state to localStorage on every modification
  useEffect(() => {
    localStorage.setItem('chrono_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('chrono_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('chrono_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('chrono_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('chrono_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Try connecting with Java backend if running
  useEffect(() => {
    fetch(`${API_BASE}/schedules`, { method: 'GET', signal: AbortSignal.timeout(1500) })
      .then(res => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSchedules(data);
        }
        setIsBackendConnected(true);
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, []);

  // Interval overlap calculation: Max(S1, S2) < Min(E1, E2)
  const checkIntervalOverlap = (slot1, slot2) => {
    if (!slot1 || !slot2) return false;
    if (slot1.dayOfWeek.toLowerCase() !== slot2.dayOfWeek.toLowerCase()) return false;

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const s1 = toMinutes(slot1.startTime);
    const e1 = toMinutes(slot1.endTime);
    const s2 = toMinutes(slot2.startTime);
    const e2 = toMinutes(slot2.endTime);

    return Math.max(s1, s2) < Math.min(e1, e2);
  };

  // Real-time conflict validation
  const validateCandidate = (candidate) => {
    const violations = [];
    if (!candidate || !candidate.timeSlot) return violations;

    // 1. Capacity Check
    if (candidate.classroom && candidate.section) {
      if (candidate.section.studentCount > candidate.classroom.capacity) {
        violations.push({
          type: 'CAPACITY_EXCEEDED',
          title: 'Classroom Capacity Deficit',
          description: `Room ${candidate.classroom.roomNumber} has ${candidate.classroom.capacity} seats, but Section ${candidate.section.sectionName} has ${candidate.section.studentCount} students.`
        });
      }
    }

    // 2. Interval Collision Checks
    for (const entry of schedules) {
      if (candidate.id && candidate.id === entry.id) continue;

      if (checkIntervalOverlap(candidate.timeSlot, entry.timeSlot)) {
        // Teacher double booking
        if (candidate.teacher && entry.teacher && candidate.teacher.id === entry.teacher.id) {
          violations.push({
            type: 'TEACHER_DOUBLE_BOOKED',
            title: 'Teacher Double Booking',
            description: `${entry.teacher.fullName} is already assigned on ${entry.timeSlot.dayOfWeek} (${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}) in ${entry.classroom.roomNumber}.`
          });
        }

        // Room clash
        if (candidate.classroom && entry.classroom && candidate.classroom.id === entry.classroom.id) {
          violations.push({
            type: 'ROOM_DOUBLE_BOOKED',
            title: 'Classroom Conflict',
            description: `Room ${entry.classroom.roomNumber} is occupied on ${entry.timeSlot.dayOfWeek} (${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}) by ${entry.section.sectionName}.`
          });
        }

        // Section collision
        if (candidate.section && entry.section && candidate.section.id === entry.section.id) {
          violations.push({
            type: 'SECTION_DOUBLE_BOOKED',
            title: 'Student Cohort Overlap',
            description: `Section ${entry.section.sectionName} already has '${entry.course.courseCode}' scheduled on ${entry.timeSlot.dayOfWeek} (${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}).`
          });
        }
      }
    }

    return violations;
  };

  // Add new schedule
  const addSchedule = async (newEntry, force = false) => {
    const conflicts = validateCandidate(newEntry);
    if (conflicts.length > 0 && !force) {
      toast.error('Cannot save: Timetable conflict detected!');
      return { success: false, conflicts };
    }

    if (isBackendConnected) {
      try {
        const payload = {
          teacherId: newEntry.teacher.id,
          classroomId: newEntry.classroom.id,
          courseId: newEntry.course.id,
          sectionId: newEntry.section.id,
          dayOfWeek: newEntry.timeSlot.dayOfWeek,
          startTime: newEntry.timeSlot.startTime,
          endTime: newEntry.timeSlot.endTime
        };

        const res = await fetch(`${API_BASE}/schedules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          const savedEntry = result.entry || { ...newEntry, id: Date.now() };
          setSchedules(prev => [...prev, savedEntry]);
          toast.success('Lecture verified & saved to MySQL database!');
          return { success: true };
        } else {
          const err = await res.json();
          if (!force) {
            toast.error(err.error || 'Server rejected due to conflict');
            return { success: false, conflicts: err.conflicts || [] };
          }
        }
      } catch (e) {
        console.warn('Backend offline, saving locally');
      }
    }

    // Persist locally
    const entryWithId = { ...newEntry, id: Date.now() };
    setSchedules(prev => {
      const updated = [...prev, entryWithId];
      localStorage.setItem('chrono_schedules', JSON.stringify(updated));
      return updated;
    });
    if (force) {
      toast.warn('⚠️ Schedule force-committed: Conflict is now active in Audit Center!');
    } else {
      toast.success('Lecture scheduled with 0 conflicts!');
    }
    return { success: true };
  };

  // Inject a simulated conflict test case for demonstration/testing
  const injectConflictTestCase = () => {
    const testClash = {
      id: Date.now(),
      teacher: DEFAULT_TEACHERS[0], // Dr. Alan Turing (already teaching CS101 in LH-101 at 09:00 - 10:30)
      classroom: DEFAULT_CLASSROOMS[0], // Room LH-101 (already booked)
      course: DEFAULT_COURSES[1], // CS202 Database Systems
      section: DEFAULT_SECTIONS[1], // Section CS-B
      timeSlot: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30' },
      academicTerm: 'Fall 2026'
    };

    setSchedules(prev => {
      const updated = [...prev, testClash];
      localStorage.setItem('chrono_schedules', JSON.stringify(updated));
      return updated;
    });
    toast.warn('⚠️ Conflict Test Case Injected: Double-booking created on Monday 09:00 – 10:30!');
  };

  // Delete schedule — PERSISTS IN LOCALSTORAGE
  const deleteSchedule = async (id) => {
    if (isBackendConnected) {
      try {
        await fetch(`${API_BASE}/schedules?id=${id}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Backend delete sync skipped');
      }
    }
    setSchedules(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('chrono_schedules', JSON.stringify(updated));
      return updated;
    });
    toast.info('Schedule slot deleted.');
  };

  // Reset to default seed data if needed
  const resetToDefault = () => {
    setSchedules(DEFAULT_SCHEDULES);
    localStorage.setItem('chrono_schedules', JSON.stringify(DEFAULT_SCHEDULES));
    toast.success('Reset to default schedule demo.');
  };

  // Audit all conflicts
  const auditAllConflicts = () => {
    const allViolations = [];
    const n = schedules.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = schedules[i];
        const b = schedules[j];
        if (checkIntervalOverlap(a.timeSlot, b.timeSlot)) {
          if (a.teacher.id === b.teacher.id) {
            allViolations.push({
              id: `${a.id}-${b.id}-teacher`,
              type: 'TEACHER_DOUBLE_BOOKED',
              title: `Teacher Clash: ${a.teacher.fullName}`,
              entryA: a,
              entryB: b,
              detail: `Concurrently assigned to ${a.course.courseCode} and ${b.course.courseCode} on ${a.timeSlot.dayOfWeek} (${a.timeSlot.startTime} - ${a.timeSlot.endTime}).`
            });
          }
          if (a.classroom.id === b.classroom.id) {
            allViolations.push({
              id: `${a.id}-${b.id}-room`,
              type: 'ROOM_DOUBLE_BOOKED',
              title: `Classroom Clash: ${a.classroom.roomNumber}`,
              entryA: a,
              entryB: b,
              detail: `Double-booked by Section ${a.section.sectionName} and ${b.section.sectionName} on ${a.timeSlot.dayOfWeek}.`
            });
          }
          if (a.section.id === b.section.id) {
            allViolations.push({
              id: `${a.id}-${b.id}-section`,
              type: 'SECTION_DOUBLE_BOOKED',
              title: `Cohort Collision: ${a.section.sectionName}`,
              entryA: a,
              entryB: b,
              detail: `Simultaneous classes scheduled on ${a.timeSlot.dayOfWeek}.`
            });
          }
        }
      }
    }
    return allViolations;
  };

  return (
    <TimetableContext.Provider value={{
      teachers, setTeachers,
      classrooms, setClassrooms,
      courses, setCourses,
      sections, setSections,
      schedules, setSchedules,
      addSchedule, deleteSchedule, resetToDefault,
      injectConflictTestCase,
      validateCandidate, auditAllConflicts,
      isBackendConnected,
      isSidebarOpen, setIsSidebarOpen
    }}>
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  return useContext(TimetableContext);
}
