import React, { useState } from 'react';
import { 
  FaChalkboardTeacher, 
  FaDoorOpen, 
  FaBook, 
  FaUsers, 
  FaPlus,
  FaCheckCircle,
  FaIdBadge,
  FaEnvelope,
  FaBuilding,
  FaChair
} from 'react-icons/fa';
import { useTimetable } from '../context/TimetableContext';
import { toast } from 'react-toastify';

export default function ResourceManagement() {
  const { 
    teachers, setTeachers, 
    classrooms, setClassrooms, 
    courses, setCourses, 
    sections, setSections 
  } = useTimetable();

  const [activeTab, setActiveTab] = useState('TEACHERS');

  const [teacherForm, setTeacherForm] = useState({ employeeCode: '', fullName: '', email: '', department: 'Computer Science' });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', building: '', capacity: 50, roomType: 'Lecture Hall' });
  const [courseForm, setCourseForm] = useState({ courseCode: '', title: '', credits: 3, department: 'Computer Science' });
  const [sectionForm, setSectionForm] = useState({ sectionName: '', studentCount: 40, department: 'Computer Science' });

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const newT = { ...teacherForm, id: Date.now() };
    setTeachers(prev => [...prev, newT]);
    toast.success(`Faculty member "${newT.fullName}" registered successfully!`);
    setTeacherForm({ employeeCode: '', fullName: '', email: '', department: 'Computer Science' });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newR = { ...roomForm, capacity: Number(roomForm.capacity), id: Date.now() };
    setClassrooms(prev => [...prev, newR]);
    toast.success(`Classroom "${newR.roomNumber}" added!`);
    setRoomForm({ roomNumber: '', building: '', capacity: 50, roomType: 'Lecture Hall' });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const newC = { ...courseForm, credits: Number(courseForm.credits), id: Date.now() };
    setCourses(prev => [...prev, newC]);
    toast.success(`Course "${newC.courseCode}" registered!`);
    setCourseForm({ courseCode: '', title: '', credits: 3, department: 'Computer Science' });
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    const newS = { ...sectionForm, studentCount: Number(sectionForm.studentCount), id: Date.now() };
    setSections(prev => [...prev, newS]);
    toast.success(`Student Section "${newS.sectionName}" created!`);
    setSectionForm({ sectionName: '', studentCount: 40, department: 'Computer Science' });
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resource & Curriculum Manager</h1>
          <p className="page-subtitle">Configure instructors, physical lecture venues, curriculum subjects, and student cohorts</p>
        </div>
      </div>

      {/* Modern Tabs Bar */}
      <div className="modern-tabs-strip">
        <button 
          className={`tab-pill-btn ${activeTab === 'TEACHERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TEACHERS')}
        >
          <FaChalkboardTeacher /> Faculty Members ({teachers.length})
        </button>

        <button 
          className={`tab-pill-btn ${activeTab === 'ROOMS' ? 'active' : ''}`}
          onClick={() => setActiveTab('ROOMS')}
        >
          <FaDoorOpen /> Classrooms & Labs ({classrooms.length})
        </button>

        <button 
          className={`tab-pill-btn ${activeTab === 'COURSES' ? 'active' : ''}`}
          onClick={() => setActiveTab('COURSES')}
        >
          <FaBook /> Courses ({courses.length})
        </button>

        <button 
          className={`tab-pill-btn ${activeTab === 'SECTIONS' ? 'active' : ''}`}
          onClick={() => setActiveTab('SECTIONS')}
        >
          <FaUsers /> Sections ({sections.length})
        </button>
      </div>

      {/* Tab 1: Faculty */}
      {activeTab === 'TEACHERS' && (
        <div className="resource-dual-grid">
          <div className="dashboard-table-card">
            <h3 className="card-inner-title">Registered Faculty</h3>
            <div className="responsive-table-wrapper">
              <table className="stylish-table">
                <thead>
                  <tr>
                    <th>Emp Code</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t.id}>
                      <td><span className="course-code-pill">{t.employeeCode}</span></td>
                      <td><strong>{t.fullName}</strong></td>
                      <td><span className="text-dim">{t.email}</span></td>
                      <td><span className="dept-tag">{t.department}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-table-card form-panel">
            <h3 className="card-inner-title"><FaPlus /> Register New Faculty</h3>
            <form onSubmit={handleAddTeacher} className="stacked-form">
              <div className="form-input-group">
                <label><FaIdBadge /> Employee Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. EMP105" 
                  value={teacherForm.employeeCode} 
                  onChange={e => setTeacherForm(p => ({ ...p, employeeCode: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaChalkboardTeacher /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. John von Neumann" 
                  value={teacherForm.fullName} 
                  onChange={e => setTeacherForm(p => ({ ...p, fullName: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaEnvelope /> University Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. jvn@univ.edu" 
                  value={teacherForm.email} 
                  onChange={e => setTeacherForm(p => ({ ...p, email: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBuilding /> Academic Department</label>
                <input 
                  type="text" 
                  value={teacherForm.department} 
                  onChange={e => setTeacherForm(p => ({ ...p, department: e.target.value }))}
                  required 
                />
              </div>

              <button type="submit" className="btn-glow-primary btn-full">
                Add Faculty Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Classrooms */}
      {activeTab === 'ROOMS' && (
        <div className="resource-dual-grid">
          <div className="dashboard-table-card">
            <h3 className="card-inner-title">Configured Venues & Laboratories</h3>
            <div className="responsive-table-wrapper">
              <table className="stylish-table">
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Building / Block</th>
                    <th>Venue Type</th>
                    <th>Seating Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.roomNumber}</strong></td>
                      <td>{c.building}</td>
                      <td><span className="room-type-badge">{c.roomType}</span></td>
                      <td><span className="capacity-pill">{c.capacity} Seats</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-table-card form-panel">
            <h3 className="card-inner-title"><FaPlus /> Add New Venue</h3>
            <form onSubmit={handleAddRoom} className="stacked-form">
              <div className="form-input-group">
                <label><FaDoorOpen /> Room Number / Tag</label>
                <input 
                  type="text" 
                  placeholder="e.g. LH-205" 
                  value={roomForm.roomNumber} 
                  onChange={e => setRoomForm(p => ({ ...p, roomNumber: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBuilding /> Building / Complex</label>
                <input 
                  type="text" 
                  placeholder="e.g. Turing Academic Block" 
                  value={roomForm.building} 
                  onChange={e => setRoomForm(p => ({ ...p, building: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaChair /> Seating Capacity</label>
                <input 
                  type="number" 
                  min="10" 
                  max="500" 
                  value={roomForm.capacity} 
                  onChange={e => setRoomForm(p => ({ ...p, capacity: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBuilding /> Venue Type</label>
                <select 
                  value={roomForm.roomType} 
                  onChange={e => setRoomForm(p => ({ ...p, roomType: e.target.value }))}
                >
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Seminar Room">Seminar Room</option>
                </select>
              </div>

              <button type="submit" className="btn-glow-primary btn-full">
                Add Classroom Venue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Courses */}
      {activeTab === 'COURSES' && (
        <div className="resource-dual-grid">
          <div className="dashboard-table-card">
            <h3 className="card-inner-title">Curriculum Courses</h3>
            <div className="responsive-table-wrapper">
              <table className="stylish-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(co => (
                    <tr key={co.id}>
                      <td><span className="course-code-pill">{co.courseCode}</span></td>
                      <td><strong>{co.title}</strong></td>
                      <td>{co.credits} Credits</td>
                      <td><span className="dept-tag">{co.department}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-table-card form-panel">
            <h3 className="card-inner-title"><FaPlus /> Add New Course</h3>
            <form onSubmit={handleAddCourse} className="stacked-form">
              <div className="form-input-group">
                <label><FaBook /> Course Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. CS305" 
                  value={courseForm.courseCode} 
                  onChange={e => setCourseForm(p => ({ ...p, courseCode: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBook /> Course Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Operating Systems" 
                  value={courseForm.title} 
                  onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaCheckCircle /> Academic Credits</label>
                <input 
                  type="number" 
                  min="1" 
                  max="6" 
                  value={courseForm.credits} 
                  onChange={e => setCourseForm(p => ({ ...p, credits: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBuilding /> Department</label>
                <input 
                  type="text" 
                  value={courseForm.department} 
                  onChange={e => setCourseForm(p => ({ ...p, department: e.target.value }))}
                  required 
                />
              </div>

              <button type="submit" className="btn-glow-primary btn-full">
                Add Course to Curriculum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Sections */}
      {activeTab === 'SECTIONS' && (
        <div className="resource-dual-grid">
          <div className="dashboard-table-card">
            <h3 className="card-inner-title">Student Cohorts & Batches</h3>
            <div className="responsive-table-wrapper">
              <table className="stylish-table">
                <thead>
                  <tr>
                    <th>Section Name</th>
                    <th>Student Headcount</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map(s => (
                    <tr key={s.id}>
                      <td><span className="section-pill-tag">{s.sectionName}</span></td>
                      <td><strong>{s.studentCount} Students</strong></td>
                      <td><span className="dept-tag">{s.department}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-table-card form-panel">
            <h3 className="card-inner-title"><FaPlus /> Add New Section</h3>
            <form onSubmit={handleAddSection} className="stacked-form">
              <div className="form-input-group">
                <label><FaUsers /> Section / Cohort Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. CS-C" 
                  value={sectionForm.sectionName} 
                  onChange={e => setSectionForm(p => ({ ...p, sectionName: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaUsers /> Enrolled Students Count</label>
                <input 
                  type="number" 
                  min="5" 
                  max="200" 
                  value={sectionForm.studentCount} 
                  onChange={e => setSectionForm(p => ({ ...p, studentCount: e.target.value }))}
                  required 
                />
              </div>

              <div className="form-input-group">
                <label><FaBuilding /> Department</label>
                <input 
                  type="text" 
                  value={sectionForm.department} 
                  onChange={e => setSectionForm(p => ({ ...p, department: e.target.value }))}
                  required 
                />
              </div>

              <button type="submit" className="btn-glow-primary btn-full">
                Create Student Section
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
