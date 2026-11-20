import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TimetableProvider, useTimetable } from './context/TimetableContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import WeeklyMatrix from './pages/WeeklyMatrix';
import ScheduleBuilder from './pages/ScheduleBuilder';
import ConflictReports from './pages/ConflictReports';
import ResourceManagement from './pages/ResourceManagement';

import './App.css';

function MainLayout() {
  const { isSidebarOpen } = useTimetable();

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className={`main-viewport ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/matrix" element={<WeeklyMatrix />} />
            <Route path="/builder" element={<ScheduleBuilder />} />
            <Route path="/conflicts" element={<ConflictReports />} />
            <Route path="/resources" element={<ResourceManagement />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={3500} theme="colored" />
    </div>
  );
}

export default function App() {
  return (
    <TimetableProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </TimetableProvider>
  );
}
